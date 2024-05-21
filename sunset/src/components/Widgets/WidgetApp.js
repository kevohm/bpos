import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Widget from './WidgetsBranch';
import './Styles/WidgetApp.scss';

const WidgetApp = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => { 
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_ADDRESS + 'api/AvailableProducts/CategoryCount'
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="WidgetApp">
      {categories.map((category) => (
        <div className='Widget' key={category.category}>
          <Widget
            category={category.category}
            count={category.ProductsDivided.toLocaleString()}
            totalPrice={category.TotalPrice.toLocaleString()} // Add totalPrice prop
          />
        </div>
      ))}
    </div>
  );
};

export default WidgetApp;
