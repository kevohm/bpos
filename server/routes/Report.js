import express from 'express';
import { BranchSalesTable, GenerateReport, IndividualSales, KegSales, SalesReportBranchFlow, SalesReportFlow, SalesTables, Stock, StockAdditionBranchReport, StockAdditionReport } from '../controllers/Report.js';

const ReportRouter = express.Router();

ReportRouter.get('/',GenerateReport)
ReportRouter.get('/SalesTables',SalesTables)
ReportRouter.get('/Stock',Stock)
ReportRouter.get('/IndividualSales',IndividualSales) 
ReportRouter.get('/stockadditionreport',StockAdditionReport);
ReportRouter.get('/stockadditionbranchreport',StockAdditionBranchReport);
ReportRouter.get('/salesreportflow',SalesReportFlow);
ReportRouter.get('/salesreportbranchflow',SalesReportBranchFlow);
ReportRouter.get('/kegsales',KegSales);
ReportRouter.get('brancsalestable/:Branch',BranchSalesTable);



 
export default ReportRouter;