import React from 'react';
import {
  Grid,
  Dropdown,
  Menu,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from 'src/assets/logo-noir.png';
import medieval from 'src/assets/medieval.jpg';
import ScrollingMenu from './ScrollingMenu';
import './styles.scss';

/**
 * composant qui affiche horizontalement le menu d'entête
 */
const Header = ({ isLogged, sendDisconnect }) => {
  const handleClick = (evt) => {
    evt.preventDefault();
    sendDisconnect();
  };
  return (
    <Grid className="header" style={{ background: `url(${medieval})` }}>

      <Grid.Row only="tablet mobile" className="header__menu">
        <Grid.Column width="2">
          <ScrollingMenu className="header__menu__scrollingMenu" isLogged={isLogged} sendDisconnect={sendDisconnect} />
        </Grid.Column>
        <Grid.Column width="3" textAlign="right">
          <Dropdown.Item as={Link} to="/"><img src={logo} className="header__logo" alt="Logo Les Gardiens de la Légende" /></Dropdown.Item>
        </Grid.Column>
        <Grid.Column width="7" textAlign="left">
          <Dropdown.Item as={Link} to="/"><h1 className="header__title">Les gardiens de la Légende</h1></Dropdown.Item>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row textAlign="center" only="computer" className="header__menu">
        <div className="container-logo">
          <Grid.Column width="5" textAlign="right">
            <Dropdown.Item as={Link} to="/"><img src={logo} className="header__logo" alt="Logo Les Gardiens de la Légende" /></Dropdown.Item>
          </Grid.Column>
          <Grid.Column width="11" textAlign="left">
            <Dropdown.Item as={Link} to="/"><h1 className="header__title">Les gardiens de la Légende</h1></Dropdown.Item>
          </Grid.Column>
        </div>
        <div className="container-menu">
          <Grid.Column width="2">
            <Dropdown.Item as={Link} to="/les-gardiens" className="header__nav">Les Gardiens</Dropdown.Item>
          </Grid.Column>
          <Grid.Column width="2">
            <Dropdown.Item as={Link} to="/contact" className="header__nav">Contact</Dropdown.Item>
          </Grid.Column>
          <Grid.Column width="2">
            <Dropdown.Item as={Link} to="/jeux" className="header__nav">Nos Jeux</Dropdown.Item>
          </Grid.Column>
          <Grid.Column width="2">
            <Dropdown.Item as={Link} to="/evenements" className="header__nav">Evénement</Dropdown.Item>
          </Grid.Column>
          <Grid.Column width="2">
            <Dropdown.Item as={Link} to="/forum" className="header__nav">Forum</Dropdown.Item>
          </Grid.Column>
          {isLogged && (
            <>
              <Grid.Column width="2">
                <span><Dropdown.Item as={Link} to="/profil" className="header__nav">Profil</Dropdown.Item></span>
              </Grid.Column>
              <Grid.Column width="2">
                <span> <button type="button" className="button_deconnexion" onClick={handleClick}>Déconnexion</button></span>
              </Grid.Column>
            </>
          )}
          {!isLogged && (
            <Menu borderless className="header__menu__key">
              <Dropdown item icon="key" simple>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/connexion" className="header__nav">Connexion</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/inscription" className="header__nav">Inscription</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profil" className="header__nav">Profil</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu>
          )}
        </div>
      </Grid.Row>
    </Grid >
  );
};
Header.propTypes = {
  isLogged: PropTypes.bool,
  sendDisconnect: PropTypes.func.isRequired,
};
Header.defaultProps = {
  isLogged: false,
};

export default Header;
