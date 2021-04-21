import React from 'react';
import PropTypes from 'prop-types';
import Field from 'src/components/Field';
import { Redirect } from 'react-router-dom';
import './style.css';

const SignInForm = ({
  firstName,
  lastName,
  pseudo,
  emailAddress,
  passwordConfirm,
  password,
  changeField,
  handleSignInForm,
  loading,
  signIn,
  error,
}) => {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleSignInForm();
  };
  return (
    <div className="login-form">
      {error && <p className="error">{error}</p>}
      {signIn && (
        <Redirect to="/connexion" />
      )}
      {!signIn && (

      <div className="container_login">
        <form autoComplete="off" className="login-form-element" onSubmit={handleSubmit}>
          <h1> Inscription </h1>
          <Field
            name="firstName"
            placeholder="Prénom"
            onChange={changeField}
            value={firstName}
          />
          <Field
            name="lastName"
            placeholder="Nom"
            onChange={changeField}
            value={lastName}
          />
          <div className="pseudo">
            <Field
              name="pseudo"
              placeholder="Pseudo"
              onChange={changeField}
              value={pseudo}
            />
            <span className="popup"> Votre pseudo doit comporter au moins 3 caractéres </span>
          </div>

          <div className="pseudo">
            <Field
              name="emailAddress"
              placeholder="Adresse Email*"
              onChange={changeField}
              value={emailAddress}
            />
            <span className="popup"> Merci de vérifier vos emails suite à votre inscription... </span>
          </div>
          <div className="pseudo">
            <Field
              name="password"
              type="password"
              placeholder="Mot de passe"
              onChange={changeField}
              value={password}
            />
            <Field
              name="passwordConfirm"
              type="password"
              className="passwordConfirm"
              placeholder="Confirmation du mot de passe"
              onChange={changeField}
              value={passwordConfirm}
            />
            <span className="popup"> Votre password doit avoir un nombre minimum de 8 charactéres, une lettre majuscule, une lettre minuscule et un caractére spécial parmis : !@#$%^&* </span>
          </div>
          <button
            className="validate"
            type="submit"
            disabled={loading}
          >
            {!loading ? 's\'inscrire' : 'Chargement ...'}
          </button>
          <h3>* Votre email devra être vérifié pour vous connecter,
            merci de cliquer sur le lien envoyé.
          </h3>
         

        </form>

         </div>
      )}
    </div>
  );
};

SignInForm.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  pseudo: PropTypes.string.isRequired,
  emailAddress: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  changeField: PropTypes.func.isRequired,
  handleSignInForm: PropTypes.func.isRequired,
  signIn: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

SignInForm.defaultProps = {
  loading: false,
  signIn: false,
  error: PropTypes.string,
};

export default SignInForm;
