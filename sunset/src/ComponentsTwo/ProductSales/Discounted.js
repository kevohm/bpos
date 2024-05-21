import React from 'react'
import './Discounted.scss'
import { Link } from 'react-router-dom'

const Discounted = () => {
  return (
    <div className='Discounted'>
        <div className='TopPartDiscouts'>
            <h2>Check out for the dicounted Products</h2>
            <Link to='/analytics' style={{
              textDecoration:'none',
              color:'white',
              background:'black',
              borderRadius:'5px',
              padding:'5px 10px'
            }}>Report</Link>
        </div>
        <div className='Discounts'>
            <div className='MaxDiscounts'><h4>Maximum Discounts</h4></div>
            <div className='MinDiscounts'><h4>Minimum Discounts</h4></div>
        </div>
    </div>
  )
}

export default Discounted