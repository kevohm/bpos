import express from 'express';
import { ArchivedProducts, Attendants, AvailablProductsTwo, BranchAmounts, BranchAnalytics, BranchMoneyDist, BranchPerformance, BranchProductStatus, CardAnalytics, CardSales, CashAnalytics, CashAtHand, CashSales, CompanyProfit, GetBranches, GetCategories, MoneyPerformance, MpesaAnalytics, MpesaSales, ProductAnalytica, ProductEdit, SalesShow, StockComparison, StockPerformance, attendantsShifts, singleProductCount, singleProductPercentages } from '../controllers/Analytics.js';

const Analytics = express.Router();

Analytics.get('/productanalysis',ProductAnalytica);
Analytics.get('/categories',GetCategories); 
Analytics.get('/branches/:company_id',GetBranches); 
Analytics.get('/branchperformance',BranchPerformance);
Analytics.get('/moneyperfomance',MoneyPerformance);

Analytics.get('/stockcomparison',StockComparison); 
Analytics.get('/stockperformance',StockPerformance); 
Analytics.get('/companyprofit/:company_id',CompanyProfit);  
Analytics.get('/salesshow/:company_id',SalesShow);
Analytics.get('/cashathand/:company_id',CashAtHand)
Analytics.get('/mpesasales',MpesaSales);
Analytics.get('/cashsales',CashSales);
Analytics.get('/cardsales',CardSales);
Analytics.get('/mpesaanalytics',MpesaAnalytics); 
Analytics.get('/cashanalytics',CashAnalytics);
Analytics.get('/cardanalytics',CardAnalytics);

Analytics.get('/:Branch',BranchAnalytics);
Analytics.get('/attendant/:Branch',Attendants) 
Analytics.get('/branchamounts/:Branch',BranchAmounts);
Analytics.get('/branchproductstatus/:Branch',BranchProductStatus);
Analytics.get('/branchmoney/:Branch',BranchMoneyDist);

Analytics.get('/shifts/:Branch',attendantsShifts);
Analytics.get('/archive/:Branch',ArchivedProducts);
Analytics.get('/available/:Branch',AvailablProductsTwo);
Analytics.get('/productedit/:id',ProductEdit)
Analytics.get('/productcount/:name/:Branch/:amountMl',singleProductCount);
Analytics.get('/productpercent/:name/:Branch/:amountMl',singleProductPercentages);


export default Analytics;