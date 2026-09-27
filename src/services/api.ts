import axios from 'axios';
import { IAsteroid, IDashboardStats, IWatchlistItem, IUserPreferences } from '../types/asteroid';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Attach JWT token to requests automatically
api.interceptors.request.use((reqConfig) => {
  const token = localStorage.getItem('astra_auth_token');
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      token: string;
      user: { id: string; name: string; email: string; role: string; createdAt: string };
    }>('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      token: string;
      user: { id: string; name: string; email: string; role: string; createdAt: string };
    }>('/auth/login', data);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get<{
      success: boolean;
      user: { id: string; name: string; email: string; role: string; createdAt: string };
    }>('/auth/me');
    return res.data;
  },

  logout: async () => {
    const res = await api.post<{ success: boolean; message: string }>('/auth/logout');
    return res.data;
  },
};

export const asteroidApi = {
  // Feed
  getFeed: async (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const res = await api.get<{
      success: boolean;
      elementCount: number;
      asteroids: IAsteroid[];
      source: 'nasa_live' | 'nasa_cache' | 'demo_dataset';
      lastUpdated: string;
      isDemo: boolean;
    }>('/asteroids/feed', { params });
    return res.data;
  },

  // Stats
  getStats: async () => {
    const res = await api.get<{
      success: boolean;
      stats: IDashboardStats;
      source: string;
      isDemo: boolean;
      lastUpdated: string;
    }>('/asteroids/stats');
    return res.data;
  },

  // Upcoming Approaches
  getUpcoming: async () => {
    const res = await api.get<{
      success: boolean;
      count: number;
      timeline: any[];
      source: string;
      isDemo: boolean;
    }>('/asteroids/upcoming');
    return res.data;
  },

  // Asteroid Details
  getById: async (id: string) => {
    const res = await api.get<{
      success: boolean;
      asteroid: IAsteroid;
    }>(`/asteroids/${id}`);
    return res.data;
  },

  // Search & Filter
  search: async (params: {
    q?: string;
    hazardous?: boolean;
    minRisk?: number;
    maxDistanceKm?: number;
    sortBy?: string;
  }) => {
    const res = await api.get<{
      success: boolean;
      count: number;
      results: IAsteroid[];
      isDemo: boolean;
    }>('/asteroids/search', { params });
    return res.data;
  },

  // Watchlist (Authenticated & User-specific)
  getWatchlist: async () => {
    const res = await api.get<{
      success: boolean;
      count: number;
      items: IWatchlistItem[];
      storage: string;
      userId?: string;
    }>('/watchlist');
    return res.data;
  },

  addToWatchlist: async (item: Partial<IWatchlistItem>) => {
    const res = await api.post<{
      success: boolean;
      item: IWatchlistItem;
      storage: string;
    }>('/watchlist', item);
    return res.data;
  },

  removeFromWatchlist: async (nasaId: string) => {
    const res = await api.delete<{
      success: boolean;
      message: string;
    }>(`/watchlist/${nasaId}`);
    return res.data;
  },

  // User Preferences
  getPreferences: async () => {
    const res = await api.get<{
      success: boolean;
      preferences: IUserPreferences;
      storage: string;
    }>('/preferences');
    return res.data;
  },

  updatePreferences: async (prefs: Partial<IUserPreferences>) => {
    const res = await api.put<{
      success: boolean;
      preferences: IUserPreferences;
      storage: string;
    }>('/preferences', prefs);
    return res.data;
  },

  // Health check
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
};
