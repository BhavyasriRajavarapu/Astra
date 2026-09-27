export interface ICloseApproach {
  closeApproachDate: string;
  closeApproachDateFull: string;
  epochDateCloseApproach: number;
  relativeVelocityKps: number;
  relativeVelocityKph: number;
  missDistanceAstronomical: number;
  missDistanceLunar: number;
  missDistanceKilometers: number;
  missDistanceMiles: number;
  orbitingBody: string;
}

export interface IRiskFactor {
  factor: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface IAsteroid {
  _id?: string;
  nasaId: string;
  name: string;
  designation?: string;
  nasaJplUrl?: string;
  absoluteMagnitudeH: number;
  isPotentiallyHazardous: boolean;
  isSentryObject: boolean;
  estimatedDiameter: {
    kilometers: { min: number; max: number; estimatedAverage: number };
    meters: { min: number; max: number; estimatedAverage: number };
    miles: { min: number; max: number; estimatedAverage: number };
    feet: { min: number; max: number; estimatedAverage: number };
  };
  closeApproaches: ICloseApproach[];
  primaryCloseApproach?: ICloseApproach;
  calculatedRiskScore: number;
  calculatedRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskFactors: IRiskFactor[];
  source: 'nasa_live' | 'nasa_cache' | 'demo_dataset';
  fetchedAt: string;
}

export interface IDashboardStats {
  totalObjects: number;
  hazardousCount: number;
  closeApproachesCount: number;
  highestRisk: {
    name: string;
    score: number;
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    id: string;
  };
  closestApproach: {
    name: string;
    missDistanceKm: number;
    missDistanceLunar: number;
    date: string;
    id: string;
  };
}

export interface IWatchlistItem {
  _id?: string;
  userId: string;
  nasaId: string;
  name: string;
  isPotentiallyHazardous: boolean;
  estimatedDiameterMeters: number;
  missDistanceKm: number;
  velocityKps: number;
  closeApproachDate: string;
  initialRiskScore: number;
  currentRiskScore: number;
  notes?: string;
  createdAt: string;
}

export interface IUserPreferences {
  userId: string;
  distanceUnit: 'km' | 'lunar' | 'au' | 'miles';
  velocityUnit: 'kps' | 'kph' | 'mph';
  diameterUnit: 'meters' | 'kilometers' | 'feet';
  alertThresholdRiskScore: number;
  notifyOnHazardous: boolean;
  notifyOnCloseApproach: boolean;
  autoRefreshIntervalSeconds: number;
  themePreference: 'deep-space' | 'nebula' | 'solar';
}

export interface INotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'INFO';
  timestamp: string;
  asteroidId?: string;
  read: boolean;
}
