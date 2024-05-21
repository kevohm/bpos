import { db } from "../../db.js";


export const GetAllShops = (req,res) =>{
  const q="SELECT * FROM Branches";

  db.query(q, (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
} 

export const GetShops = (req,res) =>{
  
    const business_id = req.params.business_id
    const q="SELECT * FROM NewBranches where business_id = ?";
  
    db.query(q,[business_id], (err,data) => {
        if(err) return res.send(err);
  
        return res.status(200).json(data);
        }); 
  } 

  export const updateShops = (req, res) => {
    const {
        branch_id,name, location, operations_description
    } = req.body;
    const sqlUpdate =
      "UPDATE NewBranches SET name = ?, location = ?, operations_description = ? WHERE id = ?";
    db.query(
      sqlUpdate,
      [name, location, operations_description, branch_id],
      (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          res.status(500).send("Error updating user");
          return;
        }
        res.send(result);
      }
    );
  };

  export const getPaymentMethods = (req, res) => {
    const branch_id = req.params.branch_id
    const q="SELECT * FROM PaymentMethods where branch_id = ? and payment_method = 'Mpesa' ";

    db.query(q, [branch_id], (err, result) => {
        if (err) {
          console.error("Error getting payment methods:", err);
          res.status(500).send("Error getting payment methods");
          return;
        }
        res.send(result);
      }
    );
  };


  export const updatePaymentMethods = (req, res) => {
    const {
        method_id, paybill_number, account_number,till_number,Branch
    } = req.body;
    const sqlUpdate =
      "UPDATE PaymentMethods SET paybill_number = ?, account_number = ?, till_number = ?, Branch = ? WHERE id = ?";
    db.query(
      sqlUpdate,
      [paybill_number, account_number, till_number, Branch, method_id],
      (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          res.status(500).send("Error updating user");
          return;
        }
        res.send(result);
      }
    );
  };
