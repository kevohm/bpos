import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Single.scss";

const Single = () => {
  const { id } = useParams();
  const productId = id;
  console.log(productId);
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS +
            `api/product_operations/product_sizes/${productId}`
        );
        setProductInfo(res.data);
        console.log("The product data is:", res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [productId]);

  if (!productInfo) {
    return <div>Loading...</div>;
  }

  const { product, sizes, images, branch, subsizes } = productInfo;

  const handleQuantityChange = (sizeId, change) => {
    setProductInfo((prevState) => ({
      ...prevState,
      sizes: prevState.sizes.map((size) =>
        size.id === sizeId
          ? { ...size, quantity: size.quantity + change }
          : size
      ),
    }));
  };

  const handleQuantityChangeSub = (subsizeId, change) => {
    setProductInfo(prevState => ({
        ...prevState,
        [subsizeId]: prevState[subsizeId] + change
    }));
};

  return (
    <div className="SingleProd">
      <div className="prodDetails">
        <div className="ProductsUpperPart">
          <div className="mainImage">
            {images.imageOne && (
              <img src={images.imageOne} alt="Product Image One" />
            )}
          </div>
          <div className="ProductImages">
            {images.imageTwo && (
              <img src={images.imageTwo} alt="Product Image Two" />
            )}
            {images.imageThree && (
              <img src={images.imageThree} alt="Product Image Three" />
            )}
            {images.imageFour && (
              <img src={images.imageFour} alt="Product Image Four" />
            )}
          </div>
        </div>
        <div className="ProductsLowerPart">
          <div className="prodText">
            <h1>
              {product.product_name}, {product.category}
            </h1>
            <p>{product.Description}</p>
            <p>
              Shop outlet: {branch.name} ({branch.location})
            </p>
          </div>

          <div className="Sizes">
            <h2>Product sizes</h2>
            {sizes.map((size, index) => (
              <div key={size.id} className="Specifics">
                <h3>
                  {size.size} {size.sizeName} , Kshs {size.sellingPrice}
                </h3>
                <div className="SellingProcess">
                  <div className="quantity-control">
                    <button
                      onClick={() => handleQuantityChange(size.id, -1)}
                      disabled={size.quantity <= 0}
                    >
                      -
                    </button>
                    <input type="number" value={size.quantity} readOnly />
                    <button onClick={() => handleQuantityChange(size.id, 1)}>
                      +
                    </button>
                  </div>
                  <button>Add to cart</button>
                </div>
                {/* <p>Quantity: {size.quantity}</p> */}
                {/* <p>Buying Price: {size.buyingPrice}</p> */}

                <div className="SubSizes">
                  <h4>Product sub sizes</h4>
                  {subsizes[index] &&
                    subsizes[index].map((subsize) => (
                      <div key={subsize.id} className="subsizespecs">
                        <p>
                          {subsize.subSizeName}, {subsize.subSize}, Kshs{" "}
                          {subsize.sellingPrice}
                        </p>
                        {/* <p>Buying Price: {subsize.buyingPrice}</p> */}

                        {/* <p>Sub Quantity: {subsize.SubQuantity}</p> */}
                        <div className="SellingProcess">
                          <div className="quantity-control">
                            <button
                              onClick={() => handleQuantityChangeSub(size.id, -1)}
                              disabled={subsize.SubQuantity <= 0}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={subsize.SubQuantity}
                              readOnly
                            />
                            <button
                              onClick={() =>
                                handleQuantityChangeSub(subsize.id, 1)
                              }
                            >
                              +
                            </button>
                          </div>
                          <button>Add to cart</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
