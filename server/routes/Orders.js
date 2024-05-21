import express from 'express';
import { AddResponse, EditResponse, getIndividualOrders, getOrder, getOrderResponse, updateOrder } from '../controllers/Orders.js';

const OrdersRoute = express.Router();

OrdersRoute.get('/allorders/:order_serial',getIndividualOrders);
OrdersRoute.get('/order/:order_id',getOrder);
OrdersRoute.put('/orderupdate/:order_id',updateOrder);
OrdersRoute.post('/submit_response',AddResponse);
OrdersRoute.put('/edit_response/:order_serial',EditResponse);
OrdersRoute.get('/order_respose/:order_serial',getOrderResponse);

export default OrdersRoute; 