import { connect } from 'react-redux';
import Events from 'src/components/Events';
import { fetchEvents, sendAddEvent, setFieldValueEvent } from 'src/actions/events';
import { setUserLoadingState } from 'src/actions/user';

const mapStateToProps = (state) => (
  {
    events: state.events.events,
    newTitle: state.events.newTitle,
    newDescription: state.events.newDescription,
    newEventDate: state.events.newEventDate,
    isLogged: state.user.logged,
    addNewEvent: state.events.newEvent,
  });
const mapDispatchToProps = (dispatch) => ({
  fetchEvents: () => dispatch(fetchEvents()),
  setUserLoadingState: () => dispatch(setUserLoadingState()),
  changeFieldEvent: (value, name) => dispatch(setFieldValueEvent(value, name)),
  handleAddEvent: () => dispatch(sendAddEvent()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);
