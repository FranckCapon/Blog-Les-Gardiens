/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal,
} from 'semantic-ui-react';
// import { Redirect } from 'react-router-dom';
import Field from 'src/components/Field';
// import des composants enfants
import ContentEvents from 'src/components/Event/ContentEvents';
import TextAreaDescription from 'src/components/TextAreaDescription';
import './style.css';
/**
 * page affichant la liste des évènements
 * @param {array} events
 */
const Events = ({
  events,
  changeFieldEvent,
  handleAddEvent,
  newTitle,
  newDescription,
  newEventDate,
  isLogged,
  fetchEvents,
  addNewEvent,
}) => {
  useEffect(() => {
    async function info() {
      await fetchEvents();
    }
    info();
  }, [addNewEvent]);
  console.log('components Events events', events);
  const [open, setOpen] = React.useState(false);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleAddEvent();
    setOpen(false);
  };
  return (
    <>
      {isLogged && (
      <Modal
        size="fullscreen"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button content="Ajouter un évènement" labelPosition="left" icon="edit" />}
      >
        <Modal.Header>Ajout d'un évènement</Modal.Header>
        <Modal.Description>
          <form autoComplete="off" onSubmit={handleSubmit} className="addEvent">
            <Field
              name="newTitle"
              type="texte"
              placeholder="titre de votre évènement"
              onChange={changeFieldEvent}
              value={newTitle}
            />
            <Field
              name="newEventDate"
              type="datetime-local"
              placeholder="date de l'évènement"
              value={newEventDate}
              onChange={changeFieldEvent}
            />
            <div className="button-radio">

              <Field
                name="newTagId"
                type="radio"
                id="new"
                value="1"
                onChange={changeFieldEvent}
              />
              <label htmlFor="new">Soirée jeux</label>

              <Field
                name="newTagId"
                type="radio"
                id="murderParty"
                value="2"
                onChange={changeFieldEvent}
              />
              <label htmlFor="murderParty">Murder Partie</label>
            </div>
            <TextAreaDescription
              className="newDescription"
              name="newDescription"
              placeholder="écrivez votre évènement"
              onChange={changeFieldEvent}
              value={newDescription}
            />

            <Button open={open} onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Valider
            </Button>

          </form>
        </Modal.Description>
      </Modal>
      )}
      <ContentEvents
        elements={events}
      />
    </>
  );
};
Events.propTypes = {
  events: PropTypes.array,
  changeFieldEvent: PropTypes.func.isRequired,
  handleAddEvent: PropTypes.func.isRequired,
  newTitle: PropTypes.string.isRequired,
  newDescription: PropTypes.string.isRequired,
  newEventDate: PropTypes.string.isRequired,
  isLogged: PropTypes.bool,
  addNewEvent: PropTypes.bool,
  fetchEvents: PropTypes.func.isRequired,
};
Events.defaultProps = {
  events: [],
  isLogged: false,
  addNewEvent: false,
};

export default Events;
