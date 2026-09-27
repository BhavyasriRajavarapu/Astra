import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  IAsteroid, 
  IDashboardStats, 
  IWatchlistItem, 
  IUserPreferences, 
  INotificationItem 
} from '../types/asteroid';
import { asteroidApi } from '../services/api';
import { useAuth } from './AuthContext';

interface AsteroidContextType {
  asteroids: IAsteroid[];
  stats: IDashboardStats | null;
  upcomingTimeline: any[];
  watchlist: IWatchlistItem[];
  preferences: IUserPreferences;
  notifications: INotificationItem[];
  unreadNotificationCount: number;
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  source: string;
  lastUpdated: string;
  selectedDate: string;
  searchQuery: string;
  selectedHazardOnly: boolean;
  selectedRiskLevels: string[];
  selectedSort: string;
  selectedAsteroid: IAsteroid | null;
  setSelectedDate: (date: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedHazardOnly: (val: boolean) => void;
  setSelectedRiskLevels: (levels: string[]) => void;
  setSelectedSort: (sort: string) => void;
  setSelectedAsteroid: (asteroid: IAsteroid | null) => void;
  toggleWatchlist: (asteroid: IAsteroid) => Promise<void>;
  isInWatchlist: (nasaId: string) => boolean;
  updatePreferences: (newPrefs: Partial<IUserPreferences>) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  refreshData: () => Promise<void>;
}

const DEFAULT_PREFERENCES: IUserPreferences = {
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

const AsteroidContext = createContext<AsteroidContextType | undefined>(undefined);

export const AsteroidProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'anonymous-default-user';

  const [asteroids, setAsteroids] = useState<IAsteroid[]>([]);
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [upcomingTimeline, setUpcomingTimeline] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<IWatchlistItem[]>([]);
  const [preferences, setPreferences] = useState<IUserPreferences>({ ...DEFAULT_PREFERENCES, userId: currentUserId });
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [source, setSource] = useState<string>('nasa_live');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Filters state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHazardOnly, setSelectedHazardOnly] = useState<boolean>(false);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>('risk_desc');
  const [selectedAsteroid, setSelectedAsteroid] = useState<IAsteroid | null>(null);

