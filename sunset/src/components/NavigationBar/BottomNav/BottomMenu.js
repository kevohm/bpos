import React, { useContext } from 'react';
import './BottomMenu.scss';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMessage, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import HelpIcon from '@mui/icons-material/Help';
import { AuthContext } from '../../../AuthContext/AuthContext';

function BottomMenu() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/Auth', { replace: true });
      };
  return (
    <div className="bottom-menu">
      <div className="menu-item"><Link to={'/index'}><HomeIcon style={{color:'black'}}/></Link></div>

      <div className="menu-item"><Link to={'/customers'}><PeopleIcon style={{color:'black'}}/></Link></div>
      
      <div className="menu-item"> 
        <Link to={'/messages'}>
        <FontAwesomeIcon icon={faMessage} style={{color:'black'}} />
        </Link>
      </div>

      <div className="menu-item"><button onClick={handleLogout}> <LogoutIcon /> </button></div>

      <div><Link to={'/productedits'}><HelpIcon style={{color:'black'}}/></Link></div>
    </div>
  );
}

export default BottomMenu;
