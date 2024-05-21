import express from 'express';
import { AdminResponses, BranchCashContribution, BranchProfit, BranchSales, PostCashFlow, PostOrder, UserResponses, getBranchOrders, getBranchStockInformation, getCashFlow, getDailySalesReport, getOrders, getStockAddedReceipt, getStockInformation, transferStock } from '../controllers/Admin.js';

const AdminFunctions = express.Router();

AdminFunctions.get('/stockinformation/:company_id',getStockInformation);
AdminFunctions.post('/postcashflow',PostCashFlow);
AdminFunctions.get('/cashflow',getCashFlow);
AdminFunctions.get('/branchcashtotals/:Branch',BranchCashContribution);
AdminFunctions.get('/branchsales/:Branch',BranchSales);
AdminFunctions.get('/branchprofit/:Branch',BranchProfit);
AdminFunctions.get('/branchstockinformation/:Branch',getBranchStockInformation);
AdminFunctions.get('/daily_sales_report/:company_id',getDailySalesReport);
AdminFunctions.post('/postrder',PostOrder);
AdminFunctions.get('/stockadditionreceipt/:Branch',getStockAddedReceipt);
AdminFunctions.put('/transferstock',transferStock);

AdminFunctions.get('/order/:company_id',getOrders);
AdminFunctions.get('/branchorders/:Branch',getBranchOrders); 
AdminFunctions.put('/adminresponse/:order_id',AdminResponses);
AdminFunctions.put('/userresponse/:order_id',UserResponses);





export default AdminFunctions;  