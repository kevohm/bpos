import express from 'express';
import { GetSales, StockAnalysis, StockReport } from '../controllers/SalesAnalysis.js';

const SalesAnalysisRoute = express.Router();

SalesAnalysisRoute.get('/SalesAnalysis',GetSales);
SalesAnalysisRoute.get('/StockReport',StockReport);
SalesAnalysisRoute.get('/StockAnalysis',StockAnalysis)

export default SalesAnalysisRoute; 