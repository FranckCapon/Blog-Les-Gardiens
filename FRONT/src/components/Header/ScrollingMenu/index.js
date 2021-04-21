import React from 'react';
import {
  Menu, Dropdown,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles.scss';
/**
 * component affichant le sous menu
 */
const ScrollingMenu = ({ isLogged, sendDisconnect }) => {
  const handleClick = (evt) => {
    evt.preventDefault();
    sendDisconnect();
  };
  return (
    <Menu borderless>
      <Dropdown item icon="bars" simple className="menu" closeOnChange>
        <Dropdown.Menu>
          {isLogged && (<button type="button" className="button_deconnexion" onClick={handleClick}>Déconnexion</button>)}
          {!isLogged && (
            <>
              <Dropdown.Item as={Link} to="/connexion">Connexion</Dropdown.Item>
              <Dropdown.Item as={Link} to="/inscription">Inscription</Dropdown.Item>
            </>
          )}
          <Dropdown.Item as={Link} to="/les-gardiens">Les Gardiens</Dropdown.Item>
          <Dropdown.Item as={Link} to="/contact">Contact</Dropdown.Item>
          <Dropdown.Item as={Link} to="/jeux">Nos Jeux</Dropdown.Item>
          <Dropdown.Item as={Link} to="/evenements">Evénement</Dropdown.Item>
          <Dropdown.Item as={Link} to="/forum">Forum</Dropdown.Item>
          <Dropdown.Item as={Link} to="/profil">Profil</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu>
  );
};
ScrollingMenu.propTypes = {
  isLogged: PropTypes.bool,
  sendDisconnect: PropTypes.func.isRequired,
};
ScrollingMenu.defaultProps = {
  isLogged: false,
};

export default ScrollingMenu;
