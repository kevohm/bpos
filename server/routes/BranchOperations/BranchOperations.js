import express from 'express';
import { GetAllShops, GetShops, getPaymentMethods, updatePaymentMethods, updateShops } from '../../controllers/BranchOperations/BranchOperations.js';

const ShopsRoute = express.Router();

ShopsRoute.get('/',GetAllShops);
ShopsRoute.get('/branches/:business_id',GetShops);
ShopsRoute.put('/update_branch/:branch_id',updateShops);
ShopsRoute.get('/payment_methods/:branch_id',getPaymentMethods);
ShopsRoute.put('/update_methods/:branch_id',updatePaymentMethods);

export default ShopsRoute;    