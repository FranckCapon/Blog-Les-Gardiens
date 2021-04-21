/* eslint-disable no-empty */
import {
  SEND_UNSUBSCRIBE,
  SEND_ADD_EVENT,
  FETCH_EVENTS,
  PARTICIPATION,
  setEvents,
  setAddNewEvent,
  setParticipate,
} from 'src/actions/events';
import axios from 'src/api';

export default (store) => (next) => async (action) => {
  const { user: { pseudo, id } } = store.getState();
  const {
    events: {
      idEvent, newTitle, newDescription, newTagId, newEventDate,
    },
  } = store.getState();
  const numberId = parseInt(id, 10);
  console.log('middlewares event newEventDate', newEventDate);
  switch (action.type) {
    case FETCH_EVENTS: {
      try {
        const response = await axios.get('evenements');
        store.dispatch(setEvents(response.data));
      }
      catch (error) {
        console.log('error', error);
      }
      return next(action);
    }
    case PARTICIPATION: {
      try {
        console.log('je suis dans middlewares event participation idEvent', idEvent);
        console.log('je suis dans middlewares event participation pseudo', pseudo);
        const tokens = localStorage.getItem('tokens');
        const options = {
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${tokens}`,
          },
        };
        const response = await axios.post('participants', {
          id: idEvent,
          pseudo,
        }, options);
        console.log('middlewares event participation response', response);
        store.dispatch(setParticipate(true));
      }

      catch (error) {
        console.log('error', error);
        console.log('error.response.data', error.response.data);
        console.log('error.response.status', error.response.status);
        console.log('error.response.headers', error.response.headers);
      }
      return next(action);
    }
    case SEND_ADD_EVENT: {
      try {
        // on récupère le token
        const tokens = localStorage.getItem('tokens');
        const options = {
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${tokens}`,
          },
        };
        const response = await axios.post('evenements', {
          title: newTitle,
          description: newDescription,
          creatorId: numberId,
          eventDate: newEventDate,
          tagId: newTagId,
        }, options);
        console.log('middlewares user SEND_DISCONNECT response', response);
        store.dispatch(setAddNewEvent());
      }

      catch (error) {
        console.log('error', error);
        console.log('error.response.data', error.response.data);
        console.log('error.response.status', error.response.status);
        console.log('error.response.headers', error.response.headers);
      }
      return next(action);
    }
    case SEND_UNSUBSCRIBE: {
      try {
        const tokens = localStorage.getItem('tokens');
        const options = {
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${tokens}`,
          },
        };
        await axios.patch('participants', {
          id: idEvent,
          pseudo,
        }, options);
        store.dispatch(setParticipate(false));
      }

      catch (error) {
        console.log('error', error);
        console.log('error.response.data', error.response.data);
        console.log('error.response.status', error.response.status);
        console.log('error.response.headers', error.response.headers);
      }
      return next(action);
    }

    default:
      return next(action);
  }
};
