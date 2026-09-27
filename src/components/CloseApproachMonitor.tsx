import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Gauge, 
  Ruler, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle,
  ChevronRight,
  Orbit
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { formatDistance, formatVelocity, getRiskBadgeClass, formatDateString } from '../lib/utils';

export const CloseApproachMonitor: React.FC = () => {
  const { upcomingTimeline, loading, preferences, setSelectedAsteroid, asteroids } = useAsteroid();

  const handleOpenAsteroid = (id: string) => {
    const found = asteroids.find((a) => a.nasaId === id);
    if (found) setSelectedAsteroid(found);
  };

  return (
    <div id="approaches-section" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase font-mono tracking-widest mb-1">
            <Activity className="w-4 h-4" />
            <span>Chronological Trajectory Sequence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-orbitron">
            Close Approach Monitor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time orbital approach timeline tracking upcoming proximity windows to Earth.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-space-900 border border-white/10 text-xs font-mono text-cyan-300 self-start sm:self-auto">
          {upcomingTimeline.length} Encounters Scheduled
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-purple-500 before:to-space-800">
        {upcomingTimeline.map((item, idx) => {
          const riskBadge = getRiskBadgeClass(item.calculatedRiskLevel);
          const isSuperClose = item.missDistanceLunar <= 5;

          return (
            <motion.div
              key={`${item.asteroidId}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Animated Timeline Node */}
              <div 
                className={`absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isSuperClose 
                    ? 'bg-amber-400 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse'
                    : 'bg-space-950 border-cyan-400 group-hover:bg-cyan-400'
                }`} 
              />

              {/* Approach Entry Card */}
              <div 
                onClick={() => handleOpenAsteroid(item.asteroidId)}
                className={`glass-card p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSuperClose 
                    ? 'border-amber-500/40 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                    : 'border-white/5 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Approach Date & Asteroid Name */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-cyan-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateString(item.closeApproachDate)}
                      </span>
                      {item.closeApproachDateFull && (
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.closeApproachDateFull.split(' ')[1] || '00:00'} UTC
                        </span>
                      )}
                      {isSuperClose && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 animate-pulse">
                          CLOSE PASS (&lt;5 LD)
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.isPotentiallyHazardous && (
                        <span title="Potentially Hazardous">
                          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        </span>
                      )}
                    </h4>

                    <div className="text-xs text-slate-400 font-mono">
                      Target Body: <span className="text-slate-300">{item.orbitingBody || 'Earth'}</span> • Est. Diameter: <span className="text-slate-300">~{Math.round(item.estimatedDiameterMeters)}m</span>
                    </div>
                  </div>

                  {/* Middle: Metrics Pills */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <div className="bg-space-900/80 px-3 py-2 rounded-xl border border-white/5">
                      <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> Miss Clearance
                      </div>
                      <div className="text-slate-100 font-bold mt-0.5">
                        {formatDistance(item.missDistanceKilometers, preferences.distanceUnit)}
                      </div>
                      <div className="text-[10px] text-cyan-400">
                        {item.missDistanceLunar ? `${item.missDistanceLunar.toFixed(1)} Lunar Distances` : ''}
                      </div>
                    </div>

                    <div className="bg-space-900/80 px-3 py-2 rounded-xl border border-white/5">
                      <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Gauge className="w-3 h-3 text-purple-400" /> Relative Velocity
                      </div>
                      <div className="text-slate-100 font-bold mt-0.5">
                        {formatVelocity(item.relativeVelocityKps, preferences.velocityUnit)}
                      </div>
                      <div className="text-[10px] text-purple-400">
                        {(item.relativeVelocityKps * 3600).toFixed(0)} km/h
                      </div>
                    </div>
                  </div>

                  {/* Right: Risk Level & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Risk Level</div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                        {item.calculatedRiskScore}/100
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-space-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-space-950 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
