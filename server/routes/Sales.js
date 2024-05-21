import express from "express";
import {
  AvailablProducts,
  GetLastSevenDays,
  ProductGroups,
  ProductSalesData,
  archiveProducts,
  completePayment,
  sellProducts,
} from "../controllers/Sales.js";

const SalesRouter = express.Router();

SalesRouter.get("/", ProductGroups);
SalesRouter.get("/available", AvailablProducts);
SalesRouter.put("/SellProducts", sellProducts);
SalesRouter.put("/archiveproducts", archiveProducts);
SalesRouter.post("/completepayment", completePayment);
SalesRouter.get("/productsales/:company_id", ProductSalesData);
SalesRouter.get("/seven_days/:productId", GetLastSevenDays);

export default SalesRouter;
