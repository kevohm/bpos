// fileController.js

import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public/Images'); // Set the destination directory as needed
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Define the controller function for file upload
export const uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Handle any errors, e.g., file size exceeded, file type not allowed, etc.
      return res.status(400).json({ error: err.message });
    }

    // The file has been uploaded successfully. You can access it through req.file.
    const uploadedFile = req.file;

    // You can now save information about the uploaded file to a database or respond to the client.
    res.status(200).json({ message: 'File uploaded successfully', file: uploadedFile });
  });
};
