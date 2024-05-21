import mysql from 'mysql';
import multer from 'multer';
import nodemailer from 'nodemailer';

const db = mysql.createConnection({
  host: 'your-mysql-host',
  user: 'your-mysql-username',
  password: 'your-mysql-password',
  database: 'your-mysql-database',
});

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage }).single('image'); // 'image' is the field name for the uploaded file

export const AddProduct = (req, res) => {
    
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).send('Error uploading image');
    }

    try {
      const {
        name,
        category,
        quantity,
        SellingPrice,
        amountMl,
        Branch,
        saleCategory,
        saleType,
        BuyingPrice,
        DiscountedAmount,
      } = req.body;

      const { filename } = req.file; // Get the filename of the uploaded image

      // Insert the image file path and other product details into your MySQL database
      const sql =
        'INSERT INTO products (name, category, price, serialNumber, amountMl, DateAdded, ProductStatus, Branch, saleCategory, saleType, BuyingPrice, DiscountedAmount, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      // The question marks in the SQL statement should match the order of the values in the following array.
      const values = [
        name,
        category,
        SellingPrice - DiscountedAmount,
        serialNumber,
        amountMl,
        new Date().toISOString().split('T')[0],
        'available',
        Branch,
        saleCategory,
        saleType,
        BuyingPrice,
        DiscountedAmount,
        filename,
      ];

      db.query(sql, values, (error, result) => {
        if (error) {
          console.error('Error inserting records:', error);
          res.status(500).json({ error: 'Failed to add records' });
        } else {
          console.log('Records added to database:', result.affectedRows);

          // Send email notification
          const emailContent = `
            Hello, 

            We are excited to inform you that ${quantity} items have been added for product "${name}" to our inventory in ${Branch} branch. 
            Check out the latest items available!

            Best regards.
            Sunset.
          `;

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'samuelwanjiru69@gmail.com',
              pass: 'dfwnkqxasbnjwqey',
            },
          });

          transporter.sendMail(
            {
              from: 'sunsetliqour@gmail.com',
              to: ['samuelwanjiru69@gmail.com', 'gachihindirangu@gmail.com', 'jkwakuthii@gmail.com'],
              subject: 'Stock Addition Notification',
              text: emailContent,
            },
            (err, info) => {
              if (err) {
                console.error('Error sending email:', err);
                // You can handle the error here, maybe log it or send a response to the client
              } else {
                console.log('Email sent successfully:', info.response);
              }
            }
          );

          res.json({ success: true });
        }
      });
    } catch (error) {
      console.error('Error uploading image or adding product:', error);
      res.status(500).send('Error uploading image or adding product');
    }
  });
};
