import React from 'react';
import { Card } from 'semantic-ui-react'; // on imporet les composants classes de Sémentic-UI
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.scss';
/**
 * containers qui permet d'afficher une carte
 * @param {props} props contenu dans un article ou un event
 */
const CardGame = ({
  title,
  minAge,
  duration,
  quantity,
  preview,
  minPlayer, // je renomme les variables en camelcase
  maxPlayer,
  gameType,
  gameCategories,
  id,

}) => (
  <Card fluid className="card games" as={Link} to={`/jeux/${id}`}>
    <Card.Content textAlign="center" className="card__content">
      <Card.Header>{title} {gameType}</Card.Header>
      <div className="tag-container">
        {gameCategories.map((tag) => (
          <Card.Header className="tag" key={tag.toString()}>
            <p>{tag}</p>
          </Card.Header>
        ))}
      </div>
      <Card.Meta>
        <p className="info">
          <span className="oneInfo">nombre de joueur {minPlayer}-{maxPlayer}</span>
          <span className="oneInfo">age minimum {minAge}</span>
          <span className="oneInfo">quantité disponible: {quantity}</span>
          <span className="oneInfo">durée: {duration.hours} heure(s) {duration.minutes} minute(s)</span>
        </p>
      </Card.Meta>
      <Card.Description>
        {preview}...
      </Card.Description>
    </Card.Content>
  </Card>
);
CardGame.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  preview: PropTypes.string.isRequired,
  gameType: PropTypes.string,
  minAge: PropTypes.number,
  duration: PropTypes.objectOf(PropTypes.number),
  quantity: PropTypes.number,
  minPlayer: PropTypes.number,
  maxPlayer: PropTypes.number,
  gameCategories: PropTypes.arrayOf(PropTypes.string),
};

CardGame.defaultProps = {
  game_type: null,
  minAge: 1,
  duration: {},
  quantity: 1,
  minPlayer: 1,
  maxPlayer: 1,
  gameCategories: [],
};

export default CardGame;
