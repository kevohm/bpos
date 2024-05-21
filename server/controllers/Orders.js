import multer from 'multer';
import { promises as fsPromises } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';
import sharp from 'sharp'; // Import sharp for image optimization
import { db } from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const destinationDirectory = join(__dirname, '../public/stockreceipts');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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
    // Extract original filename and sanitize it
    const originalFilename = file.originalname;
    const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9.]/g, '_');
    
    // Generate unique filename by prefixing with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}_${sanitizedFilename}`;

    cb(null, filename);
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPEG, and PDF files are allowed'));
    }
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, 
});

export const EditResponse = (req, res) => {
  upload.single('receipt')(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ success: false, error: 'Error uploading receipt file' });
    }

    const order_serial = req.params.order_serial;
    const user_response = req.body.user_response;
    const user_total = req.body.user_total;
    const user_name = req.body.user_name;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 3);
    const arrival_time = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    if (!req.file) { // Check if a file was uploaded
      return res.status(400).json({ success: false, error: 'No receipt file uploaded' });
    }
    
    try {
      // Optimize the uploaded image
      const optimizedImagePath = join(destinationDirectory, `optimized_${req.file.filename}`);
      await sharp(req.file.path)
        .resize({ width: 800 }) // Resize image to width of 800 pixels
        .jpeg({ quality: 80 })  // Set JPEG quality to 80%
        .toFile(optimizedImagePath);

      // Get the filename of the optimized image
      const optimizedImageFilename = optimizedImagePath.split('/').pop();

      // Update the database with the optimized image filename
      const sql = `
        UPDATE order_info 
        SET arrival_time = ?, user_response = ?, receipt = ?, user_total = ?, user_name = ?
        WHERE order_serial = ?
      `;

      db.query(
        sql,
        [arrival_time, user_response, optimizedImageFilename, user_total, user_name, order_serial],
        (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
            return;
          }
          res.status(200).json({ success: true });
        }
      );

      // Delete the original uploaded image after optimization
      await fsPromises.unlink(req.file.path);
    } catch (error) {
      console.error('Error optimizing and updating image:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
};


export const AddResponse = (req, res) => {

    const order_serial = req.body.order_serial;
    const admin_response = req.body.admin_response;
    const supplier = req.body.supplier;
    const admin_total = req.body.admin_total;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 3);
    const dispatch_time = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    const sql = `
              INSERT INTO order_info (order_serial,dispatch_time,admin_response,supplier,admin_total) VALUES (?, ?, ?, ?, ?)
            `

    db.query(sql, [order_serial,dispatch_time,admin_response,supplier,admin_total], (err, results) => {
    if (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
    return;
    }

    res.status(200).json({ success: true });
    });
}

export const getIndividualOrders = (req, res) => {
  const order_serial = req.params.order_serial;
  const SelectQuery = `
              select * from orders where order_serial = ?
      `;
  
  db.query(SelectQuery, [order_serial], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    res.json(data);
  });
}; 

export const getOrder = (req, res) => {
  const order_id = req.params.order_id;
  const SelectQuery = `
              select * from orders where order_id = ?
      `;
  
  db.query(SelectQuery, [order_id], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    res.json(data);
  });
};

export const updateOrder = (req,res) =>{

  const order_id = req.params.order_id;
  const order_status = req.body.order_status;
  const to_buy = req.body.to_buy;

  const sqlUpdate = "UPDATE orders SET order_status = ?,to_buy = ? where order_id= ?";
  db.query(sqlUpdate,[order_status,to_buy,order_id], (err,result) => {
      if(err){
          console.log(err);
      }
      res.send(result)
  }); 

}

export const getOrderResponse = (req, res) => {
  const order_serial = req.params.order_serial;
  const q = "SELECT * FROM order_info WHERE order_serial=?";

  db.query(q, order_serial, (err, result) => {
    if (err) {
      console.error('Error fetching order_response:', err);
      return res.status(500).json({ errorMessage: 'Error fetching order_response. Please try again later.', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ errorMessage: 'order_response not found.' });
    }
    const order_response = result[0];
    order_response.imageUrl = `http://${req.hostname}/stockreceipts/${order_response.receipt}`;

    return res.status(200).json(order_response);
  });
};
