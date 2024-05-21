import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductsShow from '../../Products/ProductsShow';

const Prices = () => {
  const [prices, setPrices] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentMinPrice, setCurrentMinPrice] = useState(0);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + '/api/Products')
      .then((response) => {
        setPrices(response.data);
        setFilteredProducts(response.data);

        const min = Math.min(...response.data.map(product => product.price));
        const max = Math.max(...response.data.map(product => product.price));
        
        document.getElementById('priceRange').min = min;
        document.getElementById('priceRange').max = max;
      });
  }, []);

  useEffect(() => {
    const filtered = prices.filter((product) => product.price >= minPrice);
    setFilteredProducts(filtered);
  }, [prices, minPrice]);

  const handlePriceChange = (event) => {
    setMinPrice(parseInt(event.target.value));
    setCurrentMinPrice(parseInt(event.target.value));
  };

  return (
    <div>
      <h1>Product Prices</h1>
      <div style={{ display: 'flex' }}>
        <input
          type="range"
          id="priceRange"
          name="priceRange"
          style={{ maxWidth: '200px', width: '100%' }}
          min="0"
          onChange={handlePriceChange}
        />
      </div>
      <p>Current Minimum Price: {currentMinPrice}</p>
     
    </div>
  );
}

export default Prices;
