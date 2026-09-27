import { Response } from 'express';
import { Watchlist } from '../models/Watchlist.js';
import { isDbConnected } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// In-memory fallback if MongoDB is not running
const inMemoryWatchlist: Map<string, any[]> = new Map();

export class WatchlistController {
  /**
   * GET /api/watchlist
   */
  static async getWatchlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId || (req.query.userId as string) || 'anonymous-default-user';

      if (isDbConnected()) {
        const items = await Watchlist.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, count: items.length, items, storage: 'mongodb', userId });
        return;
      }

      const items = inMemoryWatchlist.get(userId) || [];
      res.json({ success: true, count: items.length, items, storage: 'memory', userId });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch watchlist', error: error.message });
    }
  }

  /**
   * POST /api/watchlist
   */
  static async addToWatchlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId || req.body.userId || 'anonymous-default-user';
      const {
        nasaId,
        name,
        isPotentiallyHazardous,
        estimatedDiameterMeters,
        missDistanceKm,
        velocityKps,
        closeApproachDate,
        initialRiskScore,
        currentRiskScore,
        notes,
      } = req.body;

      if (!nasaId || !name) {
        res.status(400).json({ success: false, message: 'nasaId and name are required' });
        return;
      }

      const itemData = {
        userId,
        nasaId,
        name,
        isPotentiallyHazardous: !!isPotentiallyHazardous,
        estimatedDiameterMeters: estimatedDiameterMeters || 0,
        missDistanceKm: missDistanceKm || 0,
        velocityKps: velocityKps || 0,
        closeApproachDate: closeApproachDate || '',
        initialRiskScore: initialRiskScore || 0,
        currentRiskScore: currentRiskScore || initialRiskScore || 0,
        notes: notes || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (isDbConnected()) {
        const saved = await Watchlist.findOneAndUpdate(
          { userId, nasaId },
          { $set: itemData },
          { upsert: true, new: true }
        );
        res.status(201).json({ success: true, item: saved, storage: 'mongodb' });
        return;
      }

      const userItems = inMemoryWatchlist.get(userId) || [];
      const existingIdx = userItems.findIndex((i) => i.nasaId === nasaId);
      if (existingIdx >= 0) {
        userItems[existingIdx] = itemData;
      } else {
        userItems.unshift(itemData);
      }
      inMemoryWatchlist.set(userId, userItems);

      res.status(201).json({ success: true, item: itemData, storage: 'memory' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to add to watchlist', error: error.message });
    }
  }

  /**
   * DELETE /api/watchlist/:id
   */
  static async removeFromWatchlist(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId || (req.query.userId as string) || 'anonymous-default-user';

      if (isDbConnected()) {
        await Watchlist.findOneAndDelete({ userId, nasaId: id });
        res.json({ success: true, message: `Asteroid ${id} removed from watchlist`, storage: 'mongodb' });
        return;
      }

      const userItems = inMemoryWatchlist.get(userId) || [];
      const filtered = userItems.filter((i) => i.nasaId !== id);
      inMemoryWatchlist.set(userId, filtered);

      res.json({ success: true, message: `Asteroid ${id} removed from watchlist`, storage: 'memory' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to remove from watchlist', error: error.message });
    }
  }
}
