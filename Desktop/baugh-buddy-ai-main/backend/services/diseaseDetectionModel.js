const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');

class DiseaseDetectionModel {
    constructor() {
        this.model = null;
        this.labels = [
            "Apple___Apple_scab",
            "Apple___Black_rot",
            "Apple___Cedar_apple_rust",
            "Apple___healthy",
            "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
            "Corn_(maize)___Common_rust_",
            "Corn_(maize)___Northern_Leaf_Blight",
            "Corn_(maize)___healthy",
            "Grape___Black_rot",
            "Grape___Esca_(Black_Measles)",
            "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
            "Grape___healthy",
            "Potato___Early_blight",
            "Potato___Late_blight",
            "Potato___healthy",
            "Rice___Bacterial_leaf_blight",
            "Rice___Brown_spot",
            "Rice___Leaf_smut",
            "Rice___healthy",
            "Tomato___Bacterial_spot",
            "Tomato___Early_blight",
            "Tomato___Late_blight",
            "Tomato___Leaf_Mold",
            "Tomato___Septoria_leaf_spot",
            "Tomato___Spider_mites Two-spotted_spider_mite",
            "Tomato___Target_Spot",
            "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
            "Tomato___Tomato_mosaic_virus",
            "Tomato___healthy"
        ];
    }

    async loadModel() {
        try {
            this.model = await tf.loadLayersModel('file://./models/plant_disease_model/model.json');
            console.log('Disease detection model loaded successfully');
        } catch (error) {
            console.error('Error loading model:', error);
            throw new Error('Failed to load disease detection model');
        }
    }

    async preprocessImage(imagePath) {
        try {
            // Resize image to 224x224 (standard input size for many vision models)
            const imageBuffer = await sharp(imagePath)
                .resize(224, 224)
                .toFormat('png')
                .toBuffer();

            // Convert to tensor
            const tensor = tf.node.decodeImage(imageBuffer, 3);
            
            // Normalize pixel values to [0,1]
            const normalized = tensor.div(255.0);
            
            // Add batch dimension
            const batched = normalized.expandDims(0);
            
            return batched;
        } catch (error) {
            console.error('Error preprocessing image:', error);
            throw new Error('Failed to preprocess image');
        }
    }

    async predict(imagePath) {
        try {
            if (!this.model) {
                await this.loadModel();
            }

            // Preprocess the image
            const tensor = await this.preprocessImage(imagePath);

            // Get prediction
            const predictions = await this.model.predict(tensor).data();

            // Get top 3 predictions
            const topPredictions = Array.from(predictions)
                .map((probability, index) => ({
                    disease: this.labels[index],
                    probability: probability * 100
                }))
                .sort((a, b) => b.probability - a.probability)
                .slice(0, 3);

            // Clean up tensors
            tensor.dispose();

            // Get detailed information for the top disease
            const topDisease = this.getDiseaseDetails(topPredictions[0].disease);
            return {
                ...topDisease,
                confidence: Math.round(topPredictions[0].probability),
                alternativeDiagnoses: topPredictions.slice(1).map(p => ({
                    disease: this.formatDiseaseName(p.disease),
                    probability: Math.round(p.probability)
                }))
            };
        } catch (error) {
            console.error('Error making prediction:', error);
            throw new Error('Failed to analyze image');
        }
    }

    formatDiseaseName(disease) {
        return disease
            .split('___')
            .pop()
            .replace(/_/g, ' ')
            .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    getDiseaseDetails(disease) {
        const diseaseDetails = {
            'Apple___Apple_scab': {
                disease: 'Apple Scab',
                description: 'A serious disease of apples and ornamental crabapples caused by the fungus Venturia inaequalis.',
                treatment: 'Apply protective fungicides early in the season. Start applications at green tip and continue at 7-10 day intervals.',
                preventiveMeasures: [
                    'Plant resistant varieties',
                    'Remove and destroy fallen leaves',
                    'Ensure good air circulation through pruning',
                    'Avoid overhead irrigation'
                ]
            },
            // Add more disease details here...
        };

        const details = diseaseDetails[disease] || {
            disease: this.formatDiseaseName(disease),
            description: 'Specific details not available for this disease.',
            treatment: 'Consult a local agricultural expert for specific treatment recommendations.',
            preventiveMeasures: [
                'Practice crop rotation',
                'Maintain proper plant spacing',
                'Keep the field clean',
                'Monitor plants regularly'
            ]
        };

        return details;
    }
}

module.exports = new DiseaseDetectionModel();
