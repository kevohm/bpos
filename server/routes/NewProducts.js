import express from "express";
import { AddNewProduct, AddNewService, getProduct } from "../controllers/NewProducts.js";

const NewProductRouter = express.Router();

NewProductRouter.post("/", AddNewProduct);
NewProductRouter.post("/new_service",AddNewService);
NewProductRouter.get("/:productId",getProduct);


export default NewProductRouter;
 