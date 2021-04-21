import { createStore, compose, applyMiddleware } from 'redux';
import articleMiddleware from '../middlewares/articles';
import gameMiddleware from '../middlewares/games';
import eventMiddleware from '../middlewares/event';
import userMiddleware from '../middlewares/user';
import rootReducer from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = composeEnhancers(
  applyMiddleware(
    gameMiddleware,
    articleMiddleware,
    eventMiddleware,
    userMiddleware,
  ),
);

const store = createStore(rootReducer, enhancers);

export default store;