  // Generate In-App Alerts based on asteroid risk and user thresholds
  const generateAlerts = useCallback((neoList: IAsteroid[], userPrefs: IUserPreferences) => {
    const alerts: INotificationItem[] = [];

    neoList.forEach((ast) => {
      if (ast.calculatedRiskScore >= userPrefs.alertThresholdRiskScore) {
        alerts.push({
          id: `alert-risk-${ast.nasaId}`,
          title: `HIGH RISK: ${ast.name}`,
          message: `Calculated Risk Score: ${ast.calculatedRiskScore}/100 (${ast.calculatedRiskLevel}). Miss Distance: ${(ast.primaryCloseApproach?.missDistanceKilometers ? ast.primaryCloseApproach.missDistanceKilometers / 1e6 : 0).toFixed(2)}M km.`,
          type: ast.calculatedRiskLevel,
          timestamp: new Date().toLocaleTimeString(),
          asteroidId: ast.nasaId,
          read: false,
        });
      } else if (ast.isPotentiallyHazardous && userPrefs.notifyOnHazardous) {
        alerts.push({
          id: `alert-haz-${ast.nasaId}`,
          title: `PHA DETECTED: ${ast.name}`,
          message: `Potentially Hazardous classification with diameter ~${Math.round(ast.estimatedDiameter?.meters?.estimatedAverage || 0)}m.`,
          type: 'HIGH',
          timestamp: new Date().toLocaleTimeString(),
          asteroidId: ast.nasaId,
          read: false,
        });
      }
    });

    if (alerts.length > 0) {
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = alerts.filter((a) => !existingIds.has(a.id));
        return [...newOnes, ...prev].slice(0, 20);
      });
    }
  }, []);

  // Fetch all primary telemetry
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Feed
      const feedRes = await asteroidApi.getFeed(selectedDate);
      if (feedRes && feedRes.asteroids) {
        setAsteroids(feedRes.asteroids);
        setIsDemo(feedRes.isDemo);
        setSource(feedRes.source);
        setLastUpdated(feedRes.lastUpdated || new Date().toISOString());

        generateAlerts(feedRes.asteroids, preferences);
      }

      // 2. Fetch Stats
      const statsRes = await asteroidApi.getStats();
      if (statsRes && statsRes.stats) {
        setStats(statsRes.stats);
      }

      // 3. Fetch Upcoming
      const upcomingRes = await asteroidApi.getUpcoming();
      if (upcomingRes && upcomingRes.timeline) {
        setUpcomingTimeline(upcomingRes.timeline);
      }

      // 4. Fetch Watchlist (Authenticated for current user)
      const watchlistRes = await asteroidApi.getWatchlist();
      if (watchlistRes && watchlistRes.items) {
        setWatchlist(watchlistRes.items);
      }

      // 5. Fetch Preferences
      const prefsRes = await asteroidApi.getPreferences();
      if (prefsRes && prefsRes.preferences) {
        setPreferences(prefsRes.preferences);
      }
    } catch (err: any) {
      console.warn('API fetch notice, setting fallback state:', err.message);
      setError(err.message || 'Error connecting to mission control API.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, currentUserId, generateAlerts, preferences]);

  // Refetch when user or selected date changes
  useEffect(() => {
    refreshData();
  }, [selectedDate, currentUserId]);

  // Auto-refresh interval
  useEffect(() => {
    if (!preferences.autoRefreshIntervalSeconds || preferences.autoRefreshIntervalSeconds <= 0) return;
    const interval = setInterval(() => {
      refreshData();
    }, preferences.autoRefreshIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [preferences.autoRefreshIntervalSeconds, refreshData]);

  // Watchlist Toggle
  const toggleWatchlist = async (asteroid: IAsteroid) => {
    const isSaved = watchlist.some((w) => w.nasaId === asteroid.nasaId);

    if (isSaved) {
      // Remove
      setWatchlist((prev) => prev.filter((w) => w.nasaId !== asteroid.nasaId));
      try {
        await asteroidApi.removeFromWatchlist(asteroid.nasaId);
      } catch (e) {
        console.warn('Watchlist remove API notice:', e);
      }
    } else {
      // Add
      const newItem: IWatchlistItem = {
        userId: currentUserId,
        nasaId: asteroid.nasaId,
        name: asteroid.name,
        isPotentiallyHazardous: asteroid.isPotentiallyHazardous,
        estimatedDiameterMeters: asteroid.estimatedDiameter?.meters?.estimatedAverage || 0,
        missDistanceKm: asteroid.primaryCloseApproach?.missDistanceKilometers || 0,
        velocityKps: asteroid.primaryCloseApproach?.relativeVelocityKps || 0,
        closeApproachDate: asteroid.primaryCloseApproach?.closeApproachDate || '',
        initialRiskScore: asteroid.calculatedRiskScore,
        currentRiskScore: asteroid.calculatedRiskScore,
        createdAt: new Date().toISOString(),
      };

      setWatchlist((prev) => [newItem, ...prev]);
      try {
        await asteroidApi.addToWatchlist(newItem);
      } catch (e) {
        console.warn('Watchlist add API notice:', e);
      }
    }
  };

  const isInWatchlist = (nasaId: string) => {
    return watchlist.some((w) => w.nasaId === nasaId);
  };

  const updatePreferences = async (newPrefs: Partial<IUserPreferences>) => {
    const merged = { ...preferences, ...newPrefs };
    setPreferences(merged);
    try {
      await asteroidApi.updatePreferences(merged);
    } catch (e) {
      console.warn('Preferences update notice:', e);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AsteroidContext.Provider
      value={{
        asteroids,
        stats,
        upcomingTimeline,
        watchlist,
        preferences,
        notifications,
        unreadNotificationCount,
        loading,
        error,
        isDemo,
        source,
        lastUpdated,
        selectedDate,
        searchQuery,
        selectedHazardOnly,
        selectedRiskLevels,
        selectedSort,
        selectedAsteroid,
        setSelectedDate,
        setSearchQuery,
        setSelectedHazardOnly,
        setSelectedRiskLevels,
        setSelectedSort,
        setSelectedAsteroid,
        toggleWatchlist,
        isInWatchlist,
        updatePreferences,
        markNotificationAsRead,
        clearNotifications,
        refreshData,
      }}
    >
      {children}
    </AsteroidContext.Provider>
  );
};

export const useAsteroid = () => {
  const context = useContext(AsteroidContext);
  if (!context) {
    throw new Error('useAsteroid must be used within an AsteroidProvider');
  }
  return context;
};
