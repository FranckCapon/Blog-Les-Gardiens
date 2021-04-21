import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const Error403 = () => (
  <div className="container">
    <div className="gandalf">
      <div className="fireball" />
      <div className="skirt" />
      <div className="sleeves" />
      <div className="shoulders">
        <div className="hand left" />
        <div className="hand right" />
      </div>
      <div className="head">
        <div className="hair" />
        <div className="beard" />
      </div>
    </div>
    <div className="message">
      <h1>403 - vous ne passerez pas</h1>
      <p>
        Uh oh, Gandalf a bloqué le chemin!<br />
        Peut-être que vous avez une faute de frappe dans l'url ?
        Ou que vous vouliez aller à un autre endroit ?
      </p>
    </div>
    <p><Link to="/">Retour à la page d'accueil</Link></p>
  </div>
);
export default Error403;
