import { db } from "../db.js";


export const ProductAnalytica = (req,res) =>{
    
    const q=`
    SELECT
    COALESCE(added.Month, sold.Month, available.Month) AS Date,
    COALESCE(added.addedOn, 0) AS TotalAdded,
    COALESCE(sold.soldOn, 0) AS TotalSold,
    COALESCE(available.AvailableOn, 0) AS TotalAvailable
  FROM
    (
      SELECT MONTHNAME(DateAdded) AS Month,  COUNT(id) AS addedOn
      FROM  products
      GROUP BY  MONTHNAME(DateAdded)
    ) AS added
  LEFT JOIN
    (
      SELECT MONTHNAME(DateSold) AS Month, COUNT(id) AS soldOn
      FROM products
      WHERE  ProductStatus = 'Sold'
      GROUP BY MONTHNAME(DateSold)
    ) AS sold ON added.Month = sold.Month LEFT JOIN
    (
      SELECT MONTHNAME(DateAdded) AS Month, COUNT(id) AS AvailableOn
      FROM products
      WHERE  ProductStatus = 'Available'
      GROUP BY MONTHNAME(DateAdded)
    ) AS available ON added.Month = available.Month
  ORDER BY COALESCE(added.Month, sold.Month, available.Month) DESC;
    `;

    db.query(q, (err,data) => {
        if(err) return res.send(err);

        return res.status(200).json(data);
        }); 
} 
 
