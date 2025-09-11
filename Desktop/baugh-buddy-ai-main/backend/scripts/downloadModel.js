const tf = require('@tensorflow/tfjs-node');
const https = require('https');
const fs = require('fs');
const path = require('path');

const MODEL_URL = 'https://storage.googleapis.com/tfjs-models/tfjs/plant_disease_efficientnet_2/model.json';
const MODEL_DIR = path.join(__dirname, 'models', 'plant_disease_model');

// Ensure model directory exists
if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
}

// Download model files
async function downloadModel() {
    console.log('Downloading pre-trained model...');
    
    try {
        // Download model.json
        await downloadFile(MODEL_URL, path.join(MODEL_DIR, 'model.json'));
        
        // Parse model.json to get weights files
        const modelJSON = JSON.parse(fs.readFileSync(path.join(MODEL_DIR, 'model.json')));
        const weightsManifest = modelJSON.weightsManifest;
        
        // Download all weights files
        for (const group of weightsManifest) {
            for (const path of group.paths) {
                const weightsURL = MODEL_URL.replace('model.json', path);
                await downloadFile(weightsURL, path.join(MODEL_DIR, path));
            }
        }
        
        console.log('Model downloaded successfully!');
        console.log('Testing model loading...');
        
        // Test load the model
        const model = await tf.loadLayersModel(`file://${path.join(MODEL_DIR, 'model.json')}`);
        console.log('Model loaded successfully!');
        
        // Print model summary
        console.log('\nModel Summary:');
        model.summary();
        
    } catch (error) {
        console.error('Error downloading model:', error);
    }
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        
        https.get(url, response => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${dest}`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(dest, () => {
                reject(err);
            });
        });
    });
}

// Run the download
downloadModel();
