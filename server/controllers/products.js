import { db } from "../db.js";
import nodemailer from 'nodemailer';
import multer from 'multer';
import { promises as fsPromises } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const destinationDirectory = join(__dirname, '../public/Images');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use fs.promises.mkdir to create the directory if it doesn't exist
    fsPromises.mkdir(destinationDirectory, { recursive: true })
      .then(() => {
        cb(null, destinationDirectory);
      })
      .catch((err) => {
        console.error('Error creating destination directory:', err);
        cb(err);
      });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sorliquor@gmail.com',
    pass: 'vppwrvvzgabbftyg',
  },
});

const sendEmailNotification = (productName, branch) => {
  const names = productName;
  const emailContent = `
    Hello,
    
    We would like to inform you that the following product has been added to the inventory in ${branch} branch:
    
    Product: ${names}
    
    Best regards,
    Sunset
  `;

  const mailOptions = {
    from: 'sorliquor@gmail.com',
    to: ['gachihindirangu@gmail.com','jkwakuthii@gmail.com','edwinmwangiw0@gmail.com'],
    subject: 'Product Addition',
    text: emailContent, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};



export const GetAllProducts = (req, res) => {
  
  const productQuery = "SELECT * FROM products";

  db.query(productQuery, (err, data) => { 
    if (err) return res.status(500).json({ error: 'Database error' });

    // Modify the data to include the image URL for each product
    const productsWithImageUrls = data.map((product) => ({
      ...product,
      imageUrl: `http://${req.hostname}/Images/${product.imageFileName}`,
    }));

    return res.status(200).json(productsWithImageUrls);
  });
};
 

 
export const ProductUpdate = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const category = req.body.category;
  const DiscountedAmount = req.body.DiscountedAmount;
  const BuyingPrice = req.body.BuyingPrice;
  const price = req.body.price;
  const saleCategory = req.body.saleCategory;
  const saleType = req.body.saleType;
  const AddedQuantity = req.body.AddedQuantity;
  const OpeningStock = req.body.OpeningStock;
  const editedBy = req.body.editedBy;
  const Supplier = req.body.Supplier;

  const currentDate = new Date();

  // Add 3 hours to the current date
  currentDate.setHours(currentDate.getHours() + 3);

  // Format the adjusted date as a timestamp
  const currentTimestamp = format(currentDate, 'yyyy-MM-dd HH:mm:ss');


  const edited_at = currentTimestamp;
  const date_added = currentTimestamp;
  const product_id = req.body.product_id;
  const amountMl = req.body.amountMl;
  const added_by = editedBy;
  const Branch = req.body.Branch;
  const company_name = req.body.company_name;

  // Retrieve the current quantity from the database or your current state
  // and add the AddedQuantity to it
  const sqlSelect = "SELECT quantity FROM products WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      console.log(err);  
    } else {
      const currentQuantity = parseInt(result[0].quantity, 10);
      const AddedQuantity = parseInt(req.body.AddedQuantity, 10) || 0;
 

      const newQuantity = currentQuantity + AddedQuantity;
    
 
      // Update the product in the products table
      const sqlUpdate =
        "UPDATE products SET name = ?, category = ?, DiscountedAmount = ?, price = ?, saleCategory = ?, saleType = ?, BuyingPrice = ?, quantity = ?, AddedQuantity = ?,OpeningStock = ?, editedBy = ?, edited_at = ?, amountMl = ? WHERE id = ?";
      db.query(
        sqlUpdate,
        [name, category, DiscountedAmount, price, saleCategory, saleType, BuyingPrice, newQuantity, AddedQuantity, OpeningStock, editedBy, edited_at, amountMl, id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error updating product");
          } else {
            // Insert data into stock_addition_flow table
            const sqlInsert =
              "INSERT INTO stock_addition_flow (name, BuyingPrice, price, AddedQuantity,amountMl, added_by, Branch,company_name, date_added, current_stock, product_id,Supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(
              sqlInsert,
              [name, BuyingPrice, price, AddedQuantity,amountMl, added_by, Branch, company_name, date_added, newQuantity, product_id,Supplier],
              (err, insertResult) => {
                if (err) {
                  console.log(err);
                  res.status(500).send("Error inserting into stock_addition_flow");
                } else {
                  res.send(result);
                }
              }
            );
          }
        }
      );
    }
  });
}



