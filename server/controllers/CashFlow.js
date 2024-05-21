import { db } from "../db.js";

{/* Cash from Products */}
export const CashAnalysis = (req,res) =>{
    
    const q=`
    SELECT
    (SELECT SUM(Payment) FROM products) AS payment,
    (SELECT SUM(price) FROM products) AS Stock_Value,
    (SELECT SUM(mpesa) FROM MpesaPayments) AS MpesaCash,
    (SELECT SUM(cash) FROM CashPayments) AS RawCash,
    (SELECT SUM(card) FROM CardPayments) AS CardPayment
    `;

    db.query(q, (err,data) => {
        if(err) return res.send(err);

        return res.status(200).json(data);
        }); 
} 

{/* EXPENSES */}

export const Expenses = (req,res) =>{
    
    const q=`
            select 
                COALESCE(sum(wages),0) as wages,COALESCE(sum(debts),0) as debts,
                COALESCE(sum(tokens),0) as tokens,COALESCE(sum(rent),0) as rent 
            from expenses
    `;

    db.query(q, (err,data) => { 
        if(err) return res.send(err);

        return res.status(200).json(data);
        }); 
} 