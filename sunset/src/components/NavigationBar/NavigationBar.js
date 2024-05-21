import React, { useContext } from 'react';
import './NavigationBar.scss';
import { AuthContext } from '../../AuthContext/AuthContext';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import EmailIcon from '@mui/icons-material/Email';


function NavigationBar() { 

  const { user } = useContext(AuthContext);
  const firstWordOfBusinessName = user?.businessName ? user.businessName.split(' ')[0] : '';

  return ( 
    <div className="navbar"> 
      <div className="wrapper">

        <div className="CompanyName">
          <span>{firstWordOfBusinessName}</span>
        </div>
        
        <div className='RightArea'>
            <div className='SearchArea'>
              <input 
                placeholder='Search branch..'
              />
              <button>Go</button>
            </div>

            <div className='Notifications'>
              <NotificationImportantIcon />
              <span className='NotificationCount'>0</span>
            </div>

            <div className='Notifications'>
              <EmailIcon />
              <span className='NotificationCount'>0</span>
            </div>

            <div className='CompanyIcon'>
              <img src='' alt='logo'/>
            </div>
        </div>

      </div>
    </div>
  );
}

export default NavigationBar;
