import express from 'express';
import { CashAnalysis, Expenses } from '../controllers/CashFlow.js';

const CashFlow = express.Router();

CashFlow.get('/cashanalysis',CashAnalysis);
CashFlow.get('/expenses',Expenses); 

export default CashFlow;  