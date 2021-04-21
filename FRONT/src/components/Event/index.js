import React from 'react';
import CardEvent from 'src/containers/CardEvent';
import PropTypes from 'prop-types';

/**
 * page affichant un évènement
 * @param {array} event
 */
const Event = ({ event }) => (
  <>
    <CardEvent {...event} />
  </>
);
Event.propTypes = {
  event: PropTypes.object,
};

Event.defaultProps = {
  event: {},
};

export default Event;
