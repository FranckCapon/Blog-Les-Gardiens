export const SET_FIELD_VALUE = 'SET_FIELD_VALUE';
export const SEND_LOGIN = 'SEND_LOGIN';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_USER_LOADING_STATE = 'SET_USER_LOADING_STATE';
export const SEND_SIGN_IN_FORM = 'SEND_SIGN_IN_FORM';
export const SET_USER_IS_SIGN_IN = 'SET_USER_IS_SIGN_IN';
export const SEND_DISCONNECT = 'SEND_DISCONNECT';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_ERROR = 'SET_ERROR';
export const EMAIL_SUBMIT = 'HANDLE_EMAIL_SUBMIT';

/**
 * Action permettant de mettre à jour la valeur d'un champs dans le store
 * @param {String} value
 * @param {String} name
 */
export const setFieldValue = (value, name) => ({
  type: SET_FIELD_VALUE,
  value,
  name,

});

/**
 * Action permettant de faire une requete à l'api afin de s'authentifier
 */
export const sendLogin = () => ({
  type: SEND_LOGIN,
});

/**
 * Action permettant de faire une requete à l'api afin de s'inscrire
 */
export const sendSignInForm = () => ({
  type: SEND_SIGN_IN_FORM,
});

/**
 * Action permettant de mettre à jour isLogged à true dans le store
 */
export const login = (data) => ({
  type: LOGIN,
  data,
});

/**
 * Action permettant de mettre à jour isLogged à false dans le store
 */
export const logout = () => ({
  type: LOGOUT,
});

/**
 * Action permettant de mettre le formulaire de connexion en loading
 * @param {Boolean} loading
 */
export const setUserLoadingState = (loading) => ({
  type: SET_USER_LOADING_STATE,
  loading,
});

/**
 * Action permettant d'affichier le formulaire
 * @param {string} message
 */
export const setUserIsSignIn = (signIn) => ({
  type: SET_USER_IS_SIGN_IN,
  signIn,
});

/**
 * Action permettant de se deconnecter
 * @param {string} message
 */
export const sendDisconnect = () => ({
  type: SEND_DISCONNECT,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  message,
});

export const setError = (message) => ({
  type: SET_ERROR,
  message,
});
/**
 *action qui transmet un email
 */
export const emailSubmit = () => ({
  type: EMAIL_SUBMIT,
});
