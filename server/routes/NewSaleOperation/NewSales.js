import express from "express";
import { createSale } from "../../controllers/NewSaleOperations/Newsales.js";
import { getCurrentUser } from "../../middleware/getCurrentUSer.js";

const newSalesRoute = express.Router();

newSalesRoute.post("/", getCurrentUser, createSale);

export default newSalesRoute;
