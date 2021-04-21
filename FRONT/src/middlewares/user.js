/* eslint-disable no-empty */
import {
  SEND_SIGN_IN_FORM,
  SEND_LOGIN,
  SEND_DISCONNECT,
  EMAIL_SUBMIT,
  setUserIsSignIn,
  login,
  logout,
  setMessage,
  setError,
} from 'src/actions/user';
import axios from 'src/api';

export default (store) => (next) => async (action) => {
  const {
    user: {
      newEmail, pseudo, password, firstName, lastName, emailAddress, passwordConfirm,
    },
  } = store.getState();
  console.log('middleware user newEmail =>', newEmail);
  switch (action.type) {
    case SEND_LOGIN: {
      try {
        localStorage.clear();
        const response = await axios.post('connexion', { pseudo, password });
        // Une fois que c'est terminé, si le login est bon on connecte
        localStorage.setItem('tokens', response.data.token);
        // localStorage.setItem('xsrfToken', JSON.stringify(result.data.xsrfToken));
        store.dispatch(login(response.data));
        store.dispatch(setMessage(`Bonjour ${pseudo}`));
      }
      catch (error) {
        store.dispatch(setError('Votre identifiant ou votre mot de passe est incorrect'));
      }
      return next(action);
    }
    case SEND_SIGN_IN_FORM: {
      try {
        // Puis on fait en POST la requete de connexion
        await axios.post('inscription', {
          pseudo, firstName, lastName, emailAddress, password, passwordConfirm,
        });
        store.dispatch(setUserIsSignIn(true));
      }
      catch (error) {
        if (error.response.data === '"passwordConfirm" must be [ref:password]') {
          store.dispatch(setError('Votre mot de passe n\'est pas identique à votre confirmation de mot de passe'));
        }
        else {
          store.dispatch(setError(error.response.data));
        }
      }
      return next(action);
    }
    case SEND_DISCONNECT: {
      try {
        // on récupère le token
        const tokens = localStorage.getItem('tokens');
        const options = {
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${tokens}`,
          },
        };
        await axios.get('deconnexion', options);
        // je supprime le token du localStorage;
        localStorage.clear();
        store.dispatch(logout());
      }
      catch (error) {
      }
      return next(action);
    }
    case EMAIL_SUBMIT: {
      console.log('ici je suis dans MW user case Email Submit');
      try {
        const response = await axios.post('/resendEmailLink', { email: newEmail });
        console.log('middlewares user SEND_DISCONNECT response.data', response.data);
      }
      catch (error) {
        console.log('error', error);
        console.log('error.response.data', error.response.data);
        console.log('error.response.status', error.response.status);
        console.log('error.response.headers', error.response.headers);
      }
      return next(action);
    }
    default:
      return next(action);
  }
};
