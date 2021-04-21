import React from 'react';
import { Card } from 'semantic-ui-react'; // on imporet les composants classes de Sémentic-UI
import PropTypes from 'prop-types';
import './styles.scss';
/**
 * containers qui permet d'afficher une carte
 * @param {props} props contenu dans un article ou un event
 */
const OneGame = ({
  game,
}) => (
  <Card fluid className="card oneGames">
    <Card.Content textAlign="center" className="card__content">
      <Card.Header>{game.title} {game.gameType}</Card.Header>
      {game.gameCategories.map((tag) => (
        <Card.Header className="tag" key={tag.toString()}>
          {tag}
        </Card.Header>
      ))}
      <Card.Meta>
        <p className="aloneInfo">
          <span>nombre de joueur {game.min_player}-{game.max_player}</span>
          <span>age mininmum {game.minAge}</span>
          <span> date de sortie du jeu: {game.year}</span>
          <span className="author">éditeur: {game.editor}</span>
          <span>créateur: {game.creator}</span>
          <span className="date">date d'achat: {game.purchasedDate}</span>
          <span>quantité disponible: {game.quantity}</span>
          <span>durée: {game.duration.hours} heure(s) {game.duration.minutes} minute(s)</span>
        </p>
      </Card.Meta>
      <Card.Description>
        {game.description}
      </Card.Description>
    </Card.Content>
  </Card>
);

OneGame.propTypes = {
  game: PropTypes.object.isRequired,
};

export default OneGame;
