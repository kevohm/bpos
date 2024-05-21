import express from 'express';
import { uploadFile } from '../controllers/Images.jsx';

const router = express.Router();

// Set up the route for file upload
router.post('/upload', uploadFile);

// Other routes

export default router;