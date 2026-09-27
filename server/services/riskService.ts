import { config } from '../config/config.js';
import { IRiskFactor } from '../models/Asteroid.js';

export interface CalculatedRisk {
  score: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors: IRiskFactor[];
  weightsUsed: typeof config.riskWeights;
}

/**
 * Transparent Normalized Asteroid Risk Scoring System
 * 
 * DISCLAIMER: This is an educational software risk indicator for comparative
 * risk visualization based on NASA NeoWs metrics. It is NOT an official NASA
 * impact prediction or scientific collision probability.
 */
export function calculateAsteroidRisk(
  missDistanceLunar: number,
  missDistanceKm: number,
  maxDiameterMeters: number,
  velocityKps: number,
  isPotentiallyHazardous: boolean
): CalculatedRisk {
  const weights = config.riskWeights;
  const factors: IRiskFactor[] = [];

  // 1. Miss Distance Factor (Max: weights.missDistance)
  let distanceScore = 0;
  let distanceDesc = '';

  if (missDistanceLunar <= 0.2) {
    distanceScore = weights.missDistance;
    distanceDesc = `Extreme proximity (<0.2 Lunar Distances / ${(missDistanceKm / 1000).toFixed(0)}k km)`;
  } else if (missDistanceLunar <= 1.0) {
    distanceScore = weights.missDistance * 0.9;
    distanceDesc = `Inside lunar orbit (<1.0 LD / ${(missDistanceKm / 1000).toFixed(0)}k km)`;
  } else if (missDistanceLunar <= 5.0) {
    distanceScore = weights.missDistance * 0.7;
    distanceDesc = `Close proximity (<5.0 LD / ${(missDistanceKm / 1e6).toFixed(2)}M km)`;
  } else if (missDistanceLunar <= 10.0) {
    distanceScore = weights.missDistance * 0.45;
    distanceDesc = `Moderate approach distance (<10.0 LD / ${(missDistanceKm / 1e6).toFixed(2)}M km)`;
  } else if (missDistanceLunar <= 20.0) {
    distanceScore = weights.missDistance * 0.25;
    distanceDesc = `Approaching within 20 Lunar Distances (${(missDistanceKm / 1e6).toFixed(2)}M km)`;
  } else {
    distanceScore = Math.max(1, Math.round(weights.missDistance * (20 / Math.max(20, missDistanceLunar))));
    distanceDesc = `Safe orbital clearance (${(missDistanceKm / 1e6).toFixed(2)}M km / ${missDistanceLunar.toFixed(1)} LD)`;
  }

  distanceScore = Math.min(weights.missDistance, Math.round(distanceScore * 10) / 10);
  factors.push({
    factor: 'Miss Distance Proximity',
    score: distanceScore,
    maxScore: weights.missDistance,
    description: distanceDesc,
  });

  // 2. Estimated Diameter Factor (Max: weights.diameter)
  let diameterScore = 0;
  let diameterDesc = '';

  if (maxDiameterMeters >= 1000) {
    diameterScore = weights.diameter;
    diameterDesc = `Major asteroid size (>1 km diameter: ${Math.round(maxDiameterMeters)}m)`;
  } else if (maxDiameterMeters >= 300) {
    diameterScore = weights.diameter * 0.8;
    diameterDesc = `Large city-scale diameter (${Math.round(maxDiameterMeters)}m)`;
  } else if (maxDiameterMeters >= 140) {
    diameterScore = weights.diameter * 0.6;
    diameterDesc = `Meets NASA PHA threshold (${Math.round(maxDiameterMeters)}m >= 140m)`;
  } else if (maxDiameterMeters >= 50) {
    diameterScore = weights.diameter * 0.35;
    diameterDesc = `Medium asteroid diameter (${Math.round(maxDiameterMeters)}m)`;
  } else {
    diameterScore = Math.max(1, weights.diameter * 0.15);
    diameterDesc = `Small meteoroid/asteroid (<50m: ${Math.round(maxDiameterMeters)}m)`;
  }

  diameterScore = Math.min(weights.diameter, Math.round(diameterScore * 10) / 10);
  factors.push({
    factor: 'Estimated Diameter & Mass',
    score: diameterScore,
    maxScore: weights.diameter,
    description: diameterDesc,
  });

  // 3. Relative Velocity Factor (Max: weights.velocity)
  let velocityScore = 0;
  let velocityDesc = '';

  if (velocityKps >= 30) {
    velocityScore = weights.velocity;
    velocityDesc = `Hyper-velocity trajectory (${velocityKps.toFixed(1)} km/s / ${(velocityKps * 3600).toFixed(0)} km/h)`;
  } else if (velocityKps >= 20) {
    velocityScore = weights.velocity * 0.75;
    velocityDesc = `High relative velocity (${velocityKps.toFixed(1)} km/s)`;
  } else if (velocityKps >= 12) {
    velocityScore = weights.velocity * 0.5;
    velocityDesc = `Standard NEO velocity (${velocityKps.toFixed(1)} km/s)`;
  } else {
    velocityScore = Math.max(1, weights.velocity * 0.25);
    velocityDesc = `Low relative speed (${velocityKps.toFixed(1)} km/s)`;
  }

  velocityScore = Math.min(weights.velocity, Math.round(velocityScore * 10) / 10);
  factors.push({
    factor: 'Relative Velocity',
    score: velocityScore,
    maxScore: weights.velocity,
    description: velocityDesc,
  });

  // 4. NASA Hazardous Classification Factor (Max: weights.hazardous)
  let hazardScore = 0;
  let hazardDesc = '';

  if (isPotentiallyHazardous) {
    hazardScore = weights.hazardous;
    hazardDesc = 'Formally classified as Potentially Hazardous Asteroid (PHA) by NASA';
  } else {
    hazardScore = 0;
    hazardDesc = 'Non-hazardous standard Near-Earth Object classification';
  }

  factors.push({
    factor: 'NASA PHA Classification',
    score: hazardScore,
    maxScore: weights.hazardous,
    description: hazardDesc,
  });

  // Total Score Calculation (Clamped 0 - 100)
  const totalScore = Math.min(100, Math.max(0, Math.round(distanceScore + diameterScore + velocityScore + hazardScore)));

  // Risk Level Assignment
  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (totalScore >= 76) {
    level = 'CRITICAL';
  } else if (totalScore >= 51) {
    level = 'HIGH';
  } else if (totalScore >= 26) {
    level = 'MODERATE';
  } else {
    level = 'LOW';
  }

  return {
    score: totalScore,
    level,
    factors,
    weightsUsed: weights,
  };
}
