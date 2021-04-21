import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, isLogged }) => {
  console.log('components ProtectedRoute isLogged', isLogged);
  return (
    <>
      { isLogged && (
      <Route>
        <Component />
      </Route>
      )}
      {!isLogged && (<Redirect to="/unauthorized" />)}
    </>
  );
};
PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  isLogged: PropTypes.bool,
};
PrivateRoute.defaultProps = {
  isLogged: false,
};

export default PrivateRoute;
