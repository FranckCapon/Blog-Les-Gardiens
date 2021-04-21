/* eslint-disable no-empty */
import { FETCH_ARTICLES, setArticles } from 'src/actions/articles';
import axios from 'src/api';

export default (store) => (next) => async (action) => {
  switch (action.type) {
    case FETCH_ARTICLES: {
      try {
        const response = await axios.get('articles');
        store.dispatch(setArticles(response.data));
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
