import React, { useEffect, useState } from 'react';
import SidebarShow from '../sideBar/SideBarShow';
import Nav from '../NavigationShow/Nav';
import './CartShow.scss'
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import BottomMenu from '../../components/NavigationBar/BottomNav/BottomMenu';
import SalesPersonsNavigation from '../NavigationShow/SalesPersonsNavigation';
import { motion } from 'framer-motion' 
import cart_image from './empty_cart.svg'

const CartShow = () => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [smallCupPrice,setSmallCupPrice] = useState('');
  const [largeCupPrice,setLargeCupPrice] = useState('');
  const [smallCupVolume,setSmallCupVolume] = useState('');
  const [largeCupVolume,setLargeCupVolume] = useState('');
  const [cupQuantities, setCupQuantities] = useState({});

  const [selectedCup, setSelectedCup] = useState('');



  useEffect(() => {
    const savedCupQuantities = JSON.parse(localStorage.getItem('cupQuantities'));
    if (savedCupQuantities) {
      setCupQuantities(savedCupQuantities);
    }
    const savedSelectedCup = localStorage.getItem('selectedCup');
    if (savedSelectedCup) {
      setSelectedCup(savedSelectedCup);
    }
  }, []);


  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    localStorage.setItem('cartItemCount', '0');
    toast.info('Cart has been cleared', {
      position: 'bottom-right',
      autoClose: 1000,
    });
    setTimeout(() => navigate('/index'), 500);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((product) => product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    const itemCount = updatedCart.length;
    localStorage.setItem('cartItemCount', itemCount.toString());
    toast.warning('Item has been removed from cart', {
      position: 'bottom-right',
      autoClose: 500,
    });
  };

  const incrementQuantity = (productId) => {
    const existingProduct = cart.find((product) => product.id === productId);
  
    if (!existingProduct) {
      return;
    }
    if (existingProduct.category === "Senator Keg") {
      const updatedCart = cart.map((product) => {
        if (product.id === productId) {
          const newQuantity = product.quantity + 1;
          const newCount = product.count + 1;
          return { ...product, quantity: newQuantity, count: newCount };
        }
        return product;
      });
  
      setCart(updatedCart);
  
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      const changedQuantity = updatedCart.find((product) => product.id === productId).quantity - cart.find((product) => product.id === productId).quantity;
      const itemCount = parseInt(localStorage.getItem('cartItemCount')) + changedQuantity;
      localStorage.setItem('cartItemCount', itemCount.toString());

      toast.success('Cart has been updated', {
        position: 'bottom-right',
        autoClose: 1000,
      });
  
      return;
    }
  
    if (existingProduct.count >= existingProduct.initialQuantity) {
      toast.warning('Maximum count reached', {
        position: 'bottom-right',
        autoClose: 1000,
      });
      return;
    }
  
    const updatedCart = cart.map((product) => {
      if (product.id === productId) {
        const newQuantity = product.quantity < product.initialQuantity
          ? product.quantity + 1
          : product.quantity;
        const newCount = product.count + 1;
        return { ...product, quantity: newQuantity, count: newCount };
      }
      return product;
    });
  
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    const changedQuantity = updatedCart.find((product) => product.id === productId).quantity - cart.find((product) => product.id === productId).quantity;
  
    const itemCount = parseInt(localStorage.getItem('cartItemCount')) + changedQuantity;
    localStorage.setItem('cartItemCount', itemCount.toString());
  
    toast.success('Cart has been updated', {
      position: 'bottom-right',
      autoClose: 1000,
    });
  };
  
  
  const decreaseQuantity = (productId) => {
    const existingProduct = cart.find((product) => product.id === productId);
  
    if (!existingProduct) {
      return;
    }
    if (existingProduct.count <= 1) {
      toast.warning('Minimum deletion reached', {
        position: 'bottom-right',
        autoClose: 1000,
      });
      return;
    }
  
    const updatedCart = cart.map((product) => {
      if (product.id === productId) {
        const newQuantity = Math.max(product.quantity - 1, 1);
        const newCount = product.count - 1; 
        return { ...product, quantity: newQuantity, count: newCount };
      }
      return product;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    const changedQuantity = updatedCart.find((product) => product.id === productId).quantity - cart.find((product) => product.id === productId).quantity;
    const itemCount = parseInt(localStorage.getItem('cartItemCount')) + changedQuantity;
    localStorage.setItem('cartItemCount', itemCount.toString());
  
    toast.info('Cart has been updated', {
      position: 'bottom-right',
      autoClose: 1000,
    });
  };
  

  const getCartItemCount = () => {
    const itemCount = localStorage.getItem('cartItemCount');
    return itemCount ? parseInt(itemCount, 10) : 0;
  };

  const totalAmount = cart.reduce((total, product) => {
    let productPrice = product.price * product.quantity;
    return total + productPrice;
  }, 0);


  const handleCheckout = () => {
    const cartCount = getCartItemCount();

    const totalAmount = cart.reduce((total, product) => {
      let productPrice = 0;

      if (product.category === 'Senator Keg') {
        if (selectedCup === 'Small') {
          productPrice = product.smallCupSp * cupQuantities[product.id]?.Small || 0;
        } else if (selectedCup === 'Large') {
          productPrice = product.LargeCupSp * cupQuantities[product.id]?.Large || 0;
        }
      } else {
        // For products other than 'Senator Keg', use the regular price calculation
        productPrice = product.price * product.quantity;
      }

      return total + productPrice;
    }, 0);
    
    navigate(`/payment?cartCount=${cartCount}&totalAmount=${totalAmount}`);
  };

  const calculatePoints = (totalAmount) => {
    const pointsPer100 = 1;
    const points = Math.floor(totalAmount / 100) * pointsPer100;
    return points;
  };
      
  return (
    <div>
    <SalesPersonsNavigation setSearchQuery={setSearchQuery} />

    <motion.div className='CartAll' 
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{delay:1.5, duration:1.5,type:'spring'}}
    >

    <div className='CartShow'>
        <div className='ClearButton'><button onClick={clearCart}>Clear Cart</button></div>
      {cart.length > 0 ? (
        <ul className='Listings'>
          {cart.map((product) => (
            <li key={product.id} className='ListShow'> 

                <div className='ProductAll'>
                  <div className='ImageShow'> 
                      <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      />
                      
                  </div>
                  <div className='CartDesc'>
                      <span>{product.name}</span>

                      {product.category !== 'Senator Keg' &&(
                        <p> <small>Volume:</small>  {product.amountMl} ml</p>
                      )}

                      {product.category === 'Senator Keg' &&(
                        <p> <small>Cup type:</small>  {product.ProductStatus}</p>
                      )}
                      
                  </div>
                </div>
                <div className='CartPriceControl'>
            
                    <div className='Controls'>
                    <button onClick={() => decreaseQuantity(product.id)}>-</button>
                    <small>{product.quantity}</small>
                    <button onClick={() => incrementQuantity(product.id)}>+</button>
                    </div>
             
                </div>

                <div className='PriceCount'>
                  <span> KES </span>
                  <span>{(product.price * product.quantity).toLocaleString()}</span>
                </div>
             
                <div className='deleteButtonCart'>
                  <button onClick={() => removeFromCart(product.id)}><FaTrash /> </button>
                </div>
           

            </li>
          ))}
        </ul>
      ) : (
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'20px'}}>
          <img src={cart_image} alt=''/>
          <p style={{fontWeight:'bold'}}>Your cart is empty.</p>
          <small>Looks like there are no items in the shopping cart.</small>
        </div>
      )}
      
    </div>

    <div className='Checkout'>

        <div className='SummaryHeader'>
            <h1>CART SUMMARY <span>({getCartItemCount()})</span> </h1>
        </div>

        <div className='cartAmount'>
          <span>Subtotal</span>
          <div className='Totals'>
            <p>KES {totalAmount.toLocaleString()}</p>
          </div>
        </div> 

        <div className='cartAmount'>
          <span>Discount</span>
          <div className='Totals'>
            <p>KES 0</p>
          </div>
        </div> 

        <div className='cartAmountTotal'>
          <span>Subtotal</span>
          <div className='Totals'>
            <p>KES {totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className='PointsEarned'>
          <span>(Points earned:</span>
          <span>{calculatePoints(totalAmount)})</span>
        </div>

        <div className='CheckoutButton'>
          <button onClick={() => handleCheckout(totalAmount)}>Checkout (KES {totalAmount.toLocaleString()})</button>
        </div>

    </div>

    </motion.div>
        
    </div>
  );
};

export default CartShow;
