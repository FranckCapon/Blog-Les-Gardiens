// == Import : npm
import React from 'react';
import PropTypes from 'prop-types';
// import de la feuille de style
import './styles.scss';

// == Composant
const TextAreaDescription = ({
  value,
  type,
  name,
  placeholder,
  onChange,
}) => {
  const handleChange = (evt) => {
    onChange(evt.target.value, name);
  };

  const inputId = `field-${name}`;

  return (
    <div>
      <textarea
        // React - state
        value={value}
        onChange={handleChange}
        // infos de base
        id={inputId}
        type={type}
        placeholder={placeholder}
        name={name}
      />

      <label
        htmlFor={inputId}
      >
        {placeholder}
      </label>
    </div>
  );
};

TextAreaDescription.propTypes = {
  value: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

// Valeurs par défaut pour les props
TextAreaDescription.defaultProps = {
  value: '',
  type: 'text',
  placeholder: '',
};

// == Export
export default TextAreaDescription;
