import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUsers, faTree , faTimes ,faShoppingCart,faMoneyBillWave   } from '@fortawesome/free-solid-svg-icons';
import AppsIcon from '@mui/icons-material/Apps';
import styles from './style.module.scss'; 
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SellIcon from '@mui/icons-material/Sell';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';





const AlphaBottomNavigation = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

 
    
    const toggleMenu = () => {
      setMenuOpen(!isMenuOpen);
      console.log('Toggle Menu:', isMenuOpen);
    };
  
    const closeMenu = () => {
      setMenuOpen(false);
    };

 
  return (
    <header className={styles.header} id="header">
      <nav className={`${styles.nav} ${styles.container}`}>
        <a href="/index" className={styles.nav__logo}>
          <FontAwesomeIcon icon={faHome} style={{color:'#0369a1',fontSize:'20px'}}/>
          <span>Home</span>
        </a>

        <a href="/cashflow" className={styles.nav__logo}>
          <CompareArrowsIcon style={{color:'#0369a1',fontSize:'20px'}}/>
          <span>Cash flow</span>
        </a>

        <a href="/sales" className={styles.nav__logo}>
          <SellIcon style={{color:'#0369a1',fontSize:'20px'}}/>
         <span>Sales</span>
        </a>

        <a href="/sales" className={styles.nav__logo}>
          <BookmarkBorderIcon style={{color:'#0369a1',fontSize:'20px'}}/>
         <span>Orders</span>
        </a>

        <div className={`${styles.nav__menu} ${isMenuOpen ? styles.showMenu : ''}`} >

        

          <ul className={`${styles.nav__list} ${styles.container}`}>
            <li className={styles.nav__item}>
              <a href="/index" className={styles.nav__link}>
                <FontAwesomeIcon icon={faHome} className={styles.nav__icon} style={{color:'#16a34a'}}/> Home
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="/stocksetup" className={styles.nav__link}>
                <FontAwesomeIcon icon={faShoppingCart} className={styles.nav__icon}  style={{color:'#f59e0b'}}/> Stock setup
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="/sales" className={styles.nav__link}>
                <FontAwesomeIcon icon={faMoneyBillWave} className={styles.nav__icon} style={{color:'#22c55e'}}/> Sales
              </a>
            </li>
            <li className={styles.nav__item}> 
              <a href="/cashflow" className={styles.nav__link}>
                <FontAwesomeIcon icon={faTree} className={styles.nav__icon} style={{color:'#3b82f6'}}/> Cash-flow
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="/myattendants" className={styles.nav__link}>
                <FontAwesomeIcon icon={faUsers} className={styles.nav__icon} style={{color:'#3b82f6'}}/> Users
              </a>
            </li>
            <li className={styles.nav__item}>
              <a href="/notifications" className={styles.nav__link}>
                <FontAwesomeIcon icon={faBell} className={styles.nav__icon} style={{color:'#dc2626'}}/> Notifications 
              </a>
            </li>
          </ul>
          <FontAwesomeIcon icon={faTimes} className={styles.nav__close} id="nav-close" onClick={closeMenu}/>
        </div>

        <div className={styles.nav__btns}>
          <div className={styles.nav__toggle} id="nav-toggle" onClick={toggleMenu}>
            <AppsIcon style={{fontSize:'20px',color:'#0369a1'}}/>
          </div>
        </div> 
      </nav>
    </header>
  );
};

export default AlphaBottomNavigation;
