// backend/routes/cropAdvisory.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Crop season data (you can expand this or move to a database)
const cropSeasons = {
  rice: {
    optimalTemp: { min: 20, max: 35 },
    optimalHumidity: { min: 60, max: 80 },
    seasons: ['kharif', 'rabi']
  },
  wheat: {
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 50, max: 70 },
    seasons: ['rabi']
  },
  sugarcane: {
    optimalTemp: { min: 20, max: 35 },
    optimalHumidity: { min: 65, max: 85 },
    seasons: ['year-round']
  }
};

// Get seasonal advice
router.get('/seasonal', async (req, res) => {
  try {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [rows] = await db.execute(
      'SELECT tasks, crops_to_plant, weather_tips FROM seasonal_advice WHERE month = ?',
      [currentMonth]
    );
    
    if (rows.length === 0) {
      // Fallback to default data if no database entry
      return res.json([{
        month: currentMonth,
        tasks: [
          'Monitor crop growth and health',
          'Check for pest infestations',
          'Ensure proper irrigation'
        ],
        crops_to_plant: ['Season appropriate crops'],
        weather_tips: 'Stay updated with local weather forecasts'
      }]);
    }
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seasonal advice' });
  }
});

// Get pest alerts
router.get('/pests', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM pest_alerts WHERE is_active = 1 ORDER BY severity DESC LIMIT 5'
    );
    
    if (rows.length === 0) {
      // Return empty array if no active alerts
      return res.json([]);
    }
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pest alerts' });
  }
});

// Get AI insights
router.get('/insights', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM ai_insights WHERE is_active = 1 ORDER BY confidence DESC LIMIT 3'
    );
    
    if (rows.length === 0) {
      // Return empty array if no active insights
      return res.json([]);
    }
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI insights' });
  }
});

router.post('/', async (req, res) => {
  const { latitude, longitude, temperature, humidity, rainfall, soilMoisture } = req.body;

  try {
    // Calculate crop suitability based on current conditions
    const advisories = Object.entries(cropSeasons).map(([crop, conditions], index) => {
      const tempSuitability = calculateSuitability(
        temperature,
        conditions.optimalTemp.min,
        conditions.optimalTemp.max
      );
      
      const humiditySuitability = calculateSuitability(
        humidity,
        conditions.optimalHumidity.min,
        conditions.optimalHumidity.max
      );

      const overallSuitability = Math.round((tempSuitability + humiditySuitability) / 2);

      return {
        id: index + 1,
        crop: crop.charAt(0).toUpperCase() + crop.slice(1),
        stage: determineGrowthStage(temperature, rainfall),
        priority: determinePriority(overallSuitability),
        action: generateAction(crop, overallSuitability, rainfall),
        details: generateDetails(crop, temperature, humidity, rainfall),
        daysLeft: Math.floor(Math.random() * 14) + 1, // Mock value, replace with actual calculation
        status: overallSuitability > 70 ? 'optimal' : overallSuitability > 40 ? 'warning' : 'attention',
        suitability: overallSuitability,
        nextSeason: determineNextSeason(crop)
      };
    });

    res.json(advisories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate crop advisory' });
  }
});

// Helper functions
function calculateSuitability(current, min, max) {
  if (current >= min && current <= max) {
    return 100;
  }
  const midPoint = (max + min) / 2;
  const deviation = Math.abs(current - midPoint);
  const range = max - min;
  return Math.max(0, Math.round(100 - (deviation / range) * 100));
}

function determineGrowthStage(temperature, rainfall) {
  const stages = ['Germination', 'Seedling', 'Vegetative', 'Flowering', 'Ripening'];
  // Mock logic - replace with actual determination based on conditions
  return stages[Math.floor(Math.random() * stages.length)];
}

function determinePriority(suitability) {
  if (suitability < 40) return 'high';
  if (suitability < 70) return 'medium';
  return 'low';
}

function generateAction(crop, suitability, rainfall) {
  if (suitability < 40) {
    return `Immediate attention needed for ${crop}`;
  }
  if (rainfall < 5) {
    return 'Consider irrigation';
  }
  return 'Monitor crop progress';
}

function generateDetails(crop, temperature, humidity, rainfall) {
  return `Current conditions: ${temperature}°C, ${humidity}% humidity, ${rainfall}mm rainfall. ${
    temperature > 30 ? 'Consider heat protection measures.' : 
    temperature < 15 ? 'Watch for cold stress.' : 
    'Temperature is optimal.'
  }`;
}

function determineNextSeason(crop) {
  const currentMonth = new Date().getMonth();
  const seasons = cropSeasons[crop].seasons;
  
  if (seasons.includes('year-round')) return 'Continuous';
  
  if (currentMonth < 6) return 'Kharif (June-October)';
  return 'Rabi (November-March)';
}

module.exports = router;