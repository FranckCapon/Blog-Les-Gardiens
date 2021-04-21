import { combineReducers } from 'redux';
import events from './events';
import articles from './articles';
import games from './games';
import user from './user';

export default combineReducers({
  events,
  articles,
  games,
  user,
});