export const ProductUpdate2 = (req, res) => {
  const id = req.params.id;
  const OpeningStock = req.body.OpeningStock;

  const sqlUpdate =
    "UPDATE products SET OpeningStock = ? WHERE id = ?";
  
  db.query(
    sqlUpdate,
    [OpeningStock, id],
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



export const harmonizeStock = (req, res) => {
  const Branch = req.params.Branch;

  const sqlUpdate =
                    `
                    UPDATE products
                    SET quantity = OpeningStock
                    WHERE Branch = ?
                    AND id > 0 
                    AND OpeningStock REGEXP '^[0-9]+$'
                    `;
  
  db.query(
    sqlUpdate,[Branch],(err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
};

 
  export const getProduct = (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM products WHERE id=?";
  
    db.query(q, id, (err, result) => {
      if (err) {
        console.error('Error fetching product:', err);
        return res.status(500).json({ errorMessage: 'Error fetching product. Please try again later.', error: err });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ errorMessage: 'Product not found.' });
      }
  
      const product = result[0];
      product.imageUrl = `http://${req.hostname}/Images/${product.imageFileName}`;
  
      return res.status(200).json(product);
    });
  };
  


export const AddCategory = (req, res) => {


  const cat_name=req.body.cat_name;
  const description = req.body.description
  const dateCreated = new Date().toISOString().split('T')[0];

  const q = "INSERT INTO categories (cat_name,description,dateCreated) VALUES (?,?,?);";

    db.query(q, [cat_name,description,dateCreated], (err, data) => {
      console.log(err)
      });
};


export const GetCategories = (req,res) =>{
    
  const q="SELECT * FROM categories";

  db.query(q, (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
} 


export const deleteProduct = (req,res) =>{

  const id = req.params.id;

  const sqlRemove = "DELETE FROM products where id= ?";
  db.query(sqlRemove,id, (err,result) => {
  if(err){
      console.log(err);
  }
  }); 
   
}


export const GetSales = (req,res) =>{
    
  const q="SELECT * FROM sold_products";

  db.query(q, (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
} 

export const AllProductsAnalysis = (req, res) => {

  const { q } = req.query;
  
  const selectQuery = `SELECT * FROM products`;

  const keys = ["name"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    ); 
  };

  db.query(selectQuery, (err, data) => {
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


export const GetProductEvents = (req,res) =>{
  const id = req.params.id;
  const product_id = id;

  const q=`
  SELECT *
  FROM (
      SELECT
          'Sale' AS event_type,
          date AS event_date,
          product_id,
          product_name,
          count AS quantity,
          SoldBy AS performed_by,
          COALESCE(NULL, 0) AS BuyingPrice,
          price,
          COALESCE(NULL, 0) AS added_stock_value,
          price * count AS sold_stock_value
      FROM
          sold_products
      UNION
      SELECT
          'Stock Flow' AS event_type,
          date_added AS event_date,
          product_id,
          name AS product_name,
          AddedQuantity AS quantity,
          added_by AS performed_by,
          BuyingPrice,
          price,
          BuyingPrice * AddedQuantity AS added_stock_value,
          COALESCE(NULL, 0) AS sold_stock_value
      FROM
          stock_addition_flow
  ) AS combined_data
  WHERE
      product_id = ? AND MONTH(event_date) = MONTH(CURRENT_DATE())
  ORDER BY
      event_date DESC;
  
  `;

  db.query(q,[product_id], (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
} 


export const GetProductOrders = (req,res) =>{
  const id = req.params.id;
  const product_id = id;

  const q=`
      select * from orders where product_id = ?
  `;

  db.query(q,[product_id], (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
} 

export const GetNotifications = (req,res) =>{
  const company_id = req.params.company_id;
  const q=`
 
  SELECT *
FROM (
    SELECT
        'Sale' AS event_type,
        date AS event_date,
        product_id,
        product_name,
        count AS quantity,
        SoldBy AS performed_by,
        COALESCE(NULL, 0) AS BuyingPrice,
        price,
        COALESCE(NULL, 0) AS added_stock_value,
        price * count AS sold_stock_value,
        Branch,
        0 as ml
    FROM
        sold_products
    WHERE
        company_id = ?  -- Add the WHERE condition here
    UNION
    SELECT
        'Stock Flow' AS event_type,
        date_added AS event_date,
        product_id,
        name AS product_name,
        AddedQuantity AS quantity,
        added_by AS performed_by,
        BuyingPrice,
        price,
        BuyingPrice * AddedQuantity AS added_stock_value,
        COALESCE(NULL, 0) AS sold_stock_value,
        Branch,
        0 as ml
    FROM
        stock_addition_flow
    WHERE
        company_id = ?  -- Add the WHERE condition here
    UNION
    SELECT
        'Stock Depletion' AS event_type,
        current_date() AS event_date,
        id as product_id,
        name as product_name,
        quantity,
        NULL AS performed_by,
        BuyingPrice,
        price,
        0 AS added_stock_value,
        0 AS sold_stock_value,
        Branch,
        amountMl as ml
    FROM 
        products
    WHERE
        company_id = ?  -- Add the WHERE condition here
        AND quantity = 0 
        AND sold > 0
) AS combined_data
WHERE
    MONTH(event_date) = MONTH(CURRENT_DATE())
ORDER BY
    event_date DESC;

  

  `;

  db.query(q,[company_id,company_id,company_id], (err,data) => {
      if(err) return res.send(err);

      return res.status(200).json(data);
      }); 
} 

const addSenatorKegVariants = (req, res, category) => {

  const { name, quantity, SellingPrice, amountMl, Branch, saleCategory, saleType, BuyingPrice, DiscountedAmount, productDecsription, smallCupMl, LargeCupMl, smallCupSp, LargeCupSp } = req.body;
  const uploadedFile = req.file;

  const smallCupRecord = {
    name: name,
    serialNumber: '',
    category: category,
    price: SellingPrice - DiscountedAmount,
    quantity: quantity,
    amountMl: amountMl,
    DateAdded: Date.now(),
    ProductStatus: 'available',
    Branch: Branch,
    saleCategory: saleCategory,
    saleType: saleType,
    BuyingPrice: BuyingPrice,
    DiscountedAmount: DiscountedAmount,
    imageFileName: uploadedFile.filename,
    productDecsription: productDecsription,
    smallCupMl: smallCupMl,
    LargeCupMl: LargeCupMl,
    smallCupSp: smallCupSp,
    LargeCupSp: smallCupSp
  };

  const largeCupRecord = { ...smallCupRecord, LargeCupSp: LargeCupSp };

  insertProductRecord(smallCupRecord, req, res, (smallCupSerialNumber) => {
 
    largeCupRecord.serialNumber = smallCupSerialNumber;
    insertProductRecord(largeCupRecord, req, res, () => {
      res.json({ success: true });
    });
  });
};

const addProductRow = (req, res, category) => {
  
  const { name, quantity, SellingPrice, amountMl, Branch, saleCategory, saleType, BuyingPrice, DiscountedAmount, productDecsription, smallCupMl, LargeCupMl, smallCupSp, LargeCupSp } = req.body;

  const uploadedFile = req.file;

  const record = {
    name: name,
    serialNumber: '', 
    category: category,
    price: SellingPrice - DiscountedAmount,
    quantity: quantity,
    amountMl: amountMl,
    DateAdded: Date.now(),
    ProductStatus: 'available',
    Branch: Branch,
    saleCategory: saleCategory,
    saleType: saleType,
    BuyingPrice: BuyingPrice,
    DiscountedAmount: DiscountedAmount,
    imageFileName: uploadedFile.filename,
    productDecsription: productDecsription,
    smallCupMl: smallCupMl,
    LargeCupMl: LargeCupMl,
    smallCupSp: smallCupSp,
    LargeCupSp: LargeCupSp
  };

  insertProductRecord(record, req, res, () => {
    res.json({ success: true });
  });
};

const insertProductRecord = (record, req, res, callback) => {
  db.query('SELECT MAX(serialNumber) AS maxSerialNumber FROM products', (err, result) => {
    if (err) {
      console.error('Error retrieving maximum serial number:', err);
      res.status(500).json({ error: 'Failed to add records' });
      return;
    }
    let maxSerialNumber = result[0].maxSerialNumber || 0;
    maxSerialNumber++; 

    record.serialNumber = maxSerialNumber.toString().padStart(4, '0');

    db.query('INSERT INTO products SET ?', record, (err, result) => {
      if (err) {
        console.error('Error inserting records:', err);
        res.status(500).json({ error: 'Failed to add records' });
      } else {
        console.log('Record added to database:', result.affectedRows);
        if (callback) {
          callback(record.serialNumber);
        }
      }
    });
  });
};

export const AddProduct = (req, res) => {
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(400).json({ error: 'File upload failed' });
    } 

    const {
      name, category, quantity, SellingPrice, amountMl, Branch, saleCategory,
      saleType, BuyingPrice, DiscountedAmount, productDecsription,smallCupSp,LargeCupSp,smallCupMl,LargeCupMl,company_id
    } = req.body;

    // Process the uploaded file information
    const uploadedFile = req.file;

    const maxFileNameLength = 255; // Adjust to your database column length
    const uploadedFileName = uploadedFile.filename;
    const trimmedFileName = uploadedFileName.substring(0, maxFileNameLength);

    db.query('SELECT MAX(serialNumber) AS maxSerialNumber FROM products', (err, result) => {
      if (err) {
        console.error('Error retrieving maximum serial number:', err);
        res.status(500).json({ error: 'Failed to add records' });
        return;
      } 

      let maxSerialNumber = result[0].maxSerialNumber || 0;
      maxSerialNumber++; // Increment the serial number.

      // Insert records into the "products" table
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 3);
      const currentTimestamp = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
      const DateAdded = currentTimestamp;
      const ProductStatus = 'available';
      const ProductStatusSmall = 'Small';
      const ProductStatusLarge = 'Large';
      const serialNumber = maxSerialNumber.toString().padStart(4, '0');

      if (category === "Senator Keg") {
        // Insert the first record with small cup details
        const firstRecord = {
          name, serialNumber, category, price: smallCupSp - DiscountedAmount,
          quantity, amountMl, DateAdded, ProductStatus: ProductStatusSmall, Branch, saleCategory,
          saleType, BuyingPrice, DiscountedAmount, productDecsription,
          imageFileName: uploadedFile.filename,
          smallCupMl, LargeCupMl: 0, smallCupSp, LargeCupSp: 0,company_id
        };

        db.query('INSERT INTO products SET ?', firstRecord, (err, result) => {
          if (err) {
            console.error('Error inserting first record:', err);
            res.status(500).json({ error: 'Failed to add records' });
            return;
          }

          console.log('First record added to database:', result.affectedRows);
        });

        // Insert the second record with large cup details
        const secondRecord = {
          name, serialNumber, category, price: LargeCupSp - DiscountedAmount,
          quantity, amountMl, DateAdded, ProductStatus: ProductStatusLarge, Branch, saleCategory,
          saleType, BuyingPrice, DiscountedAmount, productDecsription,
          imageFileName: uploadedFile.filename,
          smallCupMl: 0, LargeCupMl, smallCupSp: 0, LargeCupSp,company_id
        };

        db.query('INSERT INTO products SET ?', secondRecord, (err, result) => {
          if (err) {
            console.error('Error inserting second record:', err);
            res.status(500).json({ error: 'Failed to add records' });
            return;
          }

          console.log('Second record added to database:', result.affectedRows);
        });
      } else {
        // Insert a single record for other categories
        const record = {
          name, serialNumber, category, price: SellingPrice - DiscountedAmount,
          quantity, amountMl, DateAdded, ProductStatus, Branch, saleCategory,
          saleType, BuyingPrice, DiscountedAmount, productDecsription,
          imageFileName: uploadedFile.filename,
          smallCupMl: 0, LargeCupMl: 0, smallCupSp: 0, LargeCupSp: 0,company_id
        };

        db.query('INSERT INTO products SET ?', record, (err, result) => {
          if (err) {
            console.error('Error inserting record:', err);
            res.status(500).json({ error: 'Failed to add records' });
            return;
          }

          console.log('Record added to database:', result.affectedRows);
        });
      }

      // Send email notification...
      sendEmailNotification([name], Branch);

      res.json({ success: true });
    });
  });
};

export const StockPerformance = (req, res) => {
  const Branch = req.params.Branch;
  const sqlUpdate =
                    `
                    SELECT 
                      product_id,product_name, price,SUM(count) AS total_count,SUM(count * price) AS total_amount FROM sold_products 
                      WHERE DATE(date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 5 DAY) AND CURDATE() AND Branch = ?
                      GROUP BY product_id, product_name, price ORDER BY total_count DESC LIMIT 15
                    `;
  db.query(
    sqlUpdate,[Branch],(err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
};
