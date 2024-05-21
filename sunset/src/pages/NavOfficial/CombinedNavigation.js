import React, { useState } from 'react';
import './CombinedNavigation.scss'; 
import HomePage from '../Home/HomePage';

function CombinedNavigation() {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
        <div>Point A Point B</div>
        <div>Point A</div>
        <div>Point A</div>
      </div>
      <div className="content">
        <div className="top-navigation">
          <button className="menu-button" onClick={toggleSidebar}>
            Menu
          </button>
          <div>Sunset</div> 
          <div>Sunset</div>
          <div>Sunset</div>
        </div>
        <div>
          <HomePage />
        </div>
      </div>
    </div>
  );
}

export default CombinedNavigation;
