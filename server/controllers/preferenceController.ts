import { Request, Response } from 'express';
import { UserPreference } from '../models/UserPreference.js';
import { isDbConnected } from '../config/db.js';

const inMemoryPreferences: Map<string, any> = new Map();

const DEFAULT_PREFERENCES = {
  userId: 'anonymous-default-user',
  distanceUnit: 'km',
  velocityUnit: 'kps',
  diameterUnit: 'meters',
  alertThresholdRiskScore: 50,
  notifyOnHazardous: true,
  notifyOnCloseApproach: true,
  autoRefreshIntervalSeconds: 60,
  themePreference: 'deep-space',
};

export class PreferenceController {
  /**
   * GET /api/preferences
   */
  static async getPreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.query.userId as string) || 'anonymous-default-user';

      if (isDbConnected()) {
        let prefs = await UserPreference.findOne({ userId });
        if (!prefs) {
          prefs = await UserPreference.create({ ...DEFAULT_PREFERENCES, userId });
        }
        res.json({ success: true, preferences: prefs, storage: 'mongodb' });
        return;
      }

      let prefs = inMemoryPreferences.get(userId);
      if (!prefs) {
        prefs = { ...DEFAULT_PREFERENCES, userId };
        inMemoryPreferences.set(userId, prefs);
      }
      res.json({ success: true, preferences: prefs, storage: 'memory' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch preferences', error: error.message });
    }
  }

  /**
   * PUT /api/preferences
   */
  static async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId || 'anonymous-default-user';
      const updates = req.body;

      if (isDbConnected()) {
        const updated = await UserPreference.findOneAndUpdate(
          { userId },
          { $set: updates },
          { upsert: true, new: true }
        );
        res.json({ success: true, preferences: updated, storage: 'mongodb' });
        return;
      }

      const existing = inMemoryPreferences.get(userId) || { ...DEFAULT_PREFERENCES, userId };
      const updated = { ...existing, ...updates, userId, updatedAt: new Date() };
      inMemoryPreferences.set(userId, updated);

      res.json({ success: true, preferences: updated, storage: 'memory' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to update preferences', error: error.message });
    }
  }
}
