import React from 'react';
import PropTypes from 'prop-types';
// import des composants enfants
import ContentGames from 'src/components/Game/ContentGames';
// import de la database

/**
 * page affichant la liste des jeux de société
 * @param {array} games
 */
const Games = ({ games }) => (
  <>
    <ContentGames elements={games} />
  </>
);
Games.propTypes = {
  games: PropTypes.array,
};
Games.defaultProps = {
  games: [],
};

export default Games;
