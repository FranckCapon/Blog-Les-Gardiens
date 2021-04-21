import {
  SET_FIELD_VALUE,
  LOGIN,
  LOGOUT,
  SET_USER_LOADING_STATE,
  SET_USER_IS_SIGN_IN,
  SET_MESSAGE,
  SET_ERROR,
} from 'src/actions/user';

const initialState = {
  id: '',
  firstName: '',
  lastName: '',
  pseudo: '',
  emailAddress: '',
  role: '',
  passwordConfirm: '',
  avatar: '',
  password: '',
  loading: false,
  logged: false,
  signIn: false,
  message: '',
  error: '',
  newEmail: '',
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_FIELD_VALUE:
      return {
        ...state,
        [action.name]: action.value,
      };
    case LOGIN:
      return {
        ...state,
        id: action.data.id,
        firstName: action.data.firstname,
        lastName: action.data.lastname,
        pseudo: action.data.pseudo,
        emailAddress: action.data.email,
        role: action.data.role,
        logged: true,
        password: '',
        signIn: false,
      };
    case LOGOUT:
      return {
        ...state,
        id: '',
        firstName: '',
        lastName: '',
        pseudo: '',
        emailAddress: '',
        role: '',
        passwordConfirm: '',
        avatar: '',
        password: '',
        loading: false,
        logged: false,
        signIn: false,
        message: '',
        error: '',
        newEmail: '',

      };
    case SET_USER_LOADING_STATE:
      return {
        ...state,
        loading: action.loading,
      };
    case SET_USER_IS_SIGN_IN:
      return {
        ...state,
        signIn: action.signIn,
        password: '',
        pseudo: '',
      };
    case SET_MESSAGE:
      return {
        ...state,
        message: action.message,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.message,
        passwordConfirm: '',
        password: '',
        message: '',

      };
    default:
      return state;
  }
};
