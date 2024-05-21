import { db } from "../db.js";

export const GetSales = (req,res) =>{
    
    const q="SELECT sum(Mpesa) as MpesaTotals,sum(Cash) as CashTotals,sum(Card) as CardTotals, sum(Payment) as TotalSales from products";
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  }

  export const StockReport = (req,res) =>{
    
    const q="SELECT Count(id) as TotalStock, COUNT(CASE WHEN ProductStatus = 'sold' THEN 1 END) AS SoldStock, COUNT(CASE WHEN ProductStatus = 'available' THEN 1 END) AS AvailableStock FROM products WHERE ProductStatus IN ('sold', 'available')";
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  }

  export const StockAnalysis = (req,res) =>{
    
    const q="SELECT TotalStock.count_stock,TotalSold.total_sold,Available.count_available, Soldtoday.count_sold,TotalMoney.TotalMoneyPaid FROM (SELECT count(*) as count_stock from products) as TotalStock JOIN (SELECT count(*) as total_sold from products where ProductStatus = 'sold') as TotalSold JOIN (SELECT COUNT(*) AS count_available FROM products WHERE ProductStatus = 'available') AS Available JOIN (SELECT COUNT(*) AS count_sold FROM products WHERE DateSold = CURDATE() AND ProductStatus = 'sold') AS Soldtoday JOIN(SELECT sum(Payment) as TotalMoneyPaid from products) AS TotalMoney";
  
    db.query(q, (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  }