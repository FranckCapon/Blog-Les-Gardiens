// == Import : npm
import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

// == Import : local

// == Composant
const Field = ({
  value,
  type,
  name,
  placeholder,
  onChange,
}) => {
  const handleChange = (evt) => {
    onChange(evt.target.value, name);
  };

  return (
    <div className="container-field">
      <input
        // React - state
        value={value}
        onChange={handleChange}
        // infos de base
        className="field"
        type={type}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
};

Field.propTypes = {
  value: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

// Valeurs par défaut pour les props
Field.defaultProps = {
  value: '',
  type: 'text',
  placeholder: '',
};

// == Export
export default Field;
