import React from 'react';
import PropTypes from 'prop-types';
import Field from 'src/components/Field';
import { Redirect } from 'react-router-dom';
import './style.css';
import {
  Button, Modal,
} from 'semantic-ui-react';

const LoginForm = ({
  loading,
  pseudo,
  password,
  changeField,
  emailSubmit,
  handleLogin,
  isLogged,
  newEmail,
  error,
}) => {
  console.log('compoents loginform newEmail', newEmail);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleLogin();
  };
  const handleSubmitEmail = (evt) => {
    evt.preventDefault();
    emailSubmit();
  };
  const [openEmail, setOpenEmail] = React.useState(false);
  return (
    <div className="login-form">
      {error && <p className="error">{error}</p>}
      {isLogged && (
        <Redirect to="/" exact />
      )}
      {!isLogged && (
        <>
        <div className="container_login">
          <form autoComplete="off" className="login-form-element" onSubmit={handleSubmit}>
            <h1> Connexion</h1>

            <div className="pseudo">
              <Field
                name="pseudo"
                className="pseudo_field"
                placeholder="Votre pseudo"
                onChange={changeField}
                value={pseudo}
              />
              <span className="popup"> Votre pseudo doit comporter au minimim 3 caractéres... </span>
            </div>

            <div className="pseudo">
              <Field
                name="password"
                type="password"
                className="pseudo_field"
                placeholder="Votre mot de passe"
                onChange={changeField}
                value={password}
              />
              <span className="popup"> Votre password doit avoir un nombre minimum de 8 charactéres, une lettre majuscule, une lettre minuscule et un caractére spécial parmis : !@#$%^&* </span>
            </div>

            <button
              className="validate"
              type="submit"
              disabled={loading}
            >
              {!loading ? 'se connecter' : 'Chargement ...'}
            </button>
          </form>

          <div className="pseudo">
            <Modal
              size="fullscreen"
              className="button_verifemail"
              onClose={() => setOpenEmail(false)}
              onOpen={() => setOpenEmail(true)}
              open={openEmail}
              trigger={<Button content="vérifier un email" labelPosition="left" icon="edit" />}
            >
              <form autoComplete="off" className="email-form" onSubmit={handleSubmitEmail}>
                <Field
                  name="newEmail"
                  placeholder="votre adresse Email à vérifié"
                  onChange={changeField}
                  value={newEmail}
                  onSubmit={handleSubmitEmail}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="email_validate_button"
                >
                  {!loading ? 'Vérifier' : 'Chargement ...'}
                </button>

              </form>
              
           

            </Modal>
            <span className="popup"> Un email vérifié est nécesaire pour la connexion </span>
          </div>
         </div>
        </>
      )}
    </div>
  );
};
LoginForm.propTypes = {
  pseudo: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  changeField: PropTypes.func.isRequired,
  emailSubmit: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  error: PropTypes.string,
  newEmail: PropTypes.string,
  loading: PropTypes.bool,
  isLogged: PropTypes.bool,
};

LoginForm.defaultProps = {
  loading: false,
  isLogged: false,
  newEmail: '',
  error: PropTypes.string,
};

export default LoginForm;
