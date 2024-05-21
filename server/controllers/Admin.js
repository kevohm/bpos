import { db } from "../db.js";
import { format } from 'date-fns';
 
const generateUniqueCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueCode = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueCode += characters.charAt(randomIndex);
  }

  return uniqueCode;
}; 

export const getStockInformation = (req, res) => {

    const company_id = req.params.company_id;
    const SelectQuery = `
                         select sum(price * quantity) as currentStockValue, sum(price * sold) as soldStockValue from products where company_id = ?
                        `;
    db.query(SelectQuery, [company_id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
      res.json(data);
    });
  }; 

  export const PostCashFlow = (req, res) => {
    const { selectedDate,name, cashIn, cashOut, added_by } = req.body;
    
    const uniqueCode = generateUniqueCode();

    const sql = 'INSERT INTO financial_events (event_date, name, cashIn, cashOut, added_by,finance_code) VALUES (?, ?, ?, ?,?,?)';
  
    db.query(sql, [selectedDate, name, cashIn, cashOut, added_by,uniqueCode], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        return;
      }
  
      res.status(200).json({ success: true });
    });
  };

  export const getCashFlow = (req, res) => {
    const { q } = req.query;
    const selectQuery = 'SELECT * FROM financial_events';
  
    const search = (data) => {
      const keys = ['finance_code', 'name'];
      const regex = new RegExp(q, 'i');
  
      return data.filter((item) => {
        for (const key of keys) {
          if (item[key] && regex.test(item[key])) {
            return true;
          }
        }
        return false;
      });
    };
  
    const queryPromise = new Promise((resolve, reject) => {
      db.query(selectQuery, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  
    queryPromise
      .then((data) => {
        return q ? res.status(200).json(search(data)) : res.json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      });
  };

  export const BranchProfit = (req,res) =>{
    const Branch = req.params.Branch;
    const q=`
              SELECT 
                SUM(profit) AS daysProfit,
                  Day
                  FROM (
                      SELECT 
                          (SUM(count * price) - SUM(count * CAST(BuyingPrice AS DECIMAL(10, 2)))) AS profit,
                          DATE(date) AS Day
                      FROM 
                          liquorlogic.Mpesa
                      WHERE 
                          DATE(date) = CURDATE() 
                          AND Branch = ?  
                      GROUP BY 
                          Day

                      UNION ALL

                      SELECT 
                          (SUM(count * price) - SUM(count * CAST(BuyingPrice AS DECIMAL(10, 2)))) AS profit,
                          DATE(date) AS Day
                      FROM 
                          liquorlogic.Cash
                      WHERE 
                          DATE(date) = CURDATE() 
                          AND Branch = ?
                      GROUP BY 
                          Day
                  ) AS CombinedProfits

                GROUP BY 
              Day;

    `;
  
    db.query(q,[Branch,Branch], (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        });  
  } 

  export const BranchSales = (req,res) =>{
    const Branch = req.params.Branch;
    const q=`
    SELECT
    COALESCE((SELECT SUM(price * count) FROM Cash WHERE DATE(date) = CURRENT_DATE AND Branch = ?), 0) +
    COALESCE((SELECT SUM(price * count) FROM Mpesa WHERE DATE(date) = CURRENT_DATE AND Branch = ?), 0) AS TodaySales,
    COALESCE((SELECT SUM(AddedQuantity * BuyingPrice) FROM stock_addition_flow WHERE DATE(date_added) = CURDATE() AND Branch = ?), 0) AS stock_in,
    COALESCE((SELECT SUM((expense_amount) + (stockAmount)) FROM expenses WHERE DATE(date_added) = CURRENT_DATE AND Branch = ?), 0) AS TodayExpenses;

    `;
  
    db.query(q,[Branch,Branch,Branch,Branch], (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 

  export const BranchCashContribution = (req,res) =>{
    const Branch = req.params.Branch;
    const q=`
          SELECT
          COALESCE(SUM(mpesa_amount), 0) + COALESCE(SUM(cash_amount), 0) - COALESCE(SUM(total_expenses), 0) as cash_at_hand,
          monthname(current_date()) as month
        FROM
        ( 
          SELECT
            SUM(count * price) as mpesa_amount,
            '' as cash_amount,
            '' as total_expenses,
            monthname(current_date()) as month
          FROM
            Mpesa
          WHERE
            month(date) = month(current_date())
            AND Branch = ?
            
          UNION ALL
          
          SELECT
            '' as mpesa_amount,
            SUM(count * price) as cash_amount,
            '' as total_expenses,
            monthname(current_date()) as month
          FROM
            Cash
          WHERE
            month(date) = month(current_date())
            AND Branch = ? 
            
          UNION ALL
          
          SELECT
            '' as mpesa_amount,
            '' as cash_amount,
            SUM(expense_amount + stockAmount) as total_expenses,
            monthname(current_date()) as month
          FROM
            expenses
          WHERE
            month(date_added) = month(current_date())
            AND Branch = ? 
        ) AS combined_data;
  
    `;
  
    db.query(q,[Branch,Branch,Branch], (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 

  export const getBranchStockInformation = (req, res) => {
    const Branch = req.params.Branch;
    const SelectQuery = `
                        select sum(price * quantity) as currentStockValue, sum(price * sold) as soldStockValue from products where Branch = ?;
                        `;
  
    db.query(SelectQuery, [Branch], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
  
      res.json(data);
    });
  };

  export const getDailySalesReport = (req, res) => {

    const { q } = req.query;
    const company_id = req.params.company_id;
    const SelectQuery = `
          SELECT 
          s.Branch, 
          s.SaleDate, 
          s.SoldBy,
          COALESCE(SUM(CASE WHEN s.Source = 'Cash' THEN s.total ELSE 0 END), 0) AS CashTotal,
          COALESCE(SUM(CASE WHEN s.Source = 'Mpesa' THEN s.total ELSE 0 END), 0) AS MpesaTotal,
          COALESCE(SUM(CASE WHEN s.Source = 'Cash' THEN s.total ELSE 0 END), 0) + COALESCE(SUM(CASE WHEN s.Source = 'Mpesa' THEN s.total ELSE 0 END), 0) AS total_sales,
          COALESCE(e.expense_amount, 0) AS expense,
          COALESCE(SUM(CASE WHEN s.Source = 'Cash' THEN s.total ELSE 0 END), 0) + COALESCE(SUM(CASE WHEN s.Source = 'Mpesa' THEN s.total ELSE 0 END), 0) - COALESCE(e.expense_amount, 0) AS net_sales,
          COALESCE(SUM(CASE WHEN s.Source = 'Cash' THEN s.BuyingPrice * s.count ELSE 0 END), 0) + COALESCE(SUM(CASE WHEN s.Source = 'Mpesa' THEN s.BuyingPrice * s.count ELSE 0 END), 0) AS CostOfGoodsSold
          FROM (
              SELECT 
                  SUM(total) AS total, 
                  Branch, 
                  DATE(date) AS SaleDate, 
                  SoldBy,
                  'Cash' AS Source,
                  BuyingPrice,
                  count
              FROM Cash 
              WHERE company_id = ?
              GROUP BY Branch, SoldBy, DATE(date), BuyingPrice, count
              UNION ALL
              SELECT 
                  SUM(total) AS total, 
                  Branch, 
                  DATE(date) AS SaleDate, 
                  SoldBy,
                  'Mpesa' AS Source,
                  BuyingPrice,
                  count
              FROM Mpesa 
              WHERE company_id = ?
              GROUP BY Branch, SoldBy, DATE(date), BuyingPrice, count
            ) AS s
            LEFT JOIN (
                SELECT 
                    SUM(expense_amount) AS expense_amount,
                    added_by,
                    Branch,
                    DATE(date_added) AS expense_date 
                FROM expenses 
                where company_id = ?
                GROUP BY Branch, added_by, expense_date 
            ) AS e ON s.Branch = e.Branch AND s.SoldBy = e.added_by AND s.SaleDate = e.expense_date
            GROUP BY s.Branch, s.SaleDate, s.SoldBy, e.expense_amount
            ORDER BY s.SaleDate DESC;

                 `;

      const search = (data) => {
        const keys = ['Branch','SoldBy'];
        const regex = new RegExp(q, 'i');
    
        return data.filter((item) => {
          for (const key of keys) {
            if (item[key] && regex.test(item[key])) {
              return true;
            }
          } 
          return false;
        });
      };
      db.query(SelectQuery,[company_id,company_id,company_id], (err, data) => {
        if (err) return res.send(err);
        return q ? res.status(200).json(search(data)) : res.json(data);
      });
  };

  export const getStockAddedReceipt = (req, res) => {
    const Branch = req.params.Branch;
    const SelectQuery = `
                          SELECT name,
                          BuyingPrice,
                          AddedQuantity,
                          BuyingPrice * AddedQuantity AS total_price,
                          added_by,
                          Branch,
                          date_added,
                          Supplier
                          FROM stock_addition_flow
                          where 
                          date(date_added) = current_date()
                          AND Branch = ?
                          ORDER BY date_added desc
                        `;
   
    db.query(SelectQuery, [Branch], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
  
      res.json(data);
    });
  };

  export const transferStock = (req, res) => {
    const Branch = req.body.Branch;
    const FromBranch = Branch;
    const ToBranch = req.body.ToBranch;
    const transferQuantity = req.body.transferQuantity;
    const name = req.body.name;
    const amountMl = req.body.amountMl;

    // Start the transaction 
    db.beginTransaction(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        const updateQuery = `
            UPDATE products
            SET quantity = 
                CASE
                    WHEN TRIM(name) = ? AND amountMl = ? AND Branch = ? THEN quantity - ?
                    WHEN TRIM(name) = ? AND amountMl = ? AND Branch = ? THEN quantity + ?
                    ELSE quantity
                END
            WHERE TRIM(name) IN (?, ?) AND amountMl = ? AND Branch IN (?, ?) AND id > 0;
        `;

        db.query(updateQuery, [name, amountMl, FromBranch, transferQuantity, name, amountMl, ToBranch, transferQuantity, name, name, amountMl, FromBranch, ToBranch], (err, data) => {
            if (err) {
                console.error(err);
                db.rollback(() => {
                    return res.status(500).json({ success: false, error: 'Internal Server Error' });
                });
            }

            db.commit(err => {
                if (err) {
                    console.error(err);
                    db.rollback(() => {
                        return res.status(500).json({ success: false, error: 'Internal Server Error' });
                    });
                }
                res.json({ success: true, message: 'Stock transfer successful' });
            });
        });
    });
};


// order management
  
 export const PostOrder = (req, res) => {
    const { order_personnel, Branch, product, 
            physical_count, order_count,BuyingPrice, 
            Total_Amount,Admin_response, 
            company_id,productId,quantity,amountMl,sender_name,sold,order_serial } = req.body;

    const order_status = 'Pending'

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 3);
    const order_date = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
    const sql = `
                  INSERT INTO orders 
                  (order_personnel, Branch, product, physical_count, order_count,
                      BuyingPrice, Total_Amount, order_status,Admin_response, 
                      company_id, order_serial,product_id,quantity,amountMl,
                      sender_name,order_date,soldCount) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)
                `
  
    db.query(sql, [order_personnel, Branch, product, physical_count, order_count,
                    BuyingPrice, Total_Amount, order_status,
                    Admin_response, company_id,order_serial,productId,quantity,amountMl,sender_name,order_date,sold
                  ], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        return;
      }
  
      res.status(200).json({ success: true });
    });
  };


  export const getOrders = (req, res) => {
    const company_id = req.params.company_id
    const { q } = req.query;
    const selectQuery = `
    SELECT 
    order_serial,
    MAX(Branch) AS Branch,
    MAX(sender_name) AS sender_name,
    MAX(order_date) AS order_date,
    SUM(total_amount) AS total_amount
    FROM  orders where company_id = ? GROUP BY order_serial order by order_date desc
    `;
  
    const search = (data) => {
      const keys = ['order_serial'];
      const regex = new RegExp(q, 'i');
  
      return data.filter((item) => {
        for (const key of keys) {
          if (item[key] && regex.test(item[key])) {
            return true;
          }
        }
        return false;
      });
    };
  
    const queryPromise = new Promise((resolve, reject) => {
      db.query(selectQuery,[company_id], (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  
    queryPromise
      .then((data) => {
        return q ? res.status(200).json(search(data)) : res.json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      });
  };

  export const getBranchOrders = (req, res) => {
    const Branch = req.params.Branch;
    const SelectQuery = `
          SELECT 
          order_serial,
          MAX(Branch) AS Branch,
          MAX(sender_name) AS sender_name,
          MAX(order_date) AS order_date,
          SUM(total_amount) AS total_amount
          FROM orders where Branch = ? GROUP BY order_serial order by order_date desc
        `;
   
    db.query(SelectQuery, [Branch], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
  
      res.json(data);
    });
  };

 
  
  export const AdminResponses = (req, res) => {
    const order_id = req.params.order_id;
    const order_status = req.body.order_status;
    const Admin_response = req.body.Admin_response;
    const delivery_status = req.body.delivery_status;
    const to_buy = req.body.to_buy;

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 3);
    const dispatch_time = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
  
    const sqlUpdate =
      "UPDATE products SET order_status = ?,Admin_response = ?,delivery_status = ?,to_buy = ?,dispatch_time = ? WHERE order_id = ?";
    
    db.query(
      sqlUpdate,
      [order_status,Admin_response,delivery_status,to_buy,dispatch_time,order_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.send(result);
        }
      }
    );
  };
  

  export const UserResponses = (req, res) => {
    const order_id = req.params.order_id;
    const user_response = req.body.user_response;
    const user_deliver_status = req.body.user_deliver_status;

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 3);
    const arrival_time = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
  
    const sqlUpdate =
      "UPDATE products SET user_response = ?,user_deliver_status = ?,arrival_time = ? WHERE order_id = ?";
    
    db.query(
      sqlUpdate,
      [user_response,user_deliver_status,arrival_time,order_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.send(result);
        }
      }
    );
  };
  







