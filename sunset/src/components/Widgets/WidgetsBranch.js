import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/Counts.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons'


const Widget = ({ category, count,totalPrice }) => (
  <div className='Counts'> 


    <div className='Details'>
      <Link className='Link' to={`/products/${category}`}> {category} </Link> 
      <div className='CountsDetails'>
        <span>{count} left,Value: {totalPrice}</span> 
      </div>
    </div>

    <div>
      <input 
        type='checkbox'
      />
    </div>

  </div>
);

export default Widget;