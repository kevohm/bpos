import express from 'express';
import { AvailableForSale, CategoryCount, ProductsByCat } from '../controllers/SalesPersons.js';

const SalesDeptRouter = express.Router();

SalesDeptRouter.get('/Sales/:Branch',AvailableForSale); 

SalesDeptRouter.get('/CategoryCount',CategoryCount); 
SalesDeptRouter.get('/:category',ProductsByCat);

export default SalesDeptRouter;