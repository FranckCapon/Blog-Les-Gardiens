import React from 'react';
import PropTypes from 'prop-types';
// import des composants enfants
import ContentArticles from 'src/components/Article/ContentArticles';
import { lastArray, getPreview, randomArray } from 'src/selectors';
import ContentEvents from 'src/components/Event/ContentEvents';
import ContentGames from 'src/components/Game/ContentGames';

/**
 * Le composant Home appèle les composants enfants nécessaire à l'affichage de la Home
 */
const Home = ({
  events,
  articles,
  games,
}) => (
  <div className="home">
    <h1> Notre dernier Evènement</h1>
    <ContentEvents
      elements={lastArray(events)}
    />
    <h1> Nos jeux</h1>
    <ContentGames elements={getPreview(randomArray(games))} />
    <h1> Nos articles </h1>
    <ContentArticles elements={getPreview(articles)} />
  </div>
);
Home.propTypes = {
  events: PropTypes.array,
  articles: PropTypes.array,
  games: PropTypes.array,
};
Home.defaultProps = {
  articles: [],
  events: [],
  games: [],
};

export default Home;
