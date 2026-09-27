import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreference extends Document {
  userId: string;
  distanceUnit: 'km' | 'lunar' | 'au' | 'miles';
  velocityUnit: 'kps' | 'kph' | 'mph';
  diameterUnit: 'meters' | 'kilometers' | 'feet';
  alertThresholdRiskScore: number;
  notifyOnHazardous: boolean;
  notifyOnCloseApproach: boolean;
  autoRefreshIntervalSeconds: number;
  themePreference: 'deep-space' | 'nebula' | 'solar';
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferenceSchema = new Schema<IUserPreference>({
  userId: { type: String, default: 'anonymous-default-user', unique: true, index: true },
  distanceUnit: { type: String, enum: ['km', 'lunar', 'au', 'miles'], default: 'km' },
  velocityUnit: { type: String, enum: ['kps', 'kph', 'mph'], default: 'kps' },
  diameterUnit: { type: String, enum: ['meters', 'kilometers', 'feet'], default: 'meters' },
  alertThresholdRiskScore: { type: Number, default: 50 },
  notifyOnHazardous: { type: Boolean, default: true },
  notifyOnCloseApproach: { type: Boolean, default: true },
  autoRefreshIntervalSeconds: { type: Number, default: 60 },
  themePreference: { type: String, enum: ['deep-space', 'nebula', 'solar'], default: 'deep-space' },
}, {
  timestamps: true,
});

export const UserPreference = mongoose.model<IUserPreference>('UserPreference', UserPreferenceSchema);
