import axios from "axios";
import { pool } from "../pool.js";
import { configs } from "../config/base.js";

export const addToCart = async (req, res) => {
  const { productId } = req.params;
  const { userId, subSizeId, sizeId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Please provide a userId" });
  }
  if (!subSizeId) {
    return res.status(400).json({ message: "Please provide a subSizeId" });
  }
  if (!sizeId) {
    return res.status(400).json({ message: "Please provide a sizeId" });
  }
  if (!productId) {
    return res.status(400).json({ message: "Please provide a productId" });
  }
  try {
    // Check if the product exists
    const [product] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      productId
    );

    // If product not found
    if (product.length === 0) {
      return res.status(404).json({ message: "Product does not exist" });
    }

    // // Check if the product is already in the cart
    // const [existingProduct] = await pool.query(
    //   "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    //   [userId, productId]
    // );

    // console.log(existingProduct);
    // // If product already exists in the cart
    // if (existingProduct.length > 0) {
    //   const updateQuery =
    //     "UPDATE cart SET count = count + 1 WHERE user_id = ? AND product_id = ?";

    //   const data = [userId, productId];

    //   await pool.query(updateQuery, data);
    //   return res
    //     .status(400)
    //     .json({ message: "Product count increased in the cart" });
    // }
    const { data } = await axios.get(
      `${configs.SERVER_URL}/product_operations/product_sizes/${productId}`
    );
    return res.json(data);
    // Insert product into cart
    const insertQuery =
      "INSERT INTO `cart`(`user_id`, `count`, `price`, `product_id`) VALUES (?, ?, ?, ?)";
    const queryData = [userId, 1, product.price, productId];
    await pool.query(insertQuery, queryData);

    return res.status(200).json({ message: "Product added to cart" });
    return res.status(500).json({ message: "Server error" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Please provide a userId" });
  }
  if (!productId) {
    return res.status(400).json({ message: "Please provide a productId" });
  }
  try {
    // Check if the product exists in the cart
    const [productInCart] = await pool.query(
      "SELECT * FROM cart WHERE product_id = ? AND user_id = ?",
      [productId, userId]
    );

    // If product not found in the cart
    if (productInCart.length === 0) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
    // If the count is greater than 1, decrement the count
    if (productInCart[0].count > 1) {
      const updateQuery =
        "UPDATE cart SET count = count - 1 WHERE product_id = ? AND user_id = ?";
      await pool.query(updateQuery, [productId, userId]);
    } else {
      // If count is 1, remove the product from the cart
      const deleteQuery =
        "DELETE FROM cart WHERE product_id = ? AND user_id = ?";
      await pool.query(deleteQuery, [productId, userId]);
    }
    return res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Please provide a userId" });
  }
  try {
    // Check if there are any items in the cart for the user
    const [cartItems] = await pool.query(
      "SELECT * FROM cart WHERE user_id = ?",
      userId
    );

    // If cart is already empty
    if (cartItems.length === 0) {
      return res.status(404).json({ message: "Cart is already empty" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  try {
    // Clear the cart for the user
    const deleteQuery = "DELETE FROM cart WHERE user_id = ?";
    await pool.query(deleteQuery, [userId]);

    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Please provide a userId" });
  }
  try {
    // Select all items in the cart for the user
    const [cartItems] = await pool.query(
      "SELECT * FROM cart WHERE user_id = ?",
      userId
    );

    // If cart is empty
    if (cartItems.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice += item.count * Number(item.price);
    }

    return res
      .status(200)
      .json({ message: "Cart found", cart: cartItems, totalPrice });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
