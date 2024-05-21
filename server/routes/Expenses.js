import express from "express";
import {
  PostExpenses,
  getBranchSummary,
  getExpenseToday,
  getExpenses,
  getReportingAnalysis,
  getStockReportSummary,
} from "../controllers/Expenses.js";

const ExpensesRouter = express.Router();

ExpensesRouter.post("/", PostExpenses);
ExpensesRouter.get("/:added_by", getExpenses);
ExpensesRouter.get("/expensetoday", getExpenseToday);
ExpensesRouter.get("/expenseanalysis", getReportingAnalysis);
ExpensesRouter.get("/stockanalysis/:Branch", getStockReportSummary);
ExpensesRouter.get("/branchanalysis/:SoldBy/:Branch", getBranchSummary);

export default ExpensesRouter;
