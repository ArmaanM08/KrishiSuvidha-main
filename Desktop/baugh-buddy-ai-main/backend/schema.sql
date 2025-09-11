USE KrishiSuvidha_db;

-- Drop existing tables if they exist (in correct order to handle foreign key constraints)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS user_languages;
DROP TABLE IF EXISTS user_crops;
DROP TABLE IF EXISTS soil_tests;
DROP TABLE IF EXISTS weather_alerts;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(100) NOT NULL,
    farm_size DECIMAL(10,2) NOT NULL,
    join_date DATE NOT NULL,
    total_harvests INT DEFAULT 0,
    best_yield VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_crops table for primary crops
CREATE TABLE IF NOT EXISTS user_crops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    crop_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create user_languages table
CREATE TABLE IF NOT EXISTS user_languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    language VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    activity_date DATE NOT NULL,
    activity_description VARCHAR(255) NOT NULL,
    activity_type ENUM('soil', 'weather', 'advisory') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert dummy user data
INSERT INTO users (name, phone, location, farm_size, join_date, total_harvests, best_yield)
VALUES ('Rajesh Kumar', '+91 98765 43210', 'Mandya, Karnataka', 2.5, '2024-03-01', 12, '4.2 tons/acre');

-- Get the inserted user's ID
SET @user_id = LAST_INSERT_ID();

-- Insert primary crops
INSERT INTO user_crops (user_id, crop_name)
VALUES 
    (@user_id, 'Rice'),
    (@user_id, 'Wheat'),
    (@user_id, 'Sugarcane');

-- Insert languages
INSERT INTO user_languages (user_id, language)
VALUES 
    (@user_id, 'Hindi'),
    (@user_id, 'Kannada'),
    (@user_id, 'English');

-- Insert recent activities
INSERT INTO activities (user_id, activity_date, activity_description, activity_type)
VALUES 
    (@user_id, '2024-01-15', 'Soil pH testing completed', 'soil'),
    (@user_id, '2024-01-14', 'Weather alert acknowledged', 'weather'),
    (@user_id, '2024-01-12', 'Fertilizer recommendation followed', 'advisory'),
    (@user_id, '2024-01-10', 'Crop advisory requested for Rice', 'advisory');

-- Insert achievements
INSERT INTO achievements (user_id, title, description, icon)
VALUES 
    (@user_id, 'Early Adopter', 'First month user', '🌱'),
    (@user_id, 'Soil Expert', '10 soil tests completed', '🧪'),
    (@user_id, 'Weather Wise', 'Never missed weather alerts', '🌦️'),
    (@user_id, 'Community Helper', 'Helped 5+ farmers', '🤝');

-- Create seasonal_advice table
CREATE TABLE IF NOT EXISTS seasonal_advice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    month VARCHAR(20) NOT NULL,
    tasks JSON NOT NULL,
    crops_to_plant JSON NOT NULL,
    weather_tips TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pest_alerts table
CREATE TABLE IF NOT EXISTS pest_alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pest VARCHAR(100) NOT NULL,
    crops JSON NOT NULL,
    severity ENUM('High', 'Medium', 'Low') NOT NULL,
    region VARCHAR(100) NOT NULL,
    symptoms TEXT NOT NULL,
    treatment TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_insights table
CREATE TABLE IF NOT EXISTS ai_insights (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    insight TEXT NOT NULL,
    confidence INT NOT NULL,
    source VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample seasonal advice
INSERT INTO seasonal_advice (month, tasks, crops_to_plant, weather_tips)
VALUES
    ('September', 
     '["Prepare fields for Rabi crops", "Monitor pest activities", "Plan irrigation schedule"]',
     '["Wheat", "Mustard", "Peas"]',
     'Monitor rainfall patterns and prepare for post-monsoon conditions');

-- Insert sample pest alerts
INSERT INTO pest_alerts (pest, crops, severity, region, symptoms, treatment)
VALUES
    ('Fall Armyworm', 
     '["Maize", "Sorghum"]', 
     'High',
     'Karnataka',
     'Irregular holes in leaves, damaged whorls',
     'Apply recommended insecticides, use pheromone traps'),
    ('Aphids',
     '["Wheat", "Pulses"]',
     'Medium',
     'Punjab',
     'Yellowing leaves, stunted growth',
     'Spray neem-based solutions, encourage natural predators');

-- Insert sample AI insights
INSERT INTO ai_insights (title, insight, confidence, source)
VALUES
    ('Weather Impact Analysis', 
     'Expected rainfall in next 10 days will benefit standing crops. Ensure proper drainage.',
     85,
     'Weather Patterns'),
    ('Market Trend Alert',
     'Soybean prices likely to rise by 10% in coming weeks based on demand analysis.',
     78,
     'Market Data'),
    ('Pest Risk Prediction',
     'High humidity levels indicate increased risk of fungal diseases in next 2 weeks.',
     92,
     'Environmental Data');

-- Create disease_detections table
CREATE TABLE IF NOT EXISTS disease_detections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_path VARCHAR(255) NOT NULL,
    disease_name VARCHAR(100) NOT NULL,
    confidence INT NOT NULL,
    description TEXT NOT NULL,
    treatment TEXT NOT NULL,
    preventive_measures JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
