import express from 'express';
import { AddCategory, AddProduct, AllProductsAnalysis, GetAllProducts, GetCategories, GetNotifications, GetProductEvents, GetProductOrders, ProductUpdate, ProductUpdate2, StockPerformance, deleteProduct, getProduct, harmonizeStock } from '../controllers/products.js';

 
const ProductsRoute = express.Router();
 
ProductsRoute.post('/addProduct',AddProduct); 
ProductsRoute.get('/',GetAllProducts);
ProductsRoute.delete('/deleteRecord/:id',deleteProduct);
ProductsRoute.put("/productedit/:id",ProductUpdate);  
ProductsRoute.put("/stockharmony/:Branch",harmonizeStock);
ProductsRoute.get('/stockperformance/:Branch',StockPerformance);
ProductsRoute.get("/productevents/:id",GetProductEvents); 
ProductsRoute.get("/productorders/:id",GetProductOrders);
ProductsRoute.get("/systemnotifications/:company_id",GetNotifications);
ProductsRoute.put("/productedit2/:id",ProductUpdate2); 
ProductsRoute.get("/:id",getProduct);
ProductsRoute.post("/category",AddCategory);
ProductsRoute.get("/categories",GetCategories);
ProductsRoute.get("/allproducts",AllProductsAnalysis)

export default ProductsRoute;    