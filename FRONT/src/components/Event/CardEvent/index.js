import React, { useEffect } from 'react';
import {
  Card, Button, Modal, Icon,
} from 'semantic-ui-react'; // on imporet les composants classes de Sémentic-UI
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.scss';
/**
 * containers qui permet d'afficher une carte
 * @param {props} props contenu dans un article ou un event
 */
const CardEvent = ({
  eventParticipants,
  id,
  title,
  description,
  eventDate,
  createdDate,
  updateDate,
  eventTag,
  creatorPseudo,
  participation,
  idEventSelected,
  toParticipate,
  unsubscribe,
  fetchEvents,
  isLogged,
}) => {
  // un hook qui change la props open grace à la fonction setOpen.
  // useState représente un store pour une seul props qui est initialisée à false
  const [openParticipation, setOpenParticipation] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClickparticipation = (evt) => {
    evt.preventDefault();
    idEventSelected(id);
    participation();
    setOpenParticipation(false);
  };

  const handleClickUnsubscribe = (evt) => {
    evt.preventDefault();
    idEventSelected(id);
    unsubscribe();
    setOpen(false);
  };

  useEffect(() => {
    async function info() {
      await fetchEvents();
    }
    info();
  }, [toParticipate]);
  return (
    <>
      <Card fluid className="cardEvent" as={Link} to={`/evenements/${id}`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
        <Card.Content textAlign="center">
          <Card.Header>{ eventTag}</Card.Header>
          <Card.Header>{title} pour la date du {eventDate}</Card.Header>
          <Card.Meta>
            <span>{creatorPseudo}</span>
            <span>mise en ligne le { updateDate || createdDate }</span>
          </Card.Meta>
          <Card.Description>
            {description}
          </Card.Description>
          {(isLogged && toParticipate) && (
            <>
              <p className="participation">les participants sont :
                {eventParticipants.map((participant) => (
                  <li key={participant.toString()}>
                    {participant}
                  </li>
                ))}

              </p>

              <Modal
                id="unsubscribe"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<Button><Icon name="remove user" /></Button>}
              >

                <Modal.Header>désincription à l'évènement {title}</Modal.Header>
                <Modal.Description>
                  <p>
                    voulez-vous vous désinscrire de l'évènement {title}
                    pour la date du ${eventDate}?
                  </p>
                </Modal.Description>
                <Modal.Actions>
                  <Button onClick={() => setOpen(false)}>
                    Non
                  </Button>
                  <Button
                    content="Oui"
                    labelPosition="right"
                    onClick={handleClickUnsubscribe}
                  />
                </Modal.Actions>
              </Modal>
            </>
          )}
          {(isLogged && !toParticipate) && (
          <Modal
            id="participation"
            onClose={() => setOpenParticipation(false)}
            onOpen={() => setOpenParticipation(true)}
            open={openParticipation}
            trigger={<Button><Icon name="user plus" /></Button>}
          >

            <Modal.Header>Participation à l'évènement {title}</Modal.Header>
            <Modal.Description>
              <p>voulez-vous participer à l'évènement {title} pour la date du ${eventDate}?</p>
            </Modal.Description>
            <Modal.Actions>
              <Button onClick={() => setOpenParticipation(false)}>
                Non
              </Button>
              <Button
                content="Oui"
                labelPosition="right"
                onClick={handleClickparticipation}
              />
            </Modal.Actions>
          </Modal>
          )}
        </Card.Content>
      </Card>
    </>
  );
};
CardEvent.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  eventDate: PropTypes.string.isRequired,
  createdDate: PropTypes.string.isRequired,
  updateDate: PropTypes.string,
  eventTag: PropTypes.string.isRequired,
  creatorPseudo: PropTypes.string.isRequired,
  participation: PropTypes.func.isRequired,
  fetchEvents: PropTypes.func.isRequired,
  idEventSelected: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  eventParticipants: PropTypes.array.isRequired,
  toParticipate: PropTypes.bool,
  isLogged: PropTypes.bool,
};

CardEvent.defaultProps = {
  updateDate: null,
  toParticipate: false,
  isLogged: false,
};

export default CardEvent;
