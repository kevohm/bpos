import { db } from "../db.js";
import nodemailer from "nodemailer";
import { format } from "date-fns";

export const ProductGroups = (req, res) => {
  const q = `
    SELECT name, price, category, COUNT(*) AS count,amountMl
          FROM products
          WHERE ProductStatus = 'available'
          GROUP BY name, price, category,amountMl
        ORDER BY name
  `;

  db.query(q, (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const AvailablProducts = (req, res) => {
  const { q } = req.query;

  const selectQuery = `SELECT * FROM products WHERE ProductStatus = 'available'`;

  const keys = ["name"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };

  db.query(selectQuery, (err, data) => {
    if (err) {
      console.error("Error fetching available products:", err);
      return res.status(500).json({
        errorMessage:
          "Error fetching available products. Please try again later.",
      });
    }

    const availableProducts = q ? search(data) : data;

    // Add payment amount to each product
    const productsWithPayment = availableProducts.map((product) => ({
      ...product,
      Payment: 0,
    }));

    return res.status(200).json(productsWithPayment);
  });
};

function generateRandomCode(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
}

export const sellProducts = (req, res) => {
  const { mpesa, cash, card, productsToSell } = req.body;

  // Calculate the total payment received
  const totalPayment = (mpesa || 0) + (cash || 0) + (card || 0);
  const Branch = req.body.Branch;
  const SoldBy = req.body.SoldBy;

  // Check if totalPayment is valid
  if (isNaN(totalPayment) || totalPayment <= 0) {
    return res.status(400).json({
      errorMessage: "Total payment amount must be a positive number.",
    });
  }

  // Calculate the remaining payment after selling each product
  let remainingPayment = totalPayment;

  // List to hold the products that can be sold
  const productsToBeSold = [];

  // Collect selected product names, amountMl, and serialNumbers
  let selectedProductNames = [];
  let selectedAmountMl = [];
  let selectedSerialNumbers = [];

  // Loop through the productsToSell and check if each product can be sold
  for (const product of productsToSell) {
    const { serialNumber, name, price, amountMl } = product;

    // Check if the product's price is greater than the remaining payment
    if (price <= remainingPayment) {
      // The product can be sold
      productsToBeSold.push({ serialNumber, name, price, amountMl });

      // Update the remaining payment after selling this product
      remainingPayment -= price;

      // Collect the product info for the selected products
      selectedProductNames.push(name);
      selectedAmountMl.push(amountMl);
      selectedSerialNumbers.push(serialNumber);
    } else {
      // The product's price is greater than the remaining payment
      // Reject the sale of all products and send an error message
      return res
        .status(400)
        .json({ errorMessage: "Products cannot be sold on balance." });
    }
  }

  // If productsToBeSold is empty, it means no products can be sold
  if (productsToBeSold.length === 0) {
    return res.status(400).json({ errorMessage: "No products were sold." });
  }

  // Calculate the balance after selling the products
  const Balance = totalPayment - remainingPayment;
  const actionDate = new Date().toISOString().split("T")[0];

  // Update the product's status and payment amount in the 'products' table for each sold product
  const updatePromises = productsToBeSold.map((product) => {
    return new Promise((resolve) => {
      const { serialNumber, price } = product;

      const Payment = remainingPayment >= 0 ? price : 0;

      // Update the product's status to 'sold' and the payment amount in the 'products' table
      db.query(
        `UPDATE products SET ProductStatus = 'sold', Payment = ?, DateSold = ? WHERE serialNumber = ?`,
        [Payment, actionDate, serialNumber],
        (error) => {
          if (error) {
            console.error(
              `Error updating product ${serialNumber} to "sold":`,
              error
            );
            resolve({ serialNumber, status: "failed" });
          } else {
            resolve({ serialNumber, status: "success" });
          }
        }
      );
    });
  });

  // Wait for all product updates to complete
  Promise.all(updatePromises)
    .then((results) => {
      // Check if any of the updates failed
      const isFailedUpdate = results.some(
        (result) => result.status === "failed"
      );
      const paymentCode = generateRandomCode(8);

      if (!isFailedUpdate) {
        // All products were updated successfully in the database
        if (mpesa > 0) {
          // Insert data into MpesaPayments table
          db.query(
            `INSERT INTO MpesaPayments (serialNumbers, names, amountMl, mpesa, storeNumber, Paybill, Branch, SoldBy, actionDate,paymentCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              selectedSerialNumbers.join(","),
              selectedProductNames.join(","),
              selectedAmountMl.join(","),
              mpesa,
              req.body.storeNumber,
              req.body.Paybill,
              req.body.Branch,
              req.body.SoldBy,
              actionDate,
              paymentCode,
            ],
            (error) => {
              if (error) {
                console.error(
                  `Error inserting data into MpesaPayments table:`,
                  error
                );
                return res.status(500).json({
                  errorMessage:
                    "An error occurred while inserting data into the MpesaPayments table.",
                });
              } else {
                // Return the sale result
                res.status(200).json({
                  message: "Products sold successfully.",
                  soldProducts: productsToBeSold,
                });
              }
            }
          );
        } else if (cash > 0) {
          // Insert data into CashPayments table
          db.query(
            `INSERT INTO CashPayments (serialNumbers, names, amountMl, cash, Branch, SoldBy, actionDate,paymentCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              selectedSerialNumbers.join(","),
              selectedProductNames.join(","),
              selectedAmountMl.join(","),
              cash,
              req.body.Branch,
              req.body.SoldBy,
              actionDate,
              paymentCode,
            ],
            (error) => {
              if (error) {
                console.error(
                  `Error inserting data into CashPayments table:`,
                  error
                );
                return res.status(500).json({
                  errorMessage:
                    "An error occurred while inserting data into the CashPayments table.",
                });
              } else {
                // Return the sale result
                res.status(200).json({
                  message: "Products sold successfully.",
                  soldProducts: productsToBeSold,
                });
              }
            }
          );
        } else if (card > 0) {
          // Insert data into CardPayments table
          db.query(
            `INSERT INTO CardPayments (serialNumbers, names, amountMl, card, CardNumber, cvv, address, validationTerm, Branch, SoldBy, actionDate,paymentCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            [
              selectedSerialNumbers.join(","),
              selectedProductNames.join(","),
              selectedAmountMl.join(","),
              card,
              req.body.CardNumber,
              req.body.cvv,
              req.body.address,
              req.body.validationTerm,
              req.body.Branch,
              req.body.SoldBy,
              actionDate,
              paymentCode,
            ],
            (error) => {
              if (error) {
                console.error(
                  `Error inserting data into CardPayments table:`,
                  error
                );
                return res.status(500).json({
                  errorMessage:
                    "An error occurred while inserting data into the CardPayments table.",
                });
              } else {
                // Return the sale result
                res.status(200).json({
                  message: "Products sold successfully.",
                  soldProducts: productsToBeSold,
                });
              }
            }
          );
        } else {
          // Return the sale result
          res.status(200).json({
            message: "Products sold successfully.",
            soldProducts: productsToBeSold,
          });
        }
      } else {
        // At least one product failed to update
        res.status(500).json({
          errorMessage:
            "An error occurred while updating products in the database.",
        });
      }
    })
    .catch((error) => {
      // An error occurred during product updates
      console.error("Error updating products:", error);
      res.status(500).json({
        errorMessage:
          "An error occurred while updating products in the database.",
      });
    });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sorliquor@gmail.com",
      pass: "vppwrvvzgabbftyg",
    },
  });

  const names = selectedProductNames.join(",");
  const amountMl = selectedAmountMl.join(",");

  const emailContent = `
      Hello,
      
      We would like to inform you that the following products have been sold successfully in ${Branch} branch:
      
      Products: ${names}
      Amount (ml): ${amountMl} 
      Total Payment: ${totalPayment}
      Attendant: ${SoldBy}
      
      
      Best regards,
      Sunset
      `;

  const mailOptions = {
    from: "sorliquor@gmail.com  ",
    to: [
      "samuelwanjiru69@gmail.com",
      "gachihindirangu@gmail.com",
      "jkwakuthii@gmail.com",
    ],
    subject: "Sales Notification",
    text: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const generateSaleId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let saleId = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    saleId += characters.charAt(randomIndex);
  }

  return saleId;
};

export const archiveProducts = (req, res) => {
  const {
    productsToArchive,
    ArchivedBy,
    Branch,
    customerName,
    customerMobile,
    totalPayment,
  } = req.body;

  // Validate input data
  if (!Array.isArray(productsToArchive) || productsToArchive.length === 0) {
    return res.status(400).json({ errorMessage: "No products to archive." });
  }

  // Extract the serial numbers for marking as archived
  const serialNumbers = productsToArchive.map(
    (product) => product.serialNumber
  );
  const invoiceDate = new Date().toISOString().split("T")[0];

  // Mark the selected products as archived in the 'products' table
  const updateQuery = `UPDATE products SET ProductStatus = 'archived', DateSold = ? WHERE serialNumber IN (?)`;
  db.query(updateQuery, [invoiceDate, serialNumbers], (error, results) => {
    if (error) {
      console.error("Error archiving products:", error);
      return res
        .status(500)
        .json({ errorMessage: "An error occurred while archiving products." });
    }

    if (results.affectedRows !== serialNumbers.length) {
      return res
        .status(500)
        .json({ errorMessage: "Not all products were successfully archived." });
    }

    // Extract the product names, amounts, and other information for storage
    const selectedProductNames = productsToArchive.map(
      (product) => product.name
    );
    const selectedAmountMl = productsToArchive.map(
      (product) => product.amountMl
    );
    const price = productsToArchive.map((product) => product.price);
    const paymentCode = generateRandomCode(8);
    const invoice_status = "archived";

    // Store the archived product data in the 'product_invoices' table
    const insertQuery = `INSERT INTO product_invoices (serialNumbers, names, amountMl, customerName, customerMobile, Branch, InvoicedBy, InvoiceCode, invoiceDate,price,invoice_status,totalPayment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
    db.query(
      insertQuery,
      [
        serialNumbers.join(","),
        selectedProductNames.join(","),
        selectedAmountMl.join(","),
        customerName,
        customerMobile,
        Branch,
        ArchivedBy,
        paymentCode,
        invoiceDate,
        price.join(","),
        invoice_status,
        totalPayment,
      ],
      (error) => {
        if (error) {
          console.error("Error storing product invoices:", error);
          return res.status(500).json({
            errorMessage: "An error occurred while storing product invoices.",
          });
        }

        // Successful archive and storage
        res
          .status(200)
          .json({ message: "Products archived and an stored successfully." });
      }
    );
  });
};

export const ProductSalesData = (req, res) => {
  const company_id = req.params.company_id;
  const q = `
        SELECT
        'Mpesa' AS source,
        productName,
        count,
        price,
        total,
        date,
        Branch,
        SoldBy,
        BuyingPrice,
        sale_id,
        product_id
      FROM Mpesa
      WHERE company_id = ?
      UNION
      SELECT
        'Cash' AS source,
        productName,
        count,
        price,
        total,
        date,
        Branch,
        SoldBy,
        BuyingPrice,
        sale_id,
        product_id
      FROM Cash
      WHERE company_id = ?
      ORDER BY date DESC;

`;

  db.query(q, [company_id, company_id], (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const completePayment = (req, res) => {
  const {
    cart,
    paymentMode,
    cashAmount,
    mpesaAmount,
    SoldBy,
    Branch,
    customerMobile,
    BuyingPrice,
    company_id,
  } = req.body;
  const soldProductsRecords = [];
  const paymentRecords = {
    cash: [],
    mpesa: [],
  };

  const calculateProductTotal = (product) => {
    return product.price * product.count;
  };

  let sale_id;

  cart.forEach((product) => {
    const currentDate = new Date();

    currentDate.setHours(currentDate.getHours() + 3);

    const currentTimestamp = format(currentDate, "yyyy-MM-dd HH:mm:ss");

    sale_id = generateSaleId();

    const productPaymentRecord = {
      productId: product.id,
      productName: product.name,
      count: product.count,
      price: product.price,
      total: calculateProductTotal(product),
      date: currentTimestamp,
      SoldBy,
      Branch,
      customerMobile,
      BuyingPrice,
      sale_id,
      ProductStatus:
        product.category === "Senator Keg"
          ? product.LargeCupMl !== "0"
            ? "Large"
            : product.smallCupMl !== "0"
            ? "Small"
            : undefined
          : undefined,
      serialNumber: product.serialNumber,
      smallCupMl: product.smallCupMl,
      LargeCupMl: product.LargeCupMl,
      company_id,
    };

    soldProductsRecords.push(productPaymentRecord);

    const updateQuery = `UPDATE products
                          SET quantity = quantity - ${product.count},
                              sold = sold + ${product.count},
                              sale_activity_date = CURRENT_TIMESTAMP
                          WHERE id = ${product.id}`;

    db.query(updateQuery, (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
      }
    });

    const paymentTable =
      paymentMode === "both" ? ["cash", "mpesa"] : [paymentMode];

    paymentTable.forEach((mode) => {
      const paymentRecord = [
        product.name,
        product.count,
        product.price,
        productPaymentRecord.total,
        currentTimestamp,
        Branch,
        SoldBy,
        mode === "cash" ? cashAmount : mpesaAmount,
        product.BuyingPrice,
        sale_id,
        product.id,
        productPaymentRecord.ProductStatus,
        product.serialNumber,
        product.smallCupMl,
        product.LargeCupMl,
        company_id,
      ];

      paymentRecords[mode].push(paymentRecord);
    });
  });

  const insertQuery = `INSERT INTO sold_products (product_id, product_name, price, count, total, date, SoldBy, Branch, customerMobile, payment_mode, BuyingPrice, sale_id, ProductStatus, serialNumber, smallCupMl, LargeCupMl,company_id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  soldProductsRecords.forEach((record) => {
    const values = [
      record.productId,
      record.productName,
      record.price,
      record.count,
      record.total,
      record.date,
      record.SoldBy,
      record.Branch,
      record.customerMobile,
      paymentMode,
      record.BuyingPrice,
      sale_id,
      record.ProductStatus,
      record.serialNumber,
      record.smallCupMl,
      record.LargeCupMl,
      company_id,
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting sale record:", err);
      }
    });
  });

  const cashInsertQuery = `INSERT INTO Cash (productName, count, price, total, date, Branch, SoldBy, productTotal, BuyingPrice, sale_id, product_id, ProductStatus, serialNumber, smallCupMl, LargeCupMl,company_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

  const mpesaInsertQuery = `INSERT INTO Mpesa (productName, count, price, total, date, Branch, SoldBy, productTotal, BuyingPrice, sale_id, product_id, ProductStatus, serialNumber, smallCupMl, LargeCupMl,company_id)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  paymentRecords.cash.forEach((record) => {
    db.query(cashInsertQuery, record, (err, result) => {
      if (err) {
        console.error("Error inserting cash sale record:", err);
      }
    });
  });

  paymentRecords.mpesa.forEach((record) => {
    db.query(mpesaInsertQuery, record, (err, result) => {
      if (err) {
        console.error("Error inserting M-Pesa sale record:", err);
      }
    });
  });

  res.json({ message: "Sale completed successfully" });
};

export const GetLastSevenDays = (req, res) => {
  const id = req.params.productId;
  const product_id = id;
  const q = `
    SELECT COALESCE(sum(count), 0) AS sold_count, COALESCE(sum(total), 0) as total_amount
    FROM liquorlogic.sold_products
    WHERE product_id = ?
    AND date >= CURDATE() - INTERVAL 7 DAY
    AND date <= CURDATE()
  `;

  db.query(q, [product_id], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};
