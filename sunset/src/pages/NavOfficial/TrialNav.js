import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faBell, faWallet, faHeart, faMoon, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import './style.css';

const Sidebar = () => {
  return (
    <>
      <div className="sidebar">
        <div className="dots">
          <img src="images/dots.png" alt="dots" />
        </div>
        <div className="profile">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <ul>
          <span>Analytics</span>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faHome} />
              <p>Dashboard</p>
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faChartBar} />
              <p>Insights</p>
            </a>
          </li>
        </ul>
        <ul>
          <span>Content</span>
          <li className="noti">
            <a href="#">
              <FontAwesomeIcon icon={faBell} />
              <p>Notifications</p>
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faWallet} />
              <p>Wallets</p>
            </a>
          </li>
          <li className="likes">
            <a href="#">
              <FontAwesomeIcon icon={faHeart} />
              <p>Likes</p>
            </a>
          </li>
        </ul>
        <ul>
          <span>Custom</span>
          <li className="switch-theme">
            <a href="#">
              <FontAwesomeIcon icon={faMoon} />
              <p>Darkmode</p>
              <button>
                <div className="circle"></div>
              </button>
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faSignOutAlt} />
              <p>Logout</p>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
