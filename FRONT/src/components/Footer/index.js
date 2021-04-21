import React from 'react';
import { Link } from 'react-router-dom';
import medieval from 'src/assets/medieval.jpg';
import './styles.scss';

const Footer = () => (
  <div className="footer" style={{ background: `url(${medieval})` }}>
    <p className="footer__text">
      <span>Nous remercions FireFly Studios Games
        de nous autoriser à utiliser les photos à des fin non commercial
      </span>
      <span>
        <Link to="/rgpd" className="item">RGPD</Link> copyright © 2021
      </span>
    </p>

  </div>

);
export default Footer;
