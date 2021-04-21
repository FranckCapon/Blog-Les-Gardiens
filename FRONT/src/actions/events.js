// Types d'action
export const FETCH_EVENTS = 'FETCH_Events';
export const SET_EVENTS = 'SET_Events';
export const PARTICIPATION = 'PARTICIPATION';
export const ID_EVENT_SELECTED = 'ID_EVENT_SELECTED';
export const SEND_ADD_EVENT = 'SEND_ADD_EVENT';
export const SET_FIELD_VALUE_EVENT = 'SET_FIELD_VALUE_EVENT';
export const SEND_UNSUBSCRIBE = 'SEND_UNSUBSCRIBE';
export const SET_ADD_NEW_EVENT = 'SET_ADD_NEW_EVENT';
export const SET_PARTICIPATE = 'SET_PARTICIPATE';

/**
 * Action qui lors de l'ajout d'un évènement va déclancher
 * l'affichage de tous articles et celui en plus
 */
export const setAddNewEvent = () => ({
  type: SET_ADD_NEW_EVENT,
});

/**
 * action qui demande à l'api les évènements
 */
export const fetchEvents = () => ({
  type: FETCH_EVENTS,
});

/**
 * action qui affiche les évènements
 * @param {array} events
 */
export const setEvents = (events) => ({
  type: SET_EVENTS,
  events,
});

/**
 * action qui ajoute un participant à un évènement
 */
export const participation = () => ({
  type: PARTICIPATION,
});

/**
 * action qui indique stock le numéro d'id de l'évènement auquel un participant veut s'inscrire
 */
export const idEventSelected = (id) => ({
  type: ID_EVENT_SELECTED,
  id,
});

/**
 * action qui indique stock le numéro d'id de l'évènement auquel un participant veut s'inscrire
 */
export const sendAddEvent = () => ({
  type: SEND_ADD_EVENT,
});

/**
 * Action permettant de mettre à jour la valeur d'un champs dans le store
 * @param {String} value
 * @param {String} name
 */
export const setFieldValueEvent = (value, name) => ({
  type: SET_FIELD_VALUE_EVENT,
  value,
  name,
});

/**
 * Action permettant de se désinscrire d'un évènement
 * @param {String} value
 * @param {String} name
 */
export const sendUnsubscribe = () => ({
  type: SEND_UNSUBSCRIBE,
});

/**
 * Action permettant de se désinscrire d'un évènement
 * @param {String} value
 * @param {String} name
 */
export const setParticipate = (bool) => ({
  type: SET_PARTICIPATE,
  bool,
});
