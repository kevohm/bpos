import React from 'react';

const PriceBar = ({ prices, minPrice, setMinPrice }) => {
  // Calculate the maximum price from the prices array
  const handlePriceChange = (e) => {
    const selectedPrice = parseInt(e.target.value, 10);
    setMinPrice(selectedPrice);
  };

  return (
    <div>
      <label htmlFor="priceRange">Price Range:</label>
      <input
        type="range"
        id="priceRange"
        name="priceRange"
        min={0}
        max={5000}
        value={minPrice}
        onChange={handlePriceChange}
      />
      <p>Min Price: ${minPrice}</p>
    </div>
  );
}

export default PriceBar;
