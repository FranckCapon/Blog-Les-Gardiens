import { connect } from 'react-redux';
import CardEvent from 'src/components/Event/CardEvent';

import {
  participation, idEventSelected, sendUnsubscribe, fetchEvents,
} from 'src/actions/events';

const mapStateToProps = (state) => (
  {
    toParticipate: state.events.toParticipate,
    newTitle: state.events.newTitle,
    newDescription: state.events.newDescription,
    newEventDate: state.events.newEventDate,
    isLogged: state.user.logged,
    addNewEvent: state.events.newEvent,
    isLogged: state.user.logged,
  });

const mapDispatchToProps = (dispatch) => ({
  participation: () => dispatch(participation()),
  idEventSelected: (id) => dispatch(idEventSelected(id)),
  unsubscribe: () => dispatch(sendUnsubscribe()),
  fetchEvents: () => dispatch(fetchEvents()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardEvent);
