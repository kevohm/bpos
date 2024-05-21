import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Auth', { replace: true });
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
