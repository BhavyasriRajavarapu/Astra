import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlist extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlist>({
  userId: { type: String, default: 'anonymous-default-user', index: true },
  nasaId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  isPotentiallyHazardous: { type: Boolean, default: false },
  estimatedDiameterMeters: { type: Number, default: 0 },
  missDistanceKm: { type: Number, default: 0 },
  velocityKps: { type: Number, default: 0 },
  closeApproachDate: { type: String, default: '' },
  initialRiskScore: { type: Number, default: 0 },
  currentRiskScore: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, {
  timestamps: true,
});

WatchlistSchema.index({ userId: 1, nasaId: 1 }, { unique: true });

export const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