export const GetCategories = (req,res) =>{
    
    const q="SELECT * FROM categories";
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  }  
 
  export const GetBranches = (req,res) =>{
    const company_id = req.params.company_id
    const q="SELECT * FROM Branches where company_id = ?";
  
    db.query(q,[company_id], (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 

  export const BranchPerformance = (req,res) =>{
    
    const q=`
    SELECT 
    s.Branch,
    COALESCE(s.TotalSold, 0) AS TotalSold,
    COALESCE(a.TotalAvailable, 0) AS TotalAvailable
FROM
    (SELECT Branch, COUNT(id) AS TotalSold
    FROM products
    WHERE ProductStatus = 'sold'
    GROUP BY Branch) AS s
LEFT JOIN
    (SELECT Branch, COUNT(id) AS TotalAvailable
    FROM products
    WHERE ProductStatus = 'available'
    GROUP BY Branch) AS a
ON s.Branch = a.Branch
    `;
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 

  export const MoneyPerformance = (req,res) =>{
    
    const q=`
    SELECT Day, SUM(Mpesa) AS Mpesa, SUM(Cash) AS Cash, SUM(Card) AS Card
    FROM (
        SELECT DAYNAME(actionDate) as Day, SUM(mpesa) as Mpesa, NULL AS Cash, NULL AS Card
        FROM MpesaPayments
        GROUP BY DAYNAME(actionDate)
    
        UNION ALL
    
        SELECT DAYNAME(actionDate) as Day, NULL AS Mpesa, SUM(cash) as Cash, NULL AS Card
        FROM CashPayments
        GROUP BY DAYNAME(actionDate)
    
        UNION ALL
    
        SELECT DAYNAME(actionDate) as Day, NULL AS Mpesa, NULL AS Cash, SUM(card) as Card
        FROM CardPayments
        GROUP BY DAYNAME(actionDate)
    ) AS subquery
    GROUP BY Day
    ORDER BY Day DESC
    `;
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 

  export const StockComparison = (req,res) =>{
    
    const q=`
      SELECT
      ProductStatus,
      ROUND((COUNT(*) / (SELECT COUNT(*) FROM products)) * 100,0) AS Percentage
      FROM products
      GROUP BY ProductStatus
    `;
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 

  export const StockPerformance = (req,res) =>{
    
    const q=`
          SELECT best.name AS BestSoldProduct, best.SoldCount AS BestSoldCount,
          least.name AS LeastSoldProduct, least.SoldCount AS LeastSoldCount,
          best_branch.Branch AS BestPerformingBranch, best_branch.BranchSoldCount AS BestBranchSoldCount,
          least_branch.Branch AS LeastPerformingBranch, least_branch.BranchSoldCount AS LeastBranchSoldCount
      FROM
      (
      SELECT name, COUNT(*) AS SoldCount
      FROM products
      WHERE ProductStatus = 'Sold'
      GROUP BY name
      ORDER BY SoldCount DESC
      LIMIT 1
      ) AS best
      JOIN
      (
      SELECT name, COUNT(*) AS SoldCount
      FROM products
      WHERE ProductStatus = 'Sold'
      GROUP BY name
      ORDER BY SoldCount ASC
      LIMIT 1
      ) AS least
      ON 1=1
      JOIN
      (
      SELECT Branch AS Branch, COUNT(*) AS BranchSoldCount
      FROM products
      WHERE ProductStatus = 'Sold'
      GROUP BY branch
      ORDER BY BranchSoldCount DESC
      LIMIT 1
      ) AS best_branch
      ON 1=1
      JOIN 
      (
      SELECT Branch AS Branch, COUNT(*) AS BranchSoldCount
      FROM products
      WHERE ProductStatus = 'Sold'
      GROUP BY branch
      ORDER BY BranchSoldCount ASC
      LIMIT 1
      ) AS least_branch
      ON 1=1;
    `;
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 


  export const CompanyProfit = (req,res) =>{
    const company_id = req.params.company_id;
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
                AND company_id = ?
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
                AND company_id = ?
            GROUP BY 
                Day
        ) AS CombinedProfits
        GROUP BY 
            Day
    `;
  
    db.query(q,[company_id,company_id], (err,data) => {
        if(err) return res.send(err);
        return res.status(200).json(data);
        });  
  } 

  export const SalesShow = (req,res) =>{
    const company_id = req.params.company_id;
    const q=`
    SELECT
    COALESCE((SELECT SUM(price * count) FROM Cash WHERE DATE(date) = CURRENT_DATE AND company_id = ?), 0) +
    COALESCE((SELECT SUM(price * count) FROM Mpesa WHERE DATE(date) = CURRENT_DATE AND company_id = ?), 0) AS TodaySales,
    COALESCE((SELECT SUM(AddedQuantity * BuyingPrice) FROM stock_addition_flow WHERE DATE(date_added) = CURDATE() AND company_id = ?), 0) AS stock_in,
    COALESCE((SELECT SUM((expense_amount) + (stockAmount)) FROM expenses WHERE DATE(date_added) = CURRENT_DATE AND company_id = ?), 0) AS TodayExpenses;

    `;
  
    db.query(q,[company_id,company_id,company_id,company_id], (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 

  export const CashAtHand = (req,res) =>{
    const company_id = req.params.company_id;
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
                  AND company_id = ?
              
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
                  AND company_id = ?
              
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
                  AND company_id = ?
          ) AS combined_data
    `;
  
    db.query(q,[company_id,company_id,company_id], (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 






















  

 

  export const MpesaSales = (req, res) => {
    const { q } = req.query;
  
    const SelectQuery = `SELECT * FROM MpesaPayments order by id DESC`;
  
    const search = (data) => {
      const keys = ['MpesaCode', 'paymentCode'];
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
  
    db.query(SelectQuery, (err, data) => {
      if (err) return res.send(err);
      return q ? res.status(200).json(search(data)) : res.json(data);
    });
  };
  

export const CashSales = (req, res) => {
  const { q } = req.query;

  const SelectQuery = `SELECT * FROM CashPayments order by id DESC`;

  const search = (data) => {
    const keys = ['MpesaCode', 'paymentCode'];
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

  db.query(SelectQuery, (err, data) => {
    if (err) return res.send(err);
    return q ? res.status(200).json(search(data)) : res.json(data);
  });
};


export const CardSales = (req, res) => {
  const { q } = req.query;

  const SelectQuery = `SELECT * FROM CardPayments order by id DESC`;

  const search = (data) => {
    const keys = ['MpesaCode', 'paymentCode'];
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

  db.query(SelectQuery, (err, data) => {
    if (err) return res.send(err);
    return q ? res.status(200).json(search(data)) : res.json(data);
  });
};

export const MpesaAnalytics = (req,res) =>{
    
  const q="SELECT DAYNAME(actionDate) as Day, SUM(mpesa) as Mpesa from MpesaPayments group by DAYNAME(actionDate)";

  db.query(q, (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
}

export const CashAnalytics = (req,res) =>{
    
  const q="SELECT DAYNAME(actionDate) as Day, SUM(cash) as Cash from CashPayments group by DAYNAME(actionDate)";

  db.query(q, (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
}

export const CardAnalytics = (req,res) =>{
    
  const q="SELECT DAYNAME(actionDate) as Day, SUM(card) as Card from CardPayments group by DAYNAME(actionDate)";

  db.query(q, (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
}


export const BranchAnalytics = (req, res) => {
  const Branch = req.params.Branch;
  const productQuery = "SELECT * from products where Branch = ?";

  db.query(productQuery,[Branch], (err, data) => { 
    if (err) return res.status(500).json({ error: 'Database error' });

    // Modify the data to include the image URL for each product
    const productsWithImageUrls = data.map((product) => ({
      ...product,
      imageUrl: `http://${req.hostname}/Images/${product.imageFileName}`,
    }));

    return res.status(200).json(productsWithImageUrls);
  });
};


export const Attendants = (req,res) =>{
  const Branch = req.params.Branch;
  const q="select id, SUBSTRING_INDEX(fullname, ' ', 2) AS FirstName,Branch from staff where Branch = ?";

  db.query(q, [Branch], (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data); 
      }); 
}


export const BranchAmounts = (req, res) => {
  const Branch = req.params.Branch;
  const q = `
      SELECT Day, SUM(Mpesa) as Mpesa, SUM(Cash) as Cash, SUM(Card) as Card
      FROM (
          SELECT DAYNAME(actionDate) as Day, SUM(mpesa) as Mpesa, 0 as Cash, 0 as Card
          FROM MpesaPayments
          WHERE Branch = ?
          GROUP BY DAYNAME(actionDate)

          UNION ALL

          SELECT DAYNAME(actionDate) as Day, 0 as Mpesa, SUM(cash) as Cash, 0 as Card
          FROM CashPayments
          WHERE Branch = ?
          GROUP BY DAYNAME(actionDate)

          UNION ALL

          SELECT DAYNAME(actionDate) as Day, 0 as Mpesa, 0 as Cash, SUM(card) as Card
          FROM CardPayments
          WHERE Branch = ?
          GROUP BY DAYNAME(actionDate)
      ) AS combined_data
      GROUP BY Day
  `;

  db.query(q, [Branch, Branch, Branch], (err, data) => {
      if (err) return res.send(err);

      return res.status(200).json(data);
  });
};
 

export const BranchProductStatus = (req, res) => {
  const Branch = req.params.Branch;
  const q = `
  SELECT
  ProductStatus,
  ROUND((COUNT(*) / (SELECT COUNT(*) FROM products WHERE Branch = ?)) * 100, 0) AS Percentage
FROM products
WHERE Branch = ?
GROUP BY ProductStatus
  `;

  db.query(q, [Branch, Branch, Branch], (err, data) => {
      if (err) return res.send(err);

      return res.status(200).json(data);
  });
};


export const BranchMoneyDist = (req, res) => {
  const Branch = req.params.Branch;
  const q = `
  SELECT
  (SELECT SUM(mpesa) FROM MpesaPayments WHERE Branch = ?) as Mpesa,
  (SELECT SUM(cash) FROM CashPayments WHERE Branch = ?) as Cash,
  (SELECT SUM(card) FROM CardPayments WHERE Branch = ?) as Card
  `;

  db.query(q, [Branch, Branch, Branch], (err, data) => {
      if (err) return res.send(err);

      return res.status(200).json(data);
  });
};


export const attendantsShifts = (req, res) => {
  const Branch = req.params.Branch;
  const q = `
    select * from schedules where Branch = ? order by id desc
  `;

  db.query(q, [Branch], (err, data) => {
      if (err) return res.send(err);

      return res.status(200).json(data);
  });
};




export const ArchivedProducts = (req, res) => {

  const { q } = req.query;

  const Branch = req.params.Branch;

  const SelectQuery = `SELECT * FROM product_invoices where Branch = ? and invoice_status = 'archived'`;

  const search = (data) => {
    const keys = ['InvoiceCode'];
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

  db.query(SelectQuery,[Branch], (err, data) => {
    if (err) return res.send(err);
    return q ? res.status(200).json(search(data)) : res.json(data);
  });
};




export const AvailablProductsTwo = (req, res) => {
  const { q } = req.query;
  const Branch = req.params.Branch;
  const selectQuery = `SELECT * FROM products WHERE Branch = ?`;

  const keys = ["name"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    ); 
  };

  db.query(selectQuery,[Branch], (err, data) => {
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


export const ProductEdit = (req, res) => {
 
  const id = req.params.id;
  const selectQuery = `SELECT * FROM products WHERE id = ?`;

  db.query(selectQuery, [id], (err, data) => {
    if (err) {
      console.error('Error fetching available products:', err);
      return res.status(500).json({ errorMessage: 'Error fetching available products. Please try again later.' });
    }

    // You can remove the search and directly use the fetched data
    const availableProducts = data;

  
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
  const Branch = req.params.Branch;
  const amountMl = req.params.amountMl

  const q = `
    SELECT
      name, Branch, amountMl,
      sold AS Sold,
      quantity AS Available,
      COUNT(CASE WHEN ProductStatus = 'archived' THEN 1 ELSE NULL END) AS Archived,
      SUM(quantity + sold) THEN 1 ELSE 0 END) AS Total
    FROM
      products
    WHERE
      name = ? AND Branch = ? and amountMl = ?
    GROUP BY
      name, amountMl
  `;

  db.query(q, [name, Branch,amountMl], (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};



export const singleProductPercentages = (req, res) => {
  const name = req.params.name;
  const Branch = req.params.Branch;
  const amountMl = req.params.amountMl
  const q = `
    SELECT
    ProductStatus,amountMl,
    ROUND((COUNT(*) / total_count) * 100, 0) AS Percentage
  FROM
    products,
    (SELECT COUNT(*) AS total_count FROM products WHERE name = ? and Branch = ? and amountMl = ?) AS counts
  WHERE
    name = ? and Branch = ? and amountMl = ?
  GROUP BY
    ProductStatus,amountMl, total_count
  `;

  db.query(q, [name, Branch,amountMl, name, Branch,amountMl], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json(data); 
  });
};


