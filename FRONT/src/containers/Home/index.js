import { connect } from 'react-redux';
import Home from 'src/components/Home';

const mapStateToProps = (state) => (
  {
    articles: state.articles.articles,
    games: state.games.games,
    events: state.events.events,
  });
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
