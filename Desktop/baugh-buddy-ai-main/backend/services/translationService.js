const fetch = require('node-fetch');

class TranslationService {
    constructor() {
        this.API_URL = 'https://libretranslate.de'; // Free public LibreTranslate instance
    }

    async translateText(text, targetLanguage) {
        try {
            const response = await fetch(`${this.API_URL}/translate`, {
                method: 'POST',
                body: JSON.stringify({
                    q: text,
                    source: 'auto',
                    target: this.normalizeLanguageCode(targetLanguage),
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            return data.translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            throw new Error('Failed to translate text');
        }
    }

    // Convert our language codes to LibreTranslate format
    normalizeLanguageCode(code) {
        const languageMap = {
            'en': 'en',
            'hi': 'hi',
            'mr': 'mr',
            'gu': 'gu',
            'bn': 'bn',
            'pa': 'pa',
            'ta': 'ta',
            'te': 'te',
            'kn': 'kn'
        };
        return languageMap[code] || 'en';
    }

    async translateObject(obj, targetLanguage) {
        try {
            const translatedObj = {};
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'string') {
                    translatedObj[key] = await this.translateText(value, targetLanguage);
                } else if (Array.isArray(value)) {
                    translatedObj[key] = await Promise.all(
                        value.map(item => 
                            typeof item === 'string' 
                                ? this.translateText(item, targetLanguage)
                                : item
                        )
                    );
                } else if (typeof value === 'object' && value !== null) {
                    translatedObj[key] = await this.translateObject(value, targetLanguage);
                } else {
                    translatedObj[key] = value;
                }
            }
            return translatedObj;
        } catch (error) {
            console.error('Translation error:', error);
            throw new Error('Failed to translate object');
        }
    }

    async detectLanguage(text) {
        try {
            const [detection] = await translate.detect(text);
            return detection;
        } catch (error) {
            console.error('Language detection error:', error);
            throw new Error('Failed to detect language');
        }
    }
}

module.exports = new TranslationService();
