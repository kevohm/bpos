import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './ThankYouPage.css'; 
import { motion } from 'framer-motion'

const ThankYouPage = () => {
  const navigate = useNavigate(); // Get the navigate function 

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/index'); // Navigate to the "/index" route after 3 seconds
    }, 5000);

    return () => clearTimeout(timeout); // Clear the timeout when the component unmounts
  }, [navigate]);

  return (
    <motion.div style={{display:'flex',flexDirection:'column',gap:'20px',alignItems:'center',justifyContent:'center',paddingTop:'50px'}}
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{delay:1.5, duration:1.5,type:'spring'}}
    >
      <div className="tick">
        <div className="animated-tick">&#10004;</div>
      </div>
      <h1>Thank You for Your Purchase!</h1>
      <p>Your payment has been successfully processed.</p>
      <p>Thank you for shopping with us. We appreciate your business.</p>

      <Link to="/index">
        <button className="browse-button">Sell more...</button>
      </Link>
    </motion.div>
  );
};

export default ThankYouPage;
