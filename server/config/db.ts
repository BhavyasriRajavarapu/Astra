import mongoose from 'mongoose';
import { config } from './config.js';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000, // Quick timeout if Mongo isn't running locally
    });
    isConnected = true;
    console.log(`[ASTRA Backend] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[ASTRA Backend] MongoDB connection notice: ${error.message}. Running in resilient memory/cache mode.`);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
