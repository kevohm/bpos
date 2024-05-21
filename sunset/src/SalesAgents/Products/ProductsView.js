import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import "./NewProductsView.scss";

const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_ADDRESS}/api/product_operations`
        );
        setProducts(response.data);
      } catch (error) {
        setError("Error fetching products.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="NewProductsView">Loading...</div>;
  }

  if (error) {
    return <div className="NewProductsView">{error}</div>;
  }

  return (
    <div className="NewProductsView">
        {products.map((item) => (
          <div key={item.product_id} className="NewProductsShow">
            <div className="NewSingleProduct">
              <div className="imageProduct">
                <h5>
                  <FaShoppingCart className="sellIcon" />
                </h5>
                <div className="TheImage">
                  {" "}
                  <img src={item.imageUrl} alt={item.product_name} />{" "}
                </div>
                <div className="imageDetails">
                  <p>{item.category}</p>
                  <h3>{item.product_name}</h3>
                  <button>
                    <FaShoppingCart className="shoppingicon" />{" "}
                    <span><a href={`/product/${item.product_id}`}>+ Add to cart</a></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductsView;
