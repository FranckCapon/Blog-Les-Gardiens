import React from 'react';
import CardArticle from 'src/components/Article/CardArticle';
import PropTypes from 'prop-types';

/**
 * page affichant un article
 * @param {array} article
 */
const Article = ({ article }) => (
  <>
    <CardArticle {...article} />
  </>
);
Article.propTypes = {
  article: PropTypes.object,
};

Article.defaultProps = {
  article: {},
};

export default Article;
