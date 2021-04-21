import React from 'react';
import { Card } from 'semantic-ui-react'; // on imporet les composants classes de Sémentic-UI
import PropTypes from 'prop-types';
import './styles.scss';

/**
 * containers qui permet d'afficher une carte
 * @param {props} props contenu dans un article ou un event
 */
const OneArticle = ({ article }) => (
  <Card className="card oneArticle">
    <Card.Content textAlign="center" className="card__content">
      <Card.Header>{article.title}{article.eventDate && `pour la date du ${article.eventDate}`}</Card.Header>
      <Card.Header className="tag">{article.tagName}</Card.Header>
      <Card.Meta>
        <span className="author">{article.authorPseudo}</span>
        <span className="date">mise en ligne le { article.updatedDate || article.createdDate }</span>
      </Card.Meta>
      <Card.Description>
        {article.description}
      </Card.Description>
    </Card.Content>
  </Card>
);
OneArticle.propTypes = {
  article: PropTypes.object.isRequired,
};

export default OneArticle;
