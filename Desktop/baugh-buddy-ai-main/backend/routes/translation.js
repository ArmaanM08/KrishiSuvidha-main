const express = require('express');
const router = express.Router();
const translationService = require('../services/translationService');

// Get available languages
router.get('/languages', async (req, res) => {
    try {
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'हिंदी (Hindi)' },
            { code: 'mr', name: 'मराठी (Marathi)' },
            { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
            { code: 'bn', name: 'বাংলা (Bengali)' },
            { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
            { code: 'ta', name: 'தமிழ் (Tamil)' },
            { code: 'te', name: 'తెలుగు (Telugu)' },
            { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' }
        ];
        
        // Add this log to debug the response
        console.log('Sending languages:', languages);
        
        return res.status(200).json(languages);
    } catch (error) {
        console.error('Error in /languages route:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Translate text
router.post('/translate', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;
        if (!text || !targetLanguage) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const translation = await translationService.translateText(text, targetLanguage);
        res.json({ translation });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Translate an entire object (useful for translating API responses)
router.post('/translate-object', async (req, res) => {
    try {
        const { data, targetLanguage } = req.body;
        if (!data || !targetLanguage) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const translatedData = await translationService.translateObject(data, targetLanguage);
        res.json(translatedData);
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Detect language
router.post('/detect-language', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Missing text parameter' });
        }

        const detection = await translationService.detectLanguage(text);
        res.json(detection);
    } catch (error) {
        console.error('Language detection error:', error);
        res.status(500).json({ error: 'Language detection failed' });
    }
});

module.exports = router;
