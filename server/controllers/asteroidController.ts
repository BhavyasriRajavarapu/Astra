import { Request, Response } from 'express';
import { NasaService } from '../services/nasaService.js';
import { isDbConnected } from '../config/db.js';

export class AsteroidController {
  /**
   * GET /api/asteroids/feed
   * Returns today's NEO feed or date-range feed with risk statistics
   */
  static async getFeed(req: Request, res: Response): Promise<void> {
    try {
      const { start_date, end_date } = req.query;
      const data = await NasaService.getFeed(
        typeof start_date === 'string' ? start_date : undefined,
        typeof end_date === 'string' ? end_date : undefined
      );

      res.json({
        success: true,
        ...data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve asteroid feed',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/asteroids/stats
   * Returns high-level KPI metrics for the mission control dashboard
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const feedData = await NasaService.getFeed();
      const asteroids = feedData.asteroids || [];

      const totalObjects = asteroids.length;
      const hazardousCount = asteroids.filter((a) => a.isPotentiallyHazardous).length;
      const closeApproachesCount = asteroids.reduce(
        (acc, curr) => acc + (curr.closeApproaches?.length || 1),
        0
      );

      // Find highest risk
      let highestRiskAsteroid = asteroids.length > 0 ? asteroids[0] : null;
      for (const a of asteroids) {
        if (!highestRiskAsteroid || a.calculatedRiskScore > highestRiskAsteroid.calculatedRiskScore) {
          highestRiskAsteroid = a;
        }
      }

      // Find closest approach
      let closestApproachAsteroid = asteroids.length > 0 ? asteroids[0] : null;
      for (const a of asteroids) {
        const aDist = a.primaryCloseApproach?.missDistanceKilometers || Infinity;
        const cDist = closestApproachAsteroid?.primaryCloseApproach?.missDistanceKilometers || Infinity;
        if (aDist < cDist) {
          closestApproachAsteroid = a;
        }
      }

      res.json({
        success: true,
        stats: {
          totalObjects,
          hazardousCount,
          closeApproachesCount,
          highestRisk: {
            name: highestRiskAsteroid?.name || 'N/A',
            score: highestRiskAsteroid?.calculatedRiskScore || 0,
            level: highestRiskAsteroid?.calculatedRiskLevel || 'LOW',
            id: highestRiskAsteroid?.nasaId || '',
          },
          closestApproach: {
            name: closestApproachAsteroid?.name || 'N/A',
            missDistanceKm: closestApproachAsteroid?.primaryCloseApproach?.missDistanceKilometers || 0,
            missDistanceLunar: closestApproachAsteroid?.primaryCloseApproach?.missDistanceLunar || 0,
            date: closestApproachAsteroid?.primaryCloseApproach?.closeApproachDate || '',
            id: closestApproachAsteroid?.nasaId || '',
          },
        },
        source: feedData.source,
        isDemo: feedData.isDemo,
        lastUpdated: feedData.lastUpdated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to compute asteroid metrics',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/asteroids/upcoming
   * Returns timeline of upcoming close approaches
   */
  static async getUpcoming(req: Request, res: Response): Promise<void> {
    try {
      const feedData = await NasaService.getFeed();
      const asteroids = feedData.asteroids || [];

      // Flatten close approaches and link asteroid metadata
      const timeline: any[] = [];
      asteroids.forEach((ast) => {
        (ast.closeApproaches || [ast.primaryCloseApproach]).forEach((ca: any) => {
          if (ca) {
            timeline.push({
              asteroidId: ast.nasaId,
              name: ast.name,
              isPotentiallyHazardous: ast.isPotentiallyHazardous,
              calculatedRiskScore: ast.calculatedRiskScore,
              calculatedRiskLevel: ast.calculatedRiskLevel,
              estimatedDiameterMeters: ast.estimatedDiameter?.meters?.estimatedAverage || 100,
              closeApproachDate: ca.closeApproachDate,
              closeApproachDateFull: ca.closeApproachDateFull,
              relativeVelocityKps: ca.relativeVelocityKps,
              missDistanceKilometers: ca.missDistanceKilometers,
              missDistanceLunar: ca.missDistanceLunar,
              orbitingBody: ca.orbitingBody,
            });
          }
        });
      });

      // Sort by date / time
      timeline.sort((a, b) => a.closeApproachDate.localeCompare(b.closeApproachDate));

      res.json({
        success: true,
        count: timeline.length,
        timeline,
        source: feedData.source,
        isDemo: feedData.isDemo,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming approaches',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/asteroids/:id
   * Detailed view of single asteroid
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const asteroid = await NasaService.getAsteroidById(id);

      if (!asteroid) {
        res.status(404).json({
          success: false,
          message: `Asteroid with NASA ID ${id} not found`,
        });
        return;
      }

      res.json({
        success: true,
        asteroid,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch asteroid details',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/asteroids/search
   * Search and filter endpoint
   */
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const { q, hazardous, minRisk, maxDistanceKm, sortBy } = req.query;
      const feedData = await NasaService.getFeed();
      let results = [...(feedData.asteroids || [])];

      // Query filter (Name or NASA ID)
      if (typeof q === 'string' && q.trim()) {
        const query = q.toLowerCase().trim();
        results = results.filter(
          (a) => a.name.toLowerCase().includes(query) || a.nasaId.includes(query)
        );
      }

      // Hazardous filter
      if (hazardous === 'true') {
        results = results.filter((a) => a.isPotentiallyHazardous);
      }

      // Min Risk filter
      if (typeof minRisk === 'string') {
        const minVal = parseFloat(minRisk);
        if (!isNaN(minVal)) {
          results = results.filter((a) => a.calculatedRiskScore >= minVal);
        }
      }

      // Max Distance filter (in km)
      if (typeof maxDistanceKm === 'string') {
        const maxDist = parseFloat(maxDistanceKm);
        if (!isNaN(maxDist)) {
          results = results.filter(
            (a) => (a.primaryCloseApproach?.missDistanceKilometers || 0) <= maxDist
          );
        }
      }

      // Sorting
      if (sortBy === 'risk_desc') {
        results.sort((a, b) => b.calculatedRiskScore - a.calculatedRiskScore);
      } else if (sortBy === 'distance_asc') {
        results.sort(
          (a, b) =>
            (a.primaryCloseApproach?.missDistanceKilometers || 0) -
            (b.primaryCloseApproach?.missDistanceKilometers || 0)
        );
      } else if (sortBy === 'diameter_desc') {
        results.sort(
          (a, b) =>
            (b.estimatedDiameter?.meters?.max || 0) - (a.estimatedDiameter?.meters?.max || 0)
        );
      } else if (sortBy === 'velocity_desc') {
        results.sort(
          (a, b) =>
            (b.primaryCloseApproach?.relativeVelocityKps || 0) -
            (a.primaryCloseApproach?.relativeVelocityKps || 0)
        );
      }

      res.json({
        success: true,
        count: results.length,
        results,
        isDemo: feedData.isDemo,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Search failed',
        error: error.message,
      });
    }
  }
}
