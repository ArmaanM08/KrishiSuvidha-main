const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const diseaseModel = require('../services/diseaseDetectionModel');
const db = require('../db');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'crops');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: 'uploads/crops',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Images only (jpeg, jpg, png)!');
  }
});

// Disease detection endpoint
router.post('/detect-disease', upload.single('image'), async (req, res) => {
  try {
    console.log('Received disease detection request');
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log('File uploaded successfully:', req.file.path);

    // Use the AI model to detect disease
    console.log('Starting disease detection...');
    const result = await diseaseModel.predict(req.file.path);
    console.log('Disease detection result:', result);

    // Store the result in the database
    console.log('Storing result in database...');
    const [dbResult] = await db.execute(
      'INSERT INTO disease_detections (image_path, disease_name, confidence, description, treatment, preventive_measures) VALUES (?, ?, ?, ?, ?, ?)',
      [
        req.file.path,
        result.disease,
        result.confidence,
        result.description,
        result.treatment,
        JSON.stringify(result.preventiveMeasures)
      ]
    );
    console.log('Database insertion successful, ID:', dbResult.insertId);

    const response = {
      id: dbResult.insertId,
      ...result
    };
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error processing image',
      details: error.message
    });
  }
});

module.exports = router;
