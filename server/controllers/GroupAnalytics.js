import { db } from "../db.js";


export const groupProductAnalytics = (req, res) => {

    const { q } = req.query; 
    const company_id = req.params.company_id;
  
    const selectQuery = `SELECT * FROM liquorlogic.products where company_id = ?`;
  
    const keys = ["name"];
  
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(q))
      );
    };
  
    db.query(selectQuery,[company_id], (err, data) => {
      if (err) {
        console.error('Error fetching available products:', err);
        return res.status(500).json({ errorMessage: 'Error fetching available products. Please try again later.' });
      }
  
      const availableProducts = q ? search(data) : data;

      // Add payment amount to each product
      const productsWithPayment = availableProducts.map((product) => ({
        ...product,
        Payment: 0,
        imageUrl: `http://${req.hostname}/Images/${product.imageFileName}`,
      }));
  
      return res.status(200).json(productsWithPayment);
    });
};


  export const singleProductCount = (req, res) => {

    const name = req.params.name;

    const amountMl = req.params.amountMl
  
    const q = `
      SELECT
        name, amountMl,
        COUNT(CASE WHEN ProductStatus = 'sold' THEN 1 ELSE NULL END) AS Sold,
        COUNT(CASE WHEN ProductStatus = 'available' THEN 1 ELSE NULL END) AS Available,
        COUNT(CASE WHEN ProductStatus = 'archived' THEN 1 ELSE NULL END) AS Archived,
        SUM(CASE WHEN ProductStatus IN ('sold', 'available', 'archived') THEN 1 ELSE 0 END) AS Total
      FROM
        products
      WHERE
        name = ? and amountMl = ?
      GROUP BY
        name, amountMl
    `;
  
    db.query(q, [name,amountMl], (err, data) => {
      if (err) return res.send(err);
  
      return res.status(200).json(data);
    });
  };
  
  
  
  export const singleProductPercentages = (req, res) => {

    const name = req.params.name;
    const amountMl = req.params.amountMl

    const q = `
      SELECT
      ProductStatus,amountMl,
      ROUND((COUNT(*) / total_count) * 100, 0) AS Percentage
    FROM
      products,
      (SELECT COUNT(*) AS total_count FROM products WHERE name = ? and amountMl = ?) AS counts
    WHERE
      name = ? and amountMl = ?
    GROUP BY
      ProductStatus,amountMl, total_count
    `;
  
    db.query(q, [name,amountMl, name,amountMl], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
  
      return res.status(200).json(data); 
    });
  };


  export const BarChartSummary = (req,res) =>{
    
    const q=`
    WITH MonthlyProductCounts AS (
        SELECT
            MONTHNAME(p.DateAdded) AS Month,
            COUNT(*) AS TotalProducts,
            COUNT(CASE WHEN p.ProductStatus = 'sold' THEN 1 ELSE NULL END) AS TotalSold,
            COUNT(CASE WHEN p.ProductStatus = 'available' THEN 1 ELSE NULL END) AS TotalAvailable,
            COUNT(CASE WHEN p.ProductStatus = 'archived' THEN 1 ELSE NULL END) AS TotalArchived
        FROM
            products p
        GROUP BY
            MONTHNAME(p.DateAdded)
    )
    SELECT * FROM MonthlyProductCounts
    ORDER BY MONTH(FIELD(Month, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'))
    `;
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  };


  export const BarChartSales = (req,res) =>{
    
    const q=`
    SELECT
    COALESCE(s.Date, a.Date) AS day,
    COALESCE(s.count, 0) AS sold,
    COALESCE(a.count, 0) AS available
FROM (
    SELECT DISTINCT DATE(DateAdded) AS Date FROM products
    UNION
    SELECT DISTINCT DATE(DateSold) AS Date FROM products
) AS Dates
LEFT JOIN (
    SELECT DATE(DateSold) AS Date, COUNT(*) AS count
    FROM products
    WHERE ProductStatus = 'sold'
    GROUP BY Date
) AS s ON Dates.Date = s.Date
LEFT JOIN (
    SELECT DATE(DateAdded) AS Date, COUNT(*) AS count
    FROM products
    WHERE ProductStatus = 'available'
    GROUP BY Date
) AS a ON Dates.Date = a.Date
WHERE COALESCE(s.Date, a.Date) IS NOT NULL
ORDER BY day
    `;
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  };

    export const SalesAnalysisChart = (req,res) =>{
    
    const q=`
              SELECT
              COALESCE(s.Date, a.Date) AS day,
              COALESCE(s.count, 0) AS sold,
              COALESCE(a.count, 0) AS available
          FROM (
              SELECT DISTINCT DATE(DateAdded) AS Date FROM products
              UNION
              SELECT DISTINCT DATE(DateSold) AS Date FROM products
          ) AS Dates
          LEFT JOIN (
              SELECT DATE(DateSold) AS Date, COUNT(*) AS count
              FROM products
              WHERE ProductStatus = 'sold'
              GROUP BY Date
          ) AS s ON Dates.Date = s.Date
          LEFT JOIN (
              SELECT DATE(DateAdded) AS Date, COUNT(*) AS count
              FROM products
              WHERE ProductStatus = 'available'
              GROUP BY Date
          ) AS a ON Dates.Date = a.Date
          WHERE COALESCE(s.Date, a.Date) IS NOT NULL
          ORDER BY day
            `;
          
            db.query(q, (err,data) => {
                if(err) return res.send(err);
          
                return res.status(200).json(data);
                }); 
    };


    export const SalesReport = (req, res) => {
    
      const { shift_start_time, shift_end_time, SoldBy } = req.query;
      
        const q = `
            WITH MpesaTotal AS (
              SELECT sale_id, 
                    productName, 
                    COALESCE(price, 0) AS price, 
                    count, 
                    COALESCE(SUM(productTotal), 0) AS mpesa_total
              FROM Mpesa
              WHERE date BETWEEN ? AND ?
                    AND SoldBy = ?
              GROUP BY sale_id, productName, price, count
          ),
          CashTotal AS (
              SELECT sale_id, 
                    productName, 
                    COALESCE(price, 0) AS price, 
                    count, 
                    COALESCE(SUM(productTotal), 0) AS cash_total
              FROM Cash
              WHERE date BETWEEN ? AND ?
                    AND SoldBy = ?
              GROUP BY sale_id, productName, price, count
          )
          SELECT COALESCE(M.sale_id, C.sale_id) AS sale_id,
                COALESCE(M.productName, C.productName) AS productName,
                COALESCE(M.price, C.price) AS price,
                CASE WHEN M.count = C.count THEN 0 ELSE COALESCE(M.count, 0) END AS mpesa_count,
                CASE WHEN M.count = C.count THEN 0 ELSE COALESCE(C.count, 0) END AS cash_count,
                CASE WHEN M.count = C.count THEN M.count ELSE 0 END AS both_methods,
                COALESCE(M.mpesa_total, 0) AS mpesa_total,
                COALESCE(C.cash_total, 0) AS cash_total
          FROM MpesaTotal M
          LEFT JOIN CashTotal C ON M.sale_id = C.sale_id AND M.productName = C.productName
          UNION
          SELECT COALESCE(M.sale_id, C.sale_id) AS sale_id,
                COALESCE(M.productName, C.productName) AS productName,
                COALESCE(M.price, C.price) AS price,
                CASE WHEN M.count = C.count THEN 0 ELSE COALESCE(M.count, 0) END AS mpesa_count,
                CASE WHEN M.count = C.count THEN 0 ELSE COALESCE(C.count, 0) END AS cash_count,
                CASE WHEN M.count = C.count THEN M.count ELSE 0 END AS both_methods,
                COALESCE(M.mpesa_total, 0) AS mpesa_total,
                COALESCE(C.cash_total, 0) AS cash_total
          FROM MpesaTotal M
          RIGHT JOIN CashTotal C ON M.sale_id = C.sale_id AND M.productName = C.productName
          WHERE M.sale_id IS NULL
          ORDER BY sale_id, productName
        `;
      
        db.query(q, [shift_start_time, shift_end_time, SoldBy,shift_start_time, shift_end_time, SoldBy], (err, data) => {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send(err); // Handle the error properly
          }
      
          return res.status(200).json(data);
        });
      };
    

    export const SalesReportCash = (req, res) => {
    
    const { shift_start_time, shift_end_time, SoldBy } = req.query;
    
      const q = `
        SELECT * FROM Cash
        WHERE date between ? AND ? AND SoldBy = ?
      `;
    
      db.query(q, [shift_start_time, shift_end_time, SoldBy], (err, data) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send(err); // Handle the error properly
        }
    
        return res.status(200).json(data);
      });
    };

    export const PeroductSaleCount = (req, res) => {
          
            const { shift_start_time, shift_end_time, SoldBy } = req.query;
            
              const q = `
              SELECT 
              product_id,
              productName, 
              SUM(totalsold) as total_sold,
              price
          FROM (
              SELECT 
                  product_id,
                  productName, 
                  SUM(count) as totalsold ,
                  price
              FROM 
                  Mpesa 
              WHERE 
                  date BETWEEN ? AND ?
                  AND SoldBy = ?
              GROUP BY 
                  product_id, 
                  productName,
                  price
          
              UNION ALL
          
              SELECT 
                  product_id,
                  productName, 
                  SUM(count) as totalsold,
                  price
              FROM 
                  Cash 
              WHERE 
                  date BETWEEN ? AND ?
                  AND SoldBy = ?
              GROUP BY 
                  product_id, 
                  productName,
                  price
          ) AS combined_sales
          GROUP BY 
              product_id,
              productName,
              price
          ORDER BY 
              total_sold DESC;
  
      `;
    
      db.query(q, [shift_start_time, shift_end_time, SoldBy,shift_start_time, shift_end_time, SoldBy], (err, data) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send(err); // Handle the error properly
        }
    
        return res.status(200).json(data);
      });
    };
  

  export const getSaleTotalAnalysis = (req, res) => {
   
    const { shift_start_time, shift_end_time, SoldBy } = req.query;
    
      const q = `
        SELECT
        COALESCE((SELECT SUM(productTotal) FROM Mpesa WHERE date BETWEEN ? AND ? AND SoldBy = ?), 0) AS totalMpesaSalesToday,
        COALESCE((SELECT SUM(productTotal) FROM Cash WHERE date BETWEEN ? AND ? AND SoldBy = ?), 0) AS totalCashSalesToday,
        COALESCE((SELECT SUM(expense_amount) FROM expenses WHERE date_added BETWEEN ? AND ? AND added_by = ?), 0) AS totalExpensesToday,
        COALESCE(
          (SELECT SUM(productTotal) FROM Mpesa WHERE date BETWEEN ? AND ? AND SoldBy = ?), 0
          ) +
          COALESCE(
              (SELECT SUM(productTotal) FROM Cash WHERE date BETWEEN ? AND ? AND SoldBy = ?), 0
          ) AS grandTotalSales,
          COALESCE(
              (SELECT SUM(productTotal) FROM Mpesa WHERE date BETWEEN ? AND ? AND SoldBy = ?), 0
          ) +
          COALESCE(
              (SELECT SUM(productTotal) FROM Cash WHERE date BETWEEN ? AND ? AND SoldBy = ?), 0
          ) -
          COALESCE(
              (SELECT SUM(expense_amount) FROM expenses WHERE date_added BETWEEN ? AND ? AND added_by = ?), 0
          ) AS netTotalSales    
      `;
    
      db.query(q, 
              [shift_start_time, shift_end_time, SoldBy,
              shift_start_time, shift_end_time, SoldBy
              ,shift_start_time, shift_end_time, SoldBy
              ,shift_start_time, shift_end_time, SoldBy
              ,shift_start_time, shift_end_time, SoldBy
              ,shift_start_time, shift_end_time, SoldBy
              ,shift_start_time, shift_end_time, SoldBy
              ,shift_start_time, shift_end_time, SoldBy
            ], (err, data) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send(err); // Handle the error properly
        }
    
        return res.status(200).json(data);
      });
    };

    

