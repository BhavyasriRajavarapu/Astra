import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  ShieldAlert, 
  Clock, 
  Ruler, 
  Gauge, 
  Sparkles, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { formatDistance, formatVelocity, formatDiameter, getRiskBadgeClass, formatDateString } from '../lib/utils';

export const WatchlistPanel: React.FC = () => {
  const { watchlist, asteroids, preferences, toggleWatchlist, setSelectedAsteroid } = useAsteroid();

  const handleOpenAsteroid = (nasaId: string) => {
    const found = asteroids.find((a) => a.nasaId === nasaId);
    if (found) {
      setSelectedAsteroid(found);
    }
  };

  return (
    <div id="watchlist-section" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase font-mono tracking-widest mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Telemetry Bookmarks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-orbitron">
            Asteroid Watchlist
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Persisted monitoring list synchronized with your mission profile.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-space-900 border border-white/10 text-xs font-mono text-cyan-300 self-start sm:self-auto">
          {watchlist.length} Asteroid{watchlist.length === 1 ? '' : 's'} Monitored
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl border border-white/5 text-center max-w-md mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-space-900 flex items-center justify-center mx-auto mb-4 border border-slate-800">
            <Bookmark className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2 font-orbitron">Watchlist Empty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't bookmarked any Near-Earth Objects yet. Click the bookmark icon on any asteroid in the live feed to track its approach trajectory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {watchlist.map((item, idx) => {
            const riskBadge = getRiskBadgeClass(
              item.currentRiskScore >= 76 ? 'CRITICAL' : item.currentRiskScore >= 51 ? 'HIGH' : item.currentRiskScore >= 26 ? 'MODERATE' : 'LOW'
            );

            return (
              <motion.div
                key={item.nasaId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between glass-panel-hover group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-sans truncate max-w-[200px]">
                        {item.name}
                      </h4>
                      <div className="text-xs font-mono text-slate-400">
                        NASA ID: {item.nasaId}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleWatchlist({ nasaId: item.nasaId, name: item.name } as any)}
                      title="Remove from Watchlist"
                      className="p-2 rounded-xl bg-space-900/80 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 my-3">
                    {item.isPotentiallyHazardous ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/40">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Hazardous</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-space-900 text-slate-400 border border-slate-800">
                        <span>Standard NEO</span>
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                      Risk {item.currentRiskScore}/100
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono bg-space-900/60 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-slate-500 text-[11px]">Diameter</span>
                      <div className="font-semibold text-slate-200">
                        {formatDiameter(item.estimatedDiameterMeters, preferences.diameterUnit)}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Velocity</span>
                      <div className="font-semibold text-slate-200">
                        {formatVelocity(item.velocityKps, preferences.velocityUnit)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 text-[11px]">Next Close Pass</span>
                      <div className="font-semibold text-cyan-300">
                        {formatDateString(item.closeApproachDate)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    Saved: {formatDateString(item.createdAt)}
                  </span>

                  <button
                    onClick={() => handleOpenAsteroid(item.nasaId)}
                    className="px-3 py-1.5 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>View Telemetry</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
