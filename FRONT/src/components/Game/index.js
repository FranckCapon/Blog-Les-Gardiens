import React from 'react';
import PropTypes from 'prop-types';
import CardGame from './CardGame';

/**
 * page affichant un jeu de société
 * @param {array} game
 */
const Game = ({ game }) => (
  <>
    <CardGame {...game} />
  </>
);
Game.propTypes = {
  game: PropTypes.object,
};

Game.defaultProps = {
  game: {},
};

export default Game;
