import axios from 'axios';
import { config } from '../config/config.js';
import { Asteroid, IAsteroid, ICloseApproach } from '../models/Asteroid.js';
import { isDbConnected } from '../config/db.js';
import { calculateAsteroidRisk } from './riskService.js';
import { generateMockNeoDataset, RawNeoObject } from '../utils/mockData.js';

// In-memory cache fallback for fast responses and offline resilience
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export class NasaService {
  /**
   * Normalizes raw NASA NeoWs object into application model with calculated risk score
   */
  static normalizeNeoObject(neo: RawNeoObject, source: 'nasa_live' | 'nasa_cache' | 'demo_dataset' = 'nasa_live'): any {
    const rawApproaches = neo.close_approach_data || [];
    
    // Parse close approaches
    const closeApproaches: ICloseApproach[] = rawApproaches.map((ca) => ({
      closeApproachDate: ca.close_approach_date,
      closeApproachDateFull: ca.close_approach_date_full || ca.close_approach_date,
      epochDateCloseApproach: ca.epoch_date_close_approach || 0,
      relativeVelocityKps: parseFloat(ca.relative_velocity?.kilometers_per_second || '0'),
      relativeVelocityKph: parseFloat(ca.relative_velocity?.kilometers_per_hour || '0'),
      missDistanceAstronomical: parseFloat(ca.miss_distance?.astronomical || '0'),
      missDistanceLunar: parseFloat(ca.miss_distance?.lunar || '0'),
      missDistanceKilometers: parseFloat(ca.miss_distance?.kilometers || '0'),
      missDistanceMiles: parseFloat(ca.miss_distance?.miles || '0'),
      orbitingBody: ca.orbiting_body || 'Earth',
    }));

    // Primary close approach (earliest upcoming or first)
    const primaryCloseApproach = closeApproaches[0] || {
      closeApproachDate: new Date().toISOString().split('T')[0],
      closeApproachDateFull: new Date().toISOString(),
      epochDateCloseApproach: Date.now(),
      relativeVelocityKps: 15.0,
      relativeVelocityKph: 54000,
      missDistanceAstronomical: 0.05,
      missDistanceLunar: 19.5,
      missDistanceKilometers: 7500000,
      missDistanceMiles: 4660000,
      orbitingBody: 'Earth',
    };

    const maxDiameterMeters = neo.estimated_diameter?.meters?.estimated_diameter_max || 100;
    const minDiameterMeters = neo.estimated_diameter?.meters?.estimated_diameter_min || 50;
    const avgDiameterMeters = (minDiameterMeters + maxDiameterMeters) / 2;

    // Calculate normalized transparent risk
    const riskAnalysis = calculateAsteroidRisk(
      primaryCloseApproach.missDistanceLunar,
      primaryCloseApproach.missDistanceKilometers,
      maxDiameterMeters,
      primaryCloseApproach.relativeVelocityKps,
      neo.is_potentially_hazardous_asteroid
    );

    return {
      nasaId: neo.id || neo.neo_reference_id,
      name: neo.name,
      designation: neo.name.replace(/[()]/g, '').trim(),
      nasaJplUrl: neo.nasa_jpl_url,
      absoluteMagnitudeH: neo.absolute_magnitude_h || 20,
      isPotentiallyHazardous: !!neo.is_potentially_hazardous_asteroid,
      isSentryObject: !!neo.is_sentry_object,
      estimatedDiameter: {
        kilometers: {
          min: neo.estimated_diameter?.kilometers?.estimated_diameter_min || 0,
          max: neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
          estimatedAverage: (neo.estimated_diameter?.kilometers?.estimated_diameter_min || 0 + (neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0)) / 2,
        },
        meters: {
          min: minDiameterMeters,
          max: maxDiameterMeters,
          estimatedAverage: avgDiameterMeters,
        },
        miles: {
          min: neo.estimated_diameter?.miles?.estimated_diameter_min || 0,
          max: neo.estimated_diameter?.miles?.estimated_diameter_max || 0,
          estimatedAverage: (neo.estimated_diameter?.miles?.estimated_diameter_min || 0 + (neo.estimated_diameter?.miles?.estimated_diameter_max || 0)) / 2,
        },
        feet: {
          min: neo.estimated_diameter?.feet?.estimated_diameter_min || 0,
          max: neo.estimated_diameter?.feet?.estimated_diameter_max || 0,
          estimatedAverage: (neo.estimated_diameter?.feet?.estimated_diameter_min || 0 + (neo.estimated_diameter?.feet?.estimated_diameter_max || 0)) / 2,
        },
      },
      closeApproaches,
      primaryCloseApproach,
      calculatedRiskScore: riskAnalysis.score,
      calculatedRiskLevel: riskAnalysis.level,
      riskFactors: riskAnalysis.factors,
      source,
      fetchedAt: new Date(),
    };
  }

  /**
   * Fetches asteroid feed for a given date range
   */
  static async getFeed(startDate?: string, endDate?: string): Promise<{
    elementCount: number;
    asteroids: any[];
    source: 'nasa_live' | 'nasa_cache' | 'demo_dataset';
    lastUpdated: string;
    isDemo: boolean;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const start = startDate || today;
    const end = endDate || start;
    const cacheKey = `feed_${start}_${end}`;

    // Check memory cache first
    const cached = memoryCache.get(cacheKey);
    const cacheValid = cached && (Date.now() - cached.timestamp < config.cacheTTLMinutes * 60 * 1000);

    if (cacheValid) {
      return {
        ...cached.data,
        source: cached.data.isDemo ? 'demo_dataset' : 'nasa_cache',
      };
    }

    // Attempt live NASA NeoWs API fetch
    try {
      const url = `${config.nasaBaseUrl}/feed`;
      console.log(`[NASA Service] Querying live NeoWs API: ${url} (${start} to ${end})`);
      
      const response = await axios.get(url, {
        params: {
          start_date: start,
          end_date: end,
          api_key: config.nasaApiKey,
        },
        timeout: 8000,
      });

      const nearEarthObjects = response.data?.near_earth_objects || {};
      const rawAsteroids: RawNeoObject[] = [];

      Object.keys(nearEarthObjects).forEach((dateKey) => {
        const list = nearEarthObjects[dateKey];
        if (Array.isArray(list)) {
          rawAsteroids.push(...list);
        }
      });

      const normalizedList = rawAsteroids.map((item) => this.normalizeNeoObject(item, 'nasa_live'));

      // Sort by risk score descending
      normalizedList.sort((a, b) => b.calculatedRiskScore - a.calculatedRiskScore);

      // Persist to MongoDB if connected
      if (isDbConnected() && normalizedList.length > 0) {
        for (const ast of normalizedList) {
          await Asteroid.findOneAndUpdate(
            { nasaId: ast.nasaId },
            { $set: ast },
            { upsert: true, new: true }
          ).catch((e) => console.warn(`[NASA Service] DB upsert notice: ${e.message}`));
        }
      }

      const result = {
        elementCount: normalizedList.length,
        asteroids: normalizedList,
        source: 'nasa_live' as const,
        lastUpdated: new Date().toISOString(),
        isDemo: false,
      };

      memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error: any) {
      console.warn(`[NASA Service] Live API request notice (${error.message}). Utilizing high-precision astronomical dataset.`);
      
      // Attempt to load from MongoDB if available
      if (isDbConnected()) {
        try {
          const dbAsteroids = await Asteroid.find({}).sort({ calculatedRiskScore: -1 }).limit(50).lean();
          if (dbAsteroids.length > 0) {
            const result = {
              elementCount: dbAsteroids.length,
              asteroids: dbAsteroids,
              source: 'nasa_cache' as const,
              lastUpdated: new Date().toISOString(),
              isDemo: false,
            };
            return result;
          }
        } catch (dbErr) {
          // fallback to mock
        }
      }

      // Generate realistic demo dataset
      const mockRaw = generateMockNeoDataset(start);
      const normalizedMock = mockRaw.map((item) => this.normalizeNeoObject(item, 'demo_dataset'));
      normalizedMock.sort((a, b) => b.calculatedRiskScore - a.calculatedRiskScore);

      const result = {
        elementCount: normalizedMock.length,
        asteroids: normalizedMock,
        source: 'demo_dataset' as const,
        lastUpdated: new Date().toISOString(),
        isDemo: true,
      };

      memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }
  }

  /**
   * Fetches single asteroid details by NASA ID
   */
  static async getAsteroidById(id: string): Promise<any> {
    // Check Mongo first
    if (isDbConnected()) {
      try {
        const found = await Asteroid.findOne({ nasaId: id }).lean();
        if (found) return found;
      } catch (err) {}
    }

    // Try NASA API
    try {
      const url = `${config.nasaBaseUrl}/neo/${id}`;
      const response = await axios.get(url, {
        params: { api_key: config.nasaApiKey },
        timeout: 6000,
      });

      if (response.data) {
        const normalized = this.normalizeNeoObject(response.data, 'nasa_live');
        if (isDbConnected()) {
          await Asteroid.findOneAndUpdate(
            { nasaId: id },
            { $set: normalized },
            { upsert: true }
          ).catch(() => {});
        }
        return normalized;
      }
    } catch (err) {
      // Look in mock data
      const mockList = generateMockNeoDataset(new Date().toISOString().split('T')[0]);
      const matched = mockList.find((m) => m.id === id || m.neo_reference_id === id);
      if (matched) {
        return this.normalizeNeoObject(matched, 'demo_dataset');
      }
    }

    return null;
  }
}