export const stockShow = (req,res) =>{
    
  const q=`
    SELECT
    (SELECT COUNT(*) FROM products) AS totalProducts,
    (SELECT COUNT(*) FROM products WHERE ProductStatus = 'available') AS availableProducts,
    (SELECT COUNT(*) FROM products WHERE ProductStatus = 'sold') AS soldProducts,
    (SELECT SUM(BuyingPrice) FROM products) AS stockvalue,
    (SELECT SUM(price - BuyingPrice) FROM products) AS profitestimate;
  `;

  db.query(q, (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
};


export const DailySales = (req,res) =>{
    const company_id = req.params.company_id
  const q=`
        SELECT
        Branch,
        DATE(date) AS day,
        SUM(total) AS total_for_day
      FROM (
        SELECT Branch, date, total FROM Mpesa
        WHERE MONTH(date) = MONTH(CURRENT_DATE()) AND company_id = ?
        UNION ALL
        SELECT Branch, date, total FROM Cash
        WHERE MONTH(date) = MONTH(CURRENT_DATE()) AND company_id = ?
      ) AS combined_data
      GROUP BY Branch, day
      ORDER BY day, Branch
  `;

  db.query(q,[company_id,company_id], (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
};

export const DailyStockAdditions = (req,res) =>{
    const company_id = req.params.company_id
    const q=`
        select Branch, DATE(date_added) as day, sum(AddedQuantity * BuyingPrice) as purchase_value, 
        sum(AddedQuantity * price) as sale_value from stock_addition_flow where company_id = ? GROUP BY Branch, day
        ORDER BY day, Branch
    `;

  db.query(q,[company_id], (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
};

export const DailyExpenses = (req,res) =>{
    
  const q=`
      select DATE(date_added) as day, sum(expense_amount) as amount,Branch from expenses where month(date_added) = month(current_date()) group by day,Branch order by day;
  `;

  db.query(q, (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
};
