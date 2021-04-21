import { connect } from 'react-redux';
import App from 'src/components/App';
import { fetchArticles } from 'src/actions/articles';
import { fetchGames } from 'src/actions/games';
import { fetchEvents } from 'src/actions/events';
import { setUserLoadingState } from 'src/actions/user';

const mapStateToProps = (state) => ({
  articles: state.articles.articles,
  games: state.games.games,
  events: state.events.events,
  loading: state.events.loading,
  isLogged: state.user.logged,
  addNewEvent: state.events.newEvent,

});

const mapDispatchToProps = (dispatch) => ({
  fetchArticles: () => dispatch(fetchArticles()),
  fetchGames: () => dispatch(fetchGames()),
  fetchEvents: () => dispatch(fetchEvents()),
  setUserLoadingState: () => dispatch(setUserLoadingState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
