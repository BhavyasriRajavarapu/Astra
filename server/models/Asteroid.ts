import mongoose, { Schema, Document } from 'mongoose';

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

export interface IAsteroid extends Document {
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
  fetchedAt: Date;
  updatedAt: Date;
}

const CloseApproachSchema = new Schema<ICloseApproach>({
  closeApproachDate: { type: String, required: true },
  closeApproachDateFull: { type: String },
  epochDateCloseApproach: { type: Number },
  relativeVelocityKps: { type: Number, required: true },
  relativeVelocityKph: { type: Number },
  missDistanceAstronomical: { type: Number },
  missDistanceLunar: { type: Number, required: true },
  missDistanceKilometers: { type: Number, required: true },
  missDistanceMiles: { type: Number },
  orbitingBody: { type: String, default: 'Earth' },
}, { _id: false });

const RiskFactorSchema = new Schema<IRiskFactor>({
  factor: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  description: { type: String, required: true },
}, { _id: false });

const AsteroidSchema = new Schema<IAsteroid>({
  nasaId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  designation: { type: String },
  nasaJplUrl: { type: String },
  absoluteMagnitudeH: { type: Number, required: true },
  isPotentiallyHazardous: { type: Boolean, required: true, index: true },
  isSentryObject: { type: Boolean, default: false },
  estimatedDiameter: {
    kilometers: {
      min: { type: Number },
      max: { type: Number },
      estimatedAverage: { type: Number },
    },
    meters: {
      min: { type: Number },
      max: { type: Number },
      estimatedAverage: { type: Number },
    },
    miles: {
      min: { type: Number },
      max: { type: Number },
      estimatedAverage: { type: Number },
    },
    feet: {
      min: { type: Number },
      max: { type: Number },
      estimatedAverage: { type: Number },
    },
  },
  closeApproaches: [CloseApproachSchema],
  primaryCloseApproach: CloseApproachSchema,
  calculatedRiskScore: { type: Number, required: true, index: true },
  calculatedRiskLevel: { 
    type: String, 
    enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
    required: true,
    index: true 
  },
  riskFactors: [RiskFactorSchema],
  source: { type: String, enum: ['nasa_live', 'nasa_cache', 'demo_dataset'], default: 'nasa_live' },
  fetchedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Composite indexes for fast query performance
AsteroidSchema.index({ 'primaryCloseApproach.closeApproachDate': 1, calculatedRiskScore: -1 });
AsteroidSchema.index({ isPotentiallyHazardous: 1, calculatedRiskScore: -1 });

export const Asteroid = mongoose.model<IAsteroid>('Asteroid', AsteroidSchema);
