import {
  FETCH_ARTICLES,
  SET_ARTICLES,
} from 'src/actions/articles';

const initialState = {
  articles: [
    {
      id: 1,
      title: '',
      description: '',
      createdDate: '',
      updateDate: null,
      authorId: 2,
      authorPseudo: '',
      tagId: 1,
      tagName: '',
    },
  ],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_ARTICLES:
      return {
        ...state,
      };
    case SET_ARTICLES:
      return {
        ...state,
        articles: action.articles,
      };
    default:
      return state;
  }
};
