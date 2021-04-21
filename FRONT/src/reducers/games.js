import { FETCH_GAMES, SET_GAMES } from 'src/actions/games';

const initialState = {
  games:
[
  {
    id: 0,
    title: '',
    minAge: 0,
    duration: {
      hours: 0,
      minutes: 0,
    },
    quantity: 0,
    purchasedDate: '',
    creator: '',
    editor: '',
    description: '',
    year: 0,
    typeId: '',
    min_player: 0,
    max_player: 0,
    game_type: '',
    game_categories: [''],
  },
],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_GAMES:
      return {
        ...state,
      };
    case SET_GAMES:
      return {
        ...state,
        games: action.games,
      };
    default:
      return state;
  }
};
