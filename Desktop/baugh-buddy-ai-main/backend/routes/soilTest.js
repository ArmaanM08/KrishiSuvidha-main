const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const createWorker = require('tesseract.js').createWorker;
const pdf = require('pdf-parse');
const sharp = require('sharp');
const moment = require('moment');
const db = require('../db');
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb('Error: Only PDF, JPG, JPEG, PNG files are allowed!');
  }
});

// Extract text from PDF
async function extractTextFromPDF(filepath) {
  const dataBuffer = await fs.readFile(filepath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Extract text from Image using Tesseract OCR
async function extractTextFromImage(filepath) {
  const worker = await createWorker();
  
  // Preprocess image for better OCR
  await sharp(filepath)
    .resize(1800) // Resize for better OCR
    .greyscale() // Convert to greyscale
    .normalize() // Normalize contrast
    .toFile(`${filepath}_processed.jpg`);

  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(`${filepath}_processed.jpg`);
  await worker.terminate();
  
  // Clean up processed image
  await fs.unlink(`${filepath}_processed.jpg`);
  
  return text;
}

// Parse extracted text to get soil test values
function parseSoilTestData(text) {
  const data = {
    ph: null,
    moisture: null,
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    organicMatter: null,
    lastTested: moment().format('YYYY-MM-DD'), // Default to current date
  };

  // Regular expressions to match common formats in soil test reports
  const patterns = {
    ph: /pH\s*:?\s*(\d+\.?\d*)/i,
    moisture: /moisture\s*:?\s*(\d+\.?\d*)/i,
    nitrogen: /nitrogen|N\s*:?\s*(\d+\.?\d*|low|medium|high)/i,
    phosphorus: /phosphorus|P\s*:?\s*(\d+\.?\d*|low|medium|high)/i,
    potassium: /potassium|K\s*:?\s*(\d+\.?\d*|low|medium|high)/i,
    organicMatter: /organic\s*matter\s*:?\s*(\d+\.?\d*|low|medium|high)/i,
    date: /(?:test|report|date)\s*:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
  };

  // Extract values using regex
  Object.keys(patterns).forEach(key => {
    const match = text.match(patterns[key]);
    if (match && match[1]) {
      if (key === 'date') {
        data.lastTested = moment(match[1], ['DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD');
      } else {
        data[key] = match[1].toLowerCase();
      }
    }
  });

  return data;
}

// API Endpoints
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filepath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    // Extract text based on file type
    let extractedText = '';
    if (fileExt === '.pdf') {
      extractedText = await extractTextFromPDF(filepath);
    } else {
      extractedText = await extractTextFromImage(filepath);
    }

    // Parse the extracted text
    const soilData = parseSoilTestData(extractedText);
    
    // Save to database
    const [result] = await db.execute(
      'INSERT INTO soil_tests (user_id, ph, moisture, nitrogen, phosphorus, potassium, organic_matter, tested_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        req.body.userId || 1, // Default to user 1 if no userId provided
        soilData.ph,
        soilData.moisture,
        soilData.nitrogen,
        soilData.phosphorus,
        soilData.potassium,
        soilData.organicMatter,
        soilData.lastTested
      ]
    );

    // Clean up uploaded file
    await fs.unlink(filepath);

    res.json({
      message: 'Soil test data processed successfully',
      soilData,
      id: result.insertId
    });

  } catch (error) {
    console.error('Error processing soil test:', error);
    res.status(500).json({ error: 'Error processing soil test data' });
  }
});

// Get soil test results for a user
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM soil_tests WHERE user_id = ? ORDER BY tested_at DESC LIMIT 1',
      [req.params.userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No soil test data found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching soil test data:', error);
    res.status(500).json({ error: 'Error fetching soil test data' });
  }
});

module.exports = router;