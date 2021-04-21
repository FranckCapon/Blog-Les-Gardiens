import { FETCH_GAMES, setGames } from 'src/actions/games';
import axios from 'src/api';

export default (store) => (next) => async (action) => {
  switch (action.type) {
    case FETCH_GAMES: {
      try {
        const response = await axios.get('jeux');
        store.dispatch(setGames(response.data));
      }
      catch (error) {
        console.log('error', error);
      }
      return next(action);
    }
    default:
      return next(action);
  }
};
