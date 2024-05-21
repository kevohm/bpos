import { db } from "../db.js";

const generateUniqueCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueCode = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueCode += characters.charAt(randomIndex);
  }

  return uniqueCode;
};

export const PostExpenses = (req, res) => {
  const {
    expenseAmount,
    description,
    added_by,
    Branch,
    stockAmount,
    company_id,
    date_added,
    user_name,
  } = req.body;

  const uniqueCode = generateUniqueCode();

  const sql =
    "INSERT INTO expenses (expense_amount, description, added_by, Branch, unique_code,stockAmount,company_id,date_added,user_name) VALUES (?, ?, ?, ?,?,?,?,?,?)";

  db.query(
    sql,
    [
      expenseAmount,
      description,
      added_by,
      Branch,
      uniqueCode,
      stockAmount,
      company_id,
      date_added,
      user_name,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
        return;
      }

      res.status(200).json({ success: true });
    }
  );
};

export const getExpenses = (req, res) => {
  const { q } = req.query;

  const added_by = req.params.added_by;

  const SelectQuery = `SELECT * FROM expenses where added_by = ? AND expense_amount != 0 ORDER BY date_added DESC`;

  const search = (data) => {
    const keys = ["unique_code"];
    const regex = new RegExp(q, "i");

    return data.filter((item) => {
      for (const key of keys) {
        if (item[key] && regex.test(item[key])) {
          return true;
        }
      }
      return false;
    });
  };

  db.query(SelectQuery, [added_by], (err, data) => {
    if (err) return res.send(err);
    return q ? res.status(200).json(search(data)) : res.json(data);
  });
};

export const getExpenseToday = (req, res) => {

  const { shift_start_time, shift_end_time, SoldBy } = req.query;

  const SelectQuery = `
                      SELECT * FROM expenses WHERE added_by= ?
                      AND date_added 
                      BETWEEN ? AND ? AND expense_amount != 0
                        `;

  db.query(SelectQuery, [shift_start_time, shift_end_time, SoldBy], (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }

    res.json(data);
  });
};

export const getReportingAnalysis = (req, res) => {
  const { shift_start_time, shift_end_time, SoldBy } = req.query;

  const q = `
      SELECT
      COALESCE((SELECT SUM(total) FROM Mpesa WHERE date BETWEEN ? AND ? AND Branch = ?), 0) AS totalMpesaSalesToday,
      COALESCE((SELECT SUM(productTotal) FROM Cash WHERE date BETWEEN ? AND ? AND Branch = ?), 0) AS totalCashSalesToday,
      COALESCE((SELECT SUM(expense_amount) FROM expenses WHERE date_added BETWEEN ? AND ? AND Branch = ?), 0) AS totalExpensesToday;
    `;

  db.query(q, [shift_start_time, shift_end_time, SoldBy], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send(err); // Handle the error properly
    }

    return res.status(200).json(data);
  });
};

export const getStockReportSummary = (req, res) => {
  const Branch = req.params.Branch;
  const SelectQuery = `
              SELECT 
              SUM(quantity + sold) AS total_items,
              SUM(price * quantity) AS stock_value,
                SUM(BuyingPrice * quantity) AS stock_value_buying,
              SUM(quantity) AS total_available,
              SUM(sold) AS total_sold,
              (SUM(sold) * 1.0 / NULLIF(SUM(quantity), 0)) AS sale_rate, 
              (SUM(sold) / SUM(quantity + sold)) * 100 AS sale_percentage
              FROM products
              WHERE Branch = ?
                  `;

  // Rest of the code remains unchanged

  db.query(SelectQuery, [Branch], (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }

    res.json(data);
  });
};

export const getBranchSummary = (req, res) => {
  const Branch = req.params.Branch;
  const SoldBy = req.params.SoldBy;

  const SelectQuery = `
                        SELECT
                        COALESCE(CashToday, 0) AS CashToday,
                        COALESCE(MpesaToday, 0) AS MpesaToday,
                        COALESCE(total_sales, 0) AS total_sales,
                        COALESCE(total_value, 0) AS total_value,
                        COALESCE(BranchProfit, 0) AS BranchProfit
                      FROM
                        (SELECT
                          (SELECT SUM(productTotal) FROM Cash WHERE DATE(date) = CURDATE() AND SoldBy = ? AND Branch = ?) AS CashToday,
                          (SELECT SUM(productTotal) FROM Mpesa WHERE DATE(date) = CURDATE() AND SoldBy = ? AND Branch = ?) AS MpesaToday,
                          (SELECT SUM(count) FROM sold_products WHERE SoldBy = ? AND Branch = ?) AS total_sales,
                          (SELECT SUM(total) FROM sold_products WHERE SoldBy = ? AND Branch = ?) AS total_value,
                          (SELECT SUM((price * sold) - (BuyingPrice * sold)) FROM products WHERE Branch = ?) AS BranchProfit
                        ) AS CombinedResults;
  
                  `;

  db.query(
    SelectQuery,
    [SoldBy, SoldBy, SoldBy, SoldBy, Branch, Branch, Branch, Branch, Branch],
    (err, data) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }

      res.json(data);
    }
  );
};
