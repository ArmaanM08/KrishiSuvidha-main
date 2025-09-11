const express = require('express');
const cors = require('cors');
const soilTestRoutes = require('./routes/soilTest');
const cropAdvisoryRoutes = require('./routes/cropAdvisory');
const diseaseDetectionRoutes = require('./routes/diseaseDetection');
const translationRoutes = require('./routes/translation');

const app = express();
const port = 5000;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS Middleware
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Create upload directories if they don't exist
const fs = require('fs');
const uploadDirs = ['uploads', 'uploads/crops'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Routes
app.use('/api/soil-test', soilTestRoutes);
app.use('/api/crop-advisory', cropAdvisoryRoutes);
app.use('/api/crop-advisory', diseaseDetectionRoutes);
app.use('/api/translation', translationRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});