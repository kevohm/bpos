import React, { useState } from 'react';
import axios from 'axios';
import NavigationBar from '../NavigationBar/NavigationBar';
import Navigation from '../../pages/NavOfficial/Navigation';

const CartPage = () => {
  const [dispatchedProducts, setDispatchedProducts] = useState(JSON.parse(localStorage.getItem('dispatchedProducts')));

  const handleDeleteItem = (name, amountMl) => {
    const updatedProducts = dispatchedProducts.filter(
      (product) => product.name !== name || product.amountMl !== amountMl
    );
    setDispatchedProducts(updatedProducts);
    localStorage.setItem('dispatchedProducts', JSON.stringify(updatedProducts));
  };

  const handleCompleteOrder = async () => {
    try {
      // Make a request to mark all items as sold in the database
      await axios.post('/api/mark-items-as-sold', dispatchedProducts);

      // Clear the dispatchedProducts from localStorage
      localStorage.removeItem('dispatchedProducts');

      // Show a success message or perform any additional actions
      console.log('Order completed successfully');
    } catch (error) {
      // Handle error scenarios
      console.error('Error completing order:', error);
    }
  };

  const handleClearCart = () => {
    setDispatchedProducts([]);
    localStorage.removeItem('dispatchedProducts');
  };

  if (!dispatchedProducts || dispatchedProducts.length === 0) {
    return  <div className="home">
              <div className='HomeDeco'>
                  <Navigation />
                <div className="homeContainer">
                  <NavigationBar />
                  <div style={{marginTop:'20%',fontWeight:'bold'}}> <p>Your cart is empty.</p> </div>
                </div>
              </div>
            </div>;
  }

return (
<div className="home">
<div className='HomeDeco'>
  <Navigation />
  <div className="homeContainer">
    <NavigationBar />
    <div>
      <h2>Cart</h2>
      <div>
        {dispatchedProducts.map((product) => (
          <span key={`${product.name}_${product.amountMl}`} style={{
            display:'flex',justifyContent:'center',alignItems:'center',gap:'30px',marginBottom:'15px'
          }}>
            <div style={{display:'flex',gap:'20px'}}> 
              <span>{product.name}</span> 
              <span>Amount: {product.amountMl} ml</span> 
              <span>Price: {product.average_price.toLocaleString()}</span>
            </div>
            <button onClick={() => handleDeleteItem(product.name, product.amountMl)} 
              style={{
                background:'red',
                padding:'5px 10px',
                border:'none',
                borderRadius:'10px',
                color:"white",
                cursor:'pointer'
              }}
            >Delete</button>
          </span>
        ))}
      </div>
      <div style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        gap:'20px'
      }}>
      
        <button onClick={handleClearCart}   style={{
          background:'red',
          padding:'5px 10px',
          border:'none',
          borderRadius:'10px',
          color:"white",
          cursor:'pointer'
        }}>Clear Cart</button>

        <button onClick={handleCompleteOrder}   style={{
          background:'green',
          padding:'5px 10px',
          border:'none',
          borderRadius:'10px',
          color:"white",
          cursor:'pointer'
        }}>Complete Order</button>


      </div>
    
    </div>
    </div>
    </div>
    </div>
  );
};

export default CartPage;
