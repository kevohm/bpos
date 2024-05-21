import express from 'express';
import { NewProducts, getCompanySchedules, getProductBySubsizeId, getProductDetails } from '../../controllers/NewProductsOperations/NewProds.js';

const NewProdsRoute = express.Router();

NewProdsRoute.get('/',NewProducts)
NewProdsRoute.get('/product_sizes/:productId',getProductDetails)
NewProdsRoute.get("/productBySubSize/:subsizeId", getProductBySubsizeId);
NewProdsRoute.get('/schedules/:business_id',getCompanySchedules)

export default NewProdsRoute;    