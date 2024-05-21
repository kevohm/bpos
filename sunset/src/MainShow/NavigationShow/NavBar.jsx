import { FiHeart } from "react-icons/fi";
import { AiOutlineShoppingCart, AiOutlineUserAdd } from "react-icons/ai";
import { FiSearch } from 'react-icons/fi';
import "./Nav.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

const NavBar = ({ setSearchQuery, cart  }) => {
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const getCartItemCount = () => {
    const itemCount = localStorage.getItem('cartItemCount');
    return itemCount ? parseInt(itemCount, 10) : 0;
  };


  return (
    
    <div className="nav"> 
      <div className="nav-container">
        <input
          className="search-input"
          type="text"
          placeholder="Enter your drink here..."
          onChange={handleSearchInputChange}
        />
        
      </div>
      <div className="profile-container">
      
        <a href="/cart" className="cart-icon-container" style={{border:'none',outline:'none'}}>
          <button style={{border:'none',outline:'none'}}><AiOutlineShoppingCart className="nav-icons" /></button>
          <div className="cart-count ">
          <span>{getCartItemCount()}</span>
          </div>
         
        </a>

        <a href="/report">
        <FontAwesomeIcon icon={faFileAlt} style={{fontSize:'20px',color:'green',fontWeight:'bold'}} />
        </a> 

        
        <a href="/productedits">
          <button style={{backgroundColor:'green',color:'white',border:'none',outline:'none',borderRadius:'5px',padding:'0px 10px'}}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </a>

       

        
      </div>
    </div>
  
  );
};

export default NavBar;