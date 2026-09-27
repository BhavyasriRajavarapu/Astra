import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { connectDB, isDbConnected } from './config/db.js';
import asteroidRoutes from './routes/asteroidRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import preferenceRoutes from './routes/preferenceRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging in development
app.use((req: Request, res: Response, next: NextFunction) => {
  if (config.nodeEnv === 'development' && !req.url.startsWith('/api/health')) {
    console.log(`[API] ${req.method} ${req.url}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'ASTRA NEO Tracking Platform',
    timestamp: new Date().toISOString(),
    databaseConnected: isDbConnected(),
    nasaApiKeyConfigured: config.nasaApiKey !== 'DEMO_KEY',
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/asteroids', asteroidRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/preferences', preferenceRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: config.nodeEnv === 'development' ? err.stack : undefined,
  });
});

// Start Server
async function startServer() {
  // Connect DB (handles errors gracefully)
  await connectDB();

  app.listen(config.port, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 ASTRA Mission Control Backend running on port ${config.port}`);
    console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
    console.log(`🌌 NeoWs Feed API: http://localhost:${config.port}/api/asteroids/feed`);
    console.log(`=================================================\n`);
  });
}

startServer();

export default app;
