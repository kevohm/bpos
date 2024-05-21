import React, { useState, useEffect } from 'react';
import './AdminRoutes.scss'
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const AdminHomeRoutes = () => {
    const [time, setTime] = useState(new Date().getHours());
    const [greeting, setGreeting] = useState('');
    useEffect(() => {
        setGreeting(getGreeting());
      }, [time]);
    
      const getGreeting = () => {
        if (time >= 5 && time < 12) {
          return 'Good morning..';
        } else if (time >= 12 && time < 18) {
          return 'Good afternoon..';
        } else {
          return 'Good evening..';
        }
      };
  return (
    <div className='AdminRoutes'>

        <div className='RoutesHeader'>
            <h1>{greeting}</h1>
            <h1>What can we do for you?</h1>
        </div>

        <div className='TheRoutes'>
            <div className='RoutesA'>
                <div className='RouteOne'>
                    <a href='/stocksetup'>
                        <span><InventoryIcon /></span>
                        <span>Stock</span>
                    </a>
                </div>
                <div className='RouteOne'>
                    <a href='/sales'>
                        <span><ReceiptIcon /></span>
                        <span>Sales</span>
                    </a>
                </div>
                <div className='RouteOne'>
                    <a href='/cashflow'>
                        <span><PaymentIcon /></span>
                        <span>Cash flow</span>
                    </a>
                </div>
            </div>

            <div className='RoutesB'>
                <div className='RouteOne'>
                    <a href='/analytics'>
                        <span><AssessmentIcon /></span>
                        <span>Reports</span>
                    </a>
                </div>
                <div className='RouteOne'>
                    <a href='/myattendants'>
                        <span><GroupIcon /></span>
                        <span>Attendants</span>
                    </a>
                </div>
                <div className='RouteOne'>
                    <a href='/stockorders'>
                        <span><BookmarkBorderIcon /></span>
                        <span>Orders</span>
                    </a>
                </div>
            </div>

        </div>
    </div>
  )
}

export default AdminHomeRoutes
