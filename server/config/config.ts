import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  nasaApiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/astra_db',
  nasaBaseUrl: 'https://api.nasa.gov/neo/rest/v1',
  riskWeights: {
    missDistance: parseInt(process.env.RISK_WEIGHT_MISS_DISTANCE || '30', 10),
    diameter: parseInt(process.env.RISK_WEIGHT_DIAMETER || '25', 10),
    velocity: parseInt(process.env.RISK_WEIGHT_VELOCITY || '20', 10),
    hazardous: parseInt(process.env.RISK_WEIGHT_HAZARDOUS || '25', 10),
  },
  cacheTTLMinutes: 30, // 30 minutes cache for NASA API feed
  jwtSecret: process.env.JWT_SECRET || 'astra_planetary_defense_jwt_secret_2026_secure',
};
