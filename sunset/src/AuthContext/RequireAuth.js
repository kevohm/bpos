import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user || !user.id) {
    // Redirect to the auth page if the user is null or the 'id' property is missing
    return <Navigate to="/Auth" />;
  }

  // Render the protected children if the user is authenticated
  return children;
};

export default RequireAuth;
