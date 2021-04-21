// Types d'action
export const FETCH_GAMES = 'FETCH_GAMES';
export const SET_GAMES = 'SET_GAMES';

// Action creator
export const fetchGames = () => ({
  type: FETCH_GAMES,
});
export const setGames = (games) => ({
  type: SET_GAMES,
  games,
});
