import express from 'express';
import { BarChartSales, BarChartSummary, DailyExpenses, DailySales, DailyStockAdditions, PeroductSaleCount, SalesAnalysisChart, SalesReport, SalesReportCash, getSaleTotalAnalysis, groupProductAnalytics, singleProductCount, singleProductPercentages, stockShow } from '../controllers/GroupAnalytics.js';

const groupAnalytics = express.Router();

groupAnalytics.get('/groupanalytics/:company_id',groupProductAnalytics);
groupAnalytics.get('/productcount/:name/:amountMl',singleProductCount);
groupAnalytics.get('/productpercent/:name/:amountMl',singleProductPercentages);
groupAnalytics.get('/barchartsummary',BarChartSummary);
groupAnalytics.get('/salesbarchart',BarChartSales); 
groupAnalytics.get('/salesanalysischart',SalesAnalysisChart);
groupAnalytics.get('/salesreport',SalesReport);   
groupAnalytics.get('/salesreportcash',SalesReportCash);
groupAnalytics.get('/productsalecount',PeroductSaleCount)
groupAnalytics.get('/summaryanalysis',getSaleTotalAnalysis)
groupAnalytics.get('/stockshow',stockShow);
groupAnalytics.get('/dailysales/:company_id',DailySales);
groupAnalytics.get('/dailystockaddition/:company_id',DailyStockAdditions);
groupAnalytics.get('/dailyexpenses',DailyExpenses) 

 
export default groupAnalytics;    