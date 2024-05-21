import { db } from "../db.js";



  export const AvailableForSale = (req,res) =>{

    const { q } = req.query; 

    const { Branch } = req.params;
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    const keys = ["name","serialNumber"]


    const SelectQuery = `SELECT * FROM products WHERE ProductStatus = 'available' AND Branch = ? order by id DESC`;

    const search = (data) => {
        return data.filter((item) =>
          keys.some((key) => item[key].toLowerCase().includes(q)) 
                           
        );
      };

    db.query(SelectQuery,[Branch], (err,data) => {
        if(err) return res.send(err);
        return q ? res.status(200).json(search(data)) : res.json(data.slice(0, 10));
        }); 
} 

  export const CategoryCount = (req,res) =>{
    
    const q = `
    SELECT
      category,
      COUNT(*) AS ProductsDivided,
      SUM(price) AS TotalPrice
    FROM
      products
    GROUP BY
      category
  `;
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  }

  export const ProductsByCat = (req,res) =>{
    const { category } = req.params;
 
    const q = `
            SELECT category, name, amountMl, COUNT(*) as count, AVG(price) as average_price
            FROM products
            WHERE category = ?
            GROUP BY category, name, amountMl
          `;
  
    db.query(q, [category], (err, results) => {
    if (err) {
      console.error('Error retrieving products:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });

  }