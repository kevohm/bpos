import { Navigate, useMatch } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ProtectedRoute = ({ path, element }) => {
  const { user } = useContext(AuthContext);
  const match = useMatch(path);

  // Check if the user is authenticated
  const isAuthenticated = !!user;

  if (!isAuthenticated && match) {
    return <Navigate to="/login" replace />;
  }

  return element;
};
