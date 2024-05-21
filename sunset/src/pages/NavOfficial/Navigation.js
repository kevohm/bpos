import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faBars, faRightFromBracket, faUser,faChevronDown,faChevronUp,faMapMarker } from '@fortawesome/free-solid-svg-icons';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import BarChartIcon from '@mui/icons-material/BarChart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { AuthContext } from '../../AuthContext/AuthContext';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AvailableProgress from '../../ComponentsTwo/StockManager/Charts/AvailableProgress';
import SoldProgress from '../../ComponentsTwo/StockManager/Charts/SoldProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const Navigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  
  const [BranchPut,setBranchPut] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen,setIsSettingsOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSettings = () =>{
    setIsSettingsOpen(!isSettingsOpen);
  };

  useEffect(() => {
   
   axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/branches')
     .then(response => {
       setBranchPut(response.data);
     })
     .catch(error => {
       console.error('Error fetching product groups:', error);
     });
 }, []); 

 const handleOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarMinimized = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (!user) {
    return <div>Loading...</div>;
  }


  return (
   

      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'} ${isSidebarMinimized ? 'minimized' : ''}`}>
 
      <div> 


        <div className="toggle-button" onClick={toggleSidebarMinimized} style={{ display: 'flex', gap: '20px', color: 'white' }}>
          <FontAwesomeIcon icon={faBars} />
          <div className="sidebar-header">
          </div>
        </div>
      

        <div className="sidebarcontent">

          <div className="sidebartabs">
           
          {/** 
              <div>
                <span style={{ color: 'white' }}>{user.businessName || user.fullname}</span>
              </div>
       */}

              <div className={`sidebar-tab ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('Dashboard')}>

              <div className='DashBoardHeader'>
                <a href='/index'>
                  <FontAwesomeIcon icon={faGauge} className='icon' />
                  <span>Dashboard</span>
                </a>
              </div>

              </div>

              <div className="sidebar-tab">
                
                  
                  <div className="collapsible-menu">

                  <div className="menu-header" onClick={toggleSettings}>
                  <div className='ViewButton'>
                  <SettingsIcon />  
                      <button>
                        Settings
                      </button>
                    </div>
                    <FontAwesomeIcon icon={isMenuOpen ? faChevronUp : faChevronDown} className='text-black'/>
                  </div>

                  {isSettingsOpen && (
                    <div className="menu-branches">
                      <div className='SettingsBranch'> 
                        <Link className='LinkSettings'><FontAwesomeIcon icon={faMapMarker} style={{color:'#15803d'}}/> <span>Account edit</span></Link>
                        <Link className='LinkSettings'><FontAwesomeIcon icon={faMapMarker} style={{color:'#15803d'}}/> Product edit</Link>
                      </div>
                    </div>
                  )}
                  </div>
               
              </div>

              <div className="sidebar-tab">
                <div className='EveryTab'>
                  <a href='/'>
                    <AddIcon />
                    <span>Add stock</span>
                  </a>
                  </div>
              </div>

              
              <div className="sidebar-tab">
                <div className='EveryTab'>
                  <a href='/'>
                    <Inventory2Icon />
                    <span>Stock view</span>
                  </a>
                </div>
              </div>

              <div className='sidebar-tab'>
              <div className="collapsible-menu">

              <div className="menu-header" onClick={toggleMenu}>
              <div className='ViewButton'>
                  <VisibilityIcon />
                  <button>
                    Branch view
                  </button>
                </div>
                <FontAwesomeIcon icon={isMenuOpen ? faChevronUp : faChevronDown} className='text-black'/>
              </div>

              {isMenuOpen && (
                <div className="menu-branches">
                  <ul>
                  {BranchPut.map((val) =>{
                    return(
                    
                      <li>
                        <Link to={`/analytics/${val.BranchName}`} className='LinkBranch'>
                         
                          <FontAwesomeIcon icon={faMapMarker} style={{color:'#15803d'}}/> {val.BranchName}
                         
                        </Link>
                      </li>
                    )
                })}
                  </ul>
                </div>
              )}
              </div>
            </div>

              <div className="sidebar-tab">
                <div className='EveryTab'>
                  <a href='/'>
                    <PointOfSaleIcon />
                    <span>Sales</span>
                  </a>
                  </div>
              </div>

              <div className="sidebar-tab">
              <div className='EveryTab'>
                <a href='/'>
                  <PointOfSaleIcon />
                  <span>Expenses</span>
                </a>
                </div>
              </div>

              

              <div className="sidebar-tab">
              <div className='EveryTab'>
                <a href='/'>
                  <BarChartIcon />
                  <span>Reports</span>
                </a>
                </div>
              </div>


            <div className="sidebar-tab">
            <div className='EveryTab'>
              <a href='/'>
                <ManageAccountsIcon />
                <span>Human resource</span>
              </a>
              </div>
            </div>

            <div className="sidebar-tab">
              <div className='LogoutTab'>
                 <button onClick={handleLogout}> <FontAwesomeIcon icon={faRightFromBracket} />  Logout </button>
              </div>
            </div>

            
          </div>
        </div>
        </div>
      </div>
  );
};

export default Navigation;
