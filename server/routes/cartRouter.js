import express from "express";
import {
  addToCart,removeFromCart,getCart,clearCart
} from "../controllers/Cart.js";

const cartRouter = express.Router();

cartRouter.route("/").get(getCart)
cartRouter.route("/add/:productId").post(addToCart)
cartRouter.route("/remove/:productId").post(removeFromCart)
cartRouter.route("/clear").post(clearCart)

export default cartRouter;