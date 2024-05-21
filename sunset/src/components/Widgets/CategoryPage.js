import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavigationBar from '../NavigationBar/NavigationBar';
import Navigation from '../../pages/NavOfficial/Navigation';
import CartPage from './CartPage';
import './Styles/CategoryCount.scss';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [dispatchedProducts, setDispatchedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_ADDRESS + `/api/AvailableProducts/${category}`
      );
      const productsWithQuantity = response.data.map((product) => ({
        ...product,
        quantity: quantities[`${product.name}_${product.amountMl}`] || 0,
      }));
      setProducts(productsWithQuantity);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSell = (name, amountMl) => {
    const key = `${name}_${amountMl}`;
    const currentQuantity = quantities[key] || 0;
    if (currentQuantity > 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [key]: currentQuantity - 1,
      }));
    }
  };

  const handleAdd = (name, amountMl) => {
    const key = `${name}_${amountMl}`;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [key]: prevQuantities[key] ? prevQuantities[key] + 1 : 1,
    }));
  };

  const handleDispatchToCart = () => {
    const productsToDispatch = Object.entries(quantities).flatMap(([key, value]) => {
      const [name, amountMl] = key.split('_');
      const product = products.find((product) => product.name === name && product.amountMl === amountMl);
      return Array.from({ length: value }, () => product);
    });
    
    localStorage.setItem('dispatchedProducts', JSON.stringify(productsToDispatch));
    setQuantities({});
    toast.success('Products dispatched to cart');
   
  };
  

  return (
    <div className="home">
      <div className='HomeDeco'>
        <Navigation />
        <div className="homeContainer">
          <NavigationBar />
          <div className='CategoryCount'>
            <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',marginTop:'10px'}}>
              <h2>{category}</h2>  
              {Object.values(quantities).some((quantity) => quantity > 0) && (
                <button onClick={handleDispatchToCart} style={{
                  padding:'10px 15px',
                  backgroundColor:'#f68b1e',
                  color:'white',
                  border:'none',
                  borderRadius:'10px'
                }}>Dispatch to Cart</button>
              )}
            </div>
            <div className='CatBuscket'>
              {products.map((product) => (
                <div key={`${product.name}_${product.amountMl}`} className='Cat'>
                  <span>{product.name}</span>
                  <span>Amount: {product.amountMl.toLocaleString()} ml</span>
                  <span>KES: {product.average_price.toLocaleString()}</span>
                  <span>Count: {product.count.toLocaleString()}</span>
                  <span>Cat: {product.category}</span>
                  {product.count > 0 && (
                    <div>
                      {quantities[`${product.name}_${product.amountMl}`] > 0 ? (
                        <div
                          style={{display:'flex',flexDirection:'row',gap:'10px',paddingTop:'15px'}}
                        >
                          <button style={{
                            backgroundColor:'#f68b1e',
                            color:'white',
                            border:'none',
                            padding:'5px 10px',
                            fontWeight:'bold',
                            fontSize:'15px',
                            borderRadius:'50%',
                            display:'flex',
                            justifyContent:'center',
                            alignItems:'center'
                          }} 
                          onClick={() => handleSell(product.name, product.amountMl)}>-</button>

                          <span>{quantities[`${product.name}_${product.amountMl}`]}</span>
                          <button
                            disabled={quantities[`${product.name}_${product.amountMl}`] === product.count}
                            onClick={() => handleAdd(product.name, product.amountMl)}
                            style={{
                              backgroundColor:'#f68b1e',
                              color:'white',
                              border:'none',
                              padding:'5px 10px',
                              fontWeight:'bold',
                              fontSize:'15px',
                              borderRadius:'50%',
                              display:'flex',
                              justifyContent:'center',
                              alignItems:'center'
                            }} 
                          >
                            +
                          </button>

                        </div>
                      ) : (
                        <button 
                        onClick={() => handleAdd(product.name, product.amountMl)}
                        style={{
                          backgroundColor:'#f68b1e',
                          color:'white',
                          border:'none',
                          padding:'5px 10px',
                          fontWeight:'bold',
                          fontSize:'15px',
                          borderRadius:'10%',
                          display:'flex',
                          justifyContent:'center',
                          alignItems:'center',
                          marginTop:'15px'
                        }} 
                        >Sell items</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
         
          
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
