// Types d'action
export const FETCH_ARTICLES = 'FETCH_ARTICLES';
export const SET_ARTICLES = 'SET_ARTICLES';

// Action creator
export const fetchArticles = () => ({
  type: FETCH_ARTICLES,
});
export const setArticles = (articles) => ({
  type: SET_ARTICLES,
  articles,
});
