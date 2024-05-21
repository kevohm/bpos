import express from "express";
import authRoute from "./routes/Auth.js";
import ProductsRoute from "./routes/products.js";
import SalesAnalysisRoute from "./routes/SalesAnalysis.js";
import SalesDeptRouter from "./routes/SalesPersons.js";
import bodyParser from "body-parser";
import ReportRouter from "./routes/Report.js";
import cors from 'cors'
import CashFlow from "./routes/CashFlow.js";
import SalesRouter from "./routes/Sales.js";
import Analytics from "./routes/Analytics.js";
import groupAnalytics from "./routes/GroupAnalytics.js";
import ExpensesRouter from "./routes/Expenses.js";
import AdminFunctions from "./routes/Admin.js";
import OrdersRoute from "./routes/Orders.js";
import MpesaRouter from "./routes/Mpesa.js";
import NewProductRouter from "./routes/NewProducts.js";
import CompanyRegisterRouter from "./routes/CompanyRegistration.js";
import NewProdsRoute from "./routes/NewProductsOperations/NewProds.js";

import dotenv from "dotenv"
import ShopsRoute from "./routes/BranchOperations/BranchOperations.js";
import userOperationsRoute from "./routes/UserOperations/UserOperations.js";
import newSalesRoute from "./routes/NewSaleOperation/NewSales.js";
import cartRouter from "./routes/cartRouter.js";

dotenv.config()

const app = express()

const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200,
  }
   
  
app.use(cors(corsOptions));  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/Auth", authRoute);
app.use('/api/Products',ProductsRoute); 
app.use('/api/Sales',SalesAnalysisRoute);
app.use('/api/AvailableProducts',SalesDeptRouter);
app.use('/api/search',ReportRouter);
app.use('/api/cashflow',CashFlow);
app.use('/api/ProductSales',SalesRouter);
app.use('/api/analytics',Analytics)
app.use('/api/groupAnalytics',groupAnalytics);
app.use('/Images', express.static('public/Images'));
app.use('/stockreceipts',express.static('public/stockreceipts'));
app.use('/companies',express.static('public/companies')); 
app.use('/userupdates',express.static('public/userupdates'));
app.use('/api/expenses',ExpensesRouter);
app.use('/api/adminfunctions',AdminFunctions);
app.use('/api/userorders',OrdersRoute);
// NEW SYSTEM ROUTES //
app.use('/api/mpesa',MpesaRouter);
app.use('/api/newproducts',NewProductRouter);
app.use('/api/company_registration',CompanyRegisterRouter);
app.use('/api/product_operations',NewProdsRoute);
app.use('/api/branch_operations',ShopsRoute);
app.use('/api/user_operations',userOperationsRoute);
app.use('/api/newsales',newSalesRoute);
app.use("/api/cart", cartRouter);

app.listen(3001, ()=>{
    console.log("Connected!!")
})