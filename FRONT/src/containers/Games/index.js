import { connect } from 'react-redux';
import Games from 'src/components/Games';

const mapStateToProps = (state) => (
  {
    games: state.games.games,
  });
// const mapDispatchToProps = {};

export default connect(mapStateToProps, null)(Games);
