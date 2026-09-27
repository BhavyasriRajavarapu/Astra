import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(km: number, unit: 'km' | 'lunar' | 'au' | 'miles' = 'km'): string {
  if (isNaN(km)) return 'N/A';

  switch (unit) {
    case 'lunar': {
      const ld = km / 384400;
      return `${ld.toFixed(2)} LD`;
    }
    case 'au': {
      const au = km / 149597870.7;
      return `${au.toFixed(4)} AU`;
    }
    case 'miles': {
      const miles = km * 0.621371;
      if (miles >= 1e6) {
        return `${(miles / 1e6).toFixed(2)}M mi`;
      }
      return `${Math.round(miles).toLocaleString()} mi`;
    }
    case 'km':
    default: {
      if (km >= 1e6) {
        return `${(km / 1e6).toFixed(2)}M km`;
      } else if (km >= 1e3) {
        return `${(km / 1e3).toFixed(1)}k km`;
      }
      return `${Math.round(km).toLocaleString()} km`;
    }
  }
}

export function formatVelocity(kps: number, unit: 'kps' | 'kph' | 'mph' = 'kps'): string {
  if (isNaN(kps)) return 'N/A';

  switch (unit) {
    case 'kph':
      return `${Math.round(kps * 3600).toLocaleString()} km/h`;
    case 'mph':
      return `${Math.round(kps * 2236.94).toLocaleString()} mph`;
    case 'kps':
    default:
      return `${kps.toFixed(2)} km/s`;
  }
}

export function formatDiameter(meters: number, unit: 'meters' | 'kilometers' | 'feet' = 'meters'): string {
  if (isNaN(meters)) return 'N/A';

  switch (unit) {
    case 'kilometers':
      return `${(meters / 1000).toFixed(3)} km`;
    case 'feet':
      return `${Math.round(meters * 3.28084).toLocaleString()} ft`;
    case 'meters':
    default:
      if (meters >= 1000) {
        return `${(meters / 1000).toFixed(2)} km (~${Math.round(meters)}m)`;
      }
      return `~${Math.round(meters)} m`;
  }
}

export function getRiskBadgeClass(level: string): { bg: string; text: string; border: string; glow: string } {
  switch (level?.toUpperCase()) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-950/80',
        text: 'text-red-400',
        border: 'border-red-500/50',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-950/80',
        text: 'text-orange-400',
        border: 'border-orange-500/50',
        glow: 'shadow-[0_0_12px_rgba(249,115,22,0.4)]',
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-950/80',
        text: 'text-amber-400',
        border: 'border-amber-500/50',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-950/80',
        text: 'text-emerald-400',
        border: 'border-emerald-500/50',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      };
  }
}

export function getRiskColorHex(score: number): string {
  if (score >= 76) return '#ef4444'; // red
  if (score >= 51) return '#f97316'; // orange
  if (score >= 26) return '#f59e0b'; // amber
  return '#10b981'; // emerald
}

export function formatDateString(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
