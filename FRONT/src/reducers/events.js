import {
  FETCH_EVENTS,
  SET_EVENTS,
  ID_EVENT_SELECTED,
  SET_FIELD_VALUE_EVENT,
  SET_ADD_NEW_EVENT,
  SET_PARTICIPATE,
} from 'src/actions/events';

const initialState = {
  events: [
    {
      id: 1,
      title: '',
      description: '',
      eventDate: '',
      createdDate: '',
      updateDate: null,
      creatorId: 2,
      tagId: 2,
      eventTag: '',
      creatorPseudo: '',
      eventParticipants: [],
      eventGames: [],
    },
  ],
  newTitle: '',
  newDescription: '',
  newEventDate: '',
  newTagId: '',
  idEvent: '',
  toParticipate: false,
  newEvent: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_EVENTS:
      return {
        ...state,
      };
    case SET_EVENTS:
      return {
        ...state,
        events: action.events,
      };
    case ID_EVENT_SELECTED:
      return {
        ...state,
        idEvent: action.id,

      };
    case SET_FIELD_VALUE_EVENT:
      return {
        ...state,
        [action.name]: action.value,
      };
    case SET_ADD_NEW_EVENT:
      return {
        ...state,
        newEvent: true,
      };
    case SET_PARTICIPATE:
      return {
        ...state,
        toParticipate: action.bool,
      };
    default:
      return state;
  }
};
