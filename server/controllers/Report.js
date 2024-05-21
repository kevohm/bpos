import { db } from "../db.js";
 

export const GenerateReport = (req,res) =>{
    
    const { DateSold, Branch,ProductStatus } = req.query; 

    const query = `SELECT count(id) as stock,sum(Balance) as balance,sum(Mpesa) as MpesaTotals,sum(Cash) as CashTotals,sum(Card) as CardTotals, sum(Payment) as TotalSales,Branch FROM products WHERE DateSold= '${DateSold}' AND Branch= '${Branch}' AND ProductStatus = '${ProductStatus}'`;

    db.query(query, [DateSold, Branch,ProductStatus], (error, results) => {
        if (error) {
          console.error('Error executing database query: ', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json(results);
        }
      });
} 

export const SalesTables = (req,res) =>{
    
  const { DateSold, Branch } = req.query; 

  const query = `select * from products WHERE payment > 0 AND DateSold= '${DateSold}' AND Branch= '${Branch}'`;

  db.query(query, [DateSold, Branch], (error, results) => {
      if (error) {
        console.error('Error executing database query: ', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });

}

export const Stock = (req,res) =>{
    
  const { ProductStatus } = req.query; 

  const query = `SELECT name,amountMl, COUNT(*) AS totalProducts, Branch FROM products where ProductStatus = '${ProductStatus}' GROUP BY name, Branch,amountMl`;
  

  db.query(query, [ProductStatus], (error, results) => {
      if (error) {
        console.error('Error executing database query: ', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });

}

export const IndividualSales = (req,res) =>{
    
  const { SoldBy } = req.query; 

  const query = `SELECT * FROM products where SoldBy = '${SoldBy}'`;
  

  db.query(query, [SoldBy], (error, results) => {
      if (error) {
        console.error('Error executing database query: ', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });

}

export const StockAdditionReport = (req, res) => {
  const { FromDate, ToDate } = req.query;

  // Use parameterized query to prevent SQL injection
  const query = 'SELECT * FROM stock_addition_flow WHERE date(date_added) BETWEEN ? AND ? ORDER BY date(date_added) DESC';

  db.query(query, [FromDate, ToDate], (error, results) => {
    if (error) {
      console.error('Error executing database query: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};

export const StockAdditionBranchReport = (req, res) => {
  const { FromDate, ToDate, Branch } = req.query;

  const query = 'SELECT * FROM stock_addition_flow WHERE date(date_added) BETWEEN ? AND ? AND Branch = ? ORDER BY date(date_added) DESC';

  db.query(query, [FromDate, ToDate, Branch], (error, results) => {
    if (error) {
      console.error('Error executing database query: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};

export const SalesReportFlow = (req, res) => {
  const { FromDate, ToDate } = req.query;

  const query = `
          SELECT *
          FROM (
              SELECT
                  id,
                  'Mpesa' AS source,
                  productName,
                  count,
                  price,
                  total,
                  date,
                  Branch,
                  SoldBy,
                  BuyingPrice,
                  sale_id
              FROM Mpesa
              UNION
              SELECT
                  id,
                  'Cash' AS source,
                  productName,
                  count,
                  price,
                  total,
                  date,
                  Branch,
                  SoldBy,
                  BuyingPrice,
                  sale_id
              FROM Cash
          ) AS combined_data
          WHERE date(date) BETWEEN ? AND ?
          ORDER BY date DESC
        `;

  db.query(query, [FromDate, ToDate], (error, results) => {
    if (error) {
      console.error('Error executing database query: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};

export const SalesReportBranchFlow = (req, res) => {
  const { FromDate, ToDate, Branch } = req.query;

  const query = `
          SELECT *
          FROM (
              SELECT
                  id,
                  'Mpesa' AS source,
                  productName,
                  count,
                  price,
                  total,
                  date,
                  Branch,
                  SoldBy,
                  BuyingPrice,
                  sale_id
              FROM Mpesa
              UNION
              SELECT
                  id,
                  'Cash' AS source,
                  productName,
                  count,
                  price,
                  total,
                  date,
                  Branch,
                  SoldBy,
                  BuyingPrice,
                  sale_id
              FROM Cash
          ) AS combined_data
          WHERE date(date) BETWEEN ? AND ? AND Branch = ?
          ORDER BY date DESC
        `;

  db.query(query, [FromDate, ToDate, Branch], (error, results) => {
    if (error) {
      console.error('Error executing database query: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};

export const BranchSalesTable = (req, res) => {
  const { Branch } = req.query;

  const query = `
          SELECT *
          FROM (
              SELECT
                  id,
                  'Mpesa' AS source,
                  productName,
                  count,
                  price,
                  total,
                  date,
                  Branch,
                  SoldBy,
                  BuyingPrice,
                  sale_id
              FROM Mpesa
              UNION
              SELECT
                  id,
                  'Cash' AS source,
                  productName,
                  count,
                  price,
                  total,
                  date,
                  Branch,
                  SoldBy,
                  BuyingPrice,
                  sale_id
              FROM Cash
          ) AS combined_data
          WHERE Branch = ?
          ORDER BY date DESC
        `;

  db.query(query, [ Branch ], (error, results) => {
    if (error) {
      console.error('Error executing database query: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};


export const KegSales = (req, res) => {

  const { FromDate, ToDate, Branch } = req.query;
  const query = `
              SELECT * 
              FROM (
                  SELECT * 
                  FROM Cash 
                  UNION 
                  SELECT * 
                  FROM Mpesa
              ) AS combined_data
              WHERE date(date) BETWEEN ? AND ? 
                AND Branch = ? 
                AND ProductStatus IN ('Large', 'Small')
             `;

  db.query(query, [FromDate, ToDate, Branch], (error, results) => {
    if (error) {
      console.error('Error executing database query: ', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};