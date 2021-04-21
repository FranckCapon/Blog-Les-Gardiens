import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
} from 'semantic-ui-react';
import './styles.scss';

const Profil = ({
  pseudo, firstName, lastName, emailAddress, role,
}) => (
  <div>
    <Card className="profil">
      <Card.Content>
        <Card.Header>Profil</Card.Header>
        <Card.Meta>
          <p className="profil__info"><span className="info">Votre pseudo:</span><span> {pseudo}</span></p>
          <p className="profil__info"><span className="info">Votre prénom:</span><span> {firstName}</span></p>
          <p className="profil__info"><span className="info">Votre nom:</span><span> {lastName}</span></p>
          <p className="profil__info"><span className="info">Votre adresse e-mail:</span><span>{emailAddress}</span></p>
          <p className="profil__info"><span className="info">votre role:</span><span> {role}</span></p>
        </Card.Meta>
      </Card.Content>
    </Card>
  </div>

);
Profil.propTypes = {
  pseudo: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  emailAddress: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export default Profil;
