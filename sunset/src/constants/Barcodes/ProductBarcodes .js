import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';

const ProductBarcodes = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  return (
    <div>
      <h1>Generate Barcodes</h1>
      <div>
        <label htmlFor="product">Select Product:</label>
        <select id="product" value={selectedProduct} onChange={handleProductChange}>
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity">Quantity per Product:</label>
        <input type="number" id="quantity" value={quantity} min="1" onChange={handleQuantityChange} />
      </div>
      {selectedProduct && (
        <div>
          <h2>{products.find((product) => product.id === selectedProduct).name}</h2>
          {[...Array(quantity)].map((_, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <Barcode value={selectedProduct.toString()} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductBarcodes;
