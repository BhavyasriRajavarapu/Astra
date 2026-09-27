import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Orbit, 
  ShieldAlert, 
  Bookmark, 
  ExternalLink, 
  Gauge, 
  Ruler, 
  Sparkles, 
  Calendar, 
  LayoutGrid, 
  List, 
  AlertTriangle,
  Info,
  Flame,
  Clock,
  RotateCcw,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { IAsteroid } from '../types/asteroid';
import { 
  formatDistance, 
  formatVelocity, 
  formatDiameter, 
  getRiskBadgeClass, 
  getRiskColorHex, 
  formatDateString 
} from '../lib/utils';

export const LiveAsteroidFeed: React.FC = () => {
  const { 
    asteroids, 
    loading, 
    error,
    searchQuery, 
    selectedHazardOnly, 
    selectedRiskLevels, 
    selectedSort,
    preferences, 
    toggleWatchlist, 
    isInWatchlist,
    setSelectedAsteroid,
    setSearchQuery,
    setSelectedHazardOnly,
    setSelectedRiskLevels,
    refreshData
  } = useAsteroid();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter & Sort
  const filteredAsteroids = asteroids.filter((ast) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = ast.name.toLowerCase().includes(q);
      const matchId = ast.nasaId.includes(q);
      if (!matchName && !matchId) return false;
    }

    // Hazardous filter
    if (selectedHazardOnly && !ast.isPotentiallyHazardous) {
      return false;
    }

    // Risk levels filter
    if (selectedRiskLevels.length > 0 && !selectedRiskLevels.includes(ast.calculatedRiskLevel)) {
      return false;
    }

    return true;
  });

  // Sort
  filteredAsteroids.sort((a, b) => {
    if (selectedSort === 'risk_desc') {
      return b.calculatedRiskScore - a.calculatedRiskScore;
    } else if (selectedSort === 'distance_asc') {
      return (a.primaryCloseApproach?.missDistanceKilometers || 0) - (b.primaryCloseApproach?.missDistanceKilometers || 0);
    } else if (selectedSort === 'diameter_desc') {
      return (b.estimatedDiameter?.meters?.estimatedAverage || 0) - (a.estimatedDiameter?.meters?.estimatedAverage || 0);
    } else if (selectedSort === 'velocity_desc') {
      return (b.primaryCloseApproach?.relativeVelocityKps || 0) - (a.primaryCloseApproach?.relativeVelocityKps || 0);
    } else if (selectedSort === 'date_asc') {
      const dateA = a.primaryCloseApproach?.closeApproachDate ? new Date(a.primaryCloseApproach.closeApproachDate).getTime() : 0;
      const dateB = b.primaryCloseApproach?.closeApproachDate ? new Date(b.primaryCloseApproach.closeApproachDate).getTime() : 0;
      return dateA - dateB;
    }
    return 0;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedHazardOnly(false);
    setSelectedRiskLevels([]);
  };

  // Loading Skeletons
  if (loading && asteroids.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="h-8 w-24 bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 animate-pulse h-72 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="w-36 h-5 bg-slate-800 rounded" />
                <div className="w-16 h-6 bg-slate-800 rounded-full" />
              </div>
              <div className="space-y-2 my-4">
                <div className="w-full h-3 bg-slate-800 rounded" />
                <div className="w-3/4 h-3 bg-slate-800 rounded" />
                <div className="w-1/2 h-3 bg-slate-800 rounded" />
              </div>
              <div className="w-full h-10 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error && asteroids.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl border border-red-500/30 text-center max-w-xl mx-auto my-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-orbitron">Telemetry Stream Interrupted</h3>
        <p className="text-xs text-slate-300 font-mono leading-relaxed">{error}</p>
        <button
          onClick={() => refreshData()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-xs font-mono transition-all cursor-pointer"
        >
          Reconnect to NASA NeoWs Feed
        </button>
      </div>
    );
  }

  // Empty Filter Results State
  if (filteredAsteroids.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl border border-white/10 text-center max-w-xl mx-auto my-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-space-900 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
          <Orbit className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <h3 className="text-xl font-bold text-white font-orbitron">No Matching Asteroids Found</h3>
        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          No Near-Earth Objects matched your active search query or filter criteria. Try adjusting your search query, risk filters, or observation date.
        </p>
        <button
          onClick={handleResetFilters}
          className="px-5 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs flex items-center gap-2 mx-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Active Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Bar with Counter and Grid/Table Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-orbitron flex items-center gap-2.5">
            <Orbit className="w-6 h-6 text-cyan-400" />
            <span>Monitored Near-Earth Encounters</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Displaying <span className="font-mono text-cyan-300 font-bold">{filteredAsteroids.length}</span> of <span className="font-mono text-slate-300">{asteroids.length}</span> telemetry records
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-space-900/90 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-space-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Card Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-space-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Telemetry Table</span>
          </button>
        </div>
      </div>

      {/* VIEW: CARDS GRID */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAsteroids.map((ast) => {
            const riskBadge = getRiskBadgeClass(ast.calculatedRiskLevel);
            const isSaved = isInWatchlist(ast.nasaId);
            const riskColor = getRiskColorHex(ast.calculatedRiskScore);
            const primaryCA = ast.primaryCloseApproach;

            return (
              <motion.div
                key={ast.nasaId}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between glass-panel-hover relative overflow-hidden group"
              >
                {/* Top Risk Color Strip */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: riskColor }}
                />

                <div>
                  {/* Top Bar: Title + Bookmark */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="truncate">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-sans truncate">
                        {ast.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        NASA NeoWs ID: {ast.nasaId}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleWatchlist(ast)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                        isSaved 
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(0,240,255,0.3)]' 
                          : 'bg-space-900 text-slate-400 border-slate-700 hover:text-cyan-300 hover:border-slate-600'
                      }`}
                      title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Badges: PHA & Risk Score */}
                  <div className="flex flex-wrap items-center justify-between gap-2 my-3">
                    <div className="flex items-center gap-1.5">
                      {ast.isPotentiallyHazardous ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                          <ShieldAlert className="w-3.5 h-3.5" /> PHA
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono px-2 py-0.5 rounded-full bg-space-900 border border-white/5">
                          Standard Orbit
                        </span>
                      )}

                      {ast.isSentryObject && (
                        <span className="text-[10px] text-purple-300 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 font-mono">
                          Sentry
                        </span>
                      )}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                      Risk {ast.calculatedRiskScore}/100
                    </span>
                  </div>

                  {/* Physical Parameters Grid */}
                  <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono bg-space-900/70 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Est. Diameter</span>
                      <div className="font-semibold text-slate-200 truncate">
                        {formatDiameter(ast.estimatedDiameter?.meters?.estimatedAverage || 0, preferences.diameterUnit)}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Rel. Velocity</span>
                      <div className="font-semibold text-slate-200 truncate">
                        {formatVelocity(primaryCA?.relativeVelocityKps || 0, preferences.velocityUnit)}
                      </div>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Miss Clearance</span>
                        <div className="font-bold text-cyan-300">
                          {formatDistance(primaryCA?.missDistanceKilometers || 0, preferences.distanceUnit)}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">Lunar Distance</span>
                        <div className="font-semibold text-amber-300">
                          {primaryCA?.missDistanceLunar ? `${primaryCA.missDistanceLunar.toFixed(1)} LD` : '—'}
                        </div>
                      </div>
                    </div>

                    {primaryCA?.closeApproachDate && (
                      <div className="col-span-2 pt-1 border-t border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Approach Date:</span>
                        <span className="text-slate-300 font-medium">
                          {formatDateString(primaryCA.closeApproachDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inspect Action */}
                <button
                  onClick={() => setSelectedAsteroid(ast)}
                  className="w-full py-2.5 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer"
                >
                  <span>Inspect Orbital Vectors</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* VIEW: TELEMETRY TABLE */
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-space-950/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-space-900/90 text-slate-300 uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="p-4">Target Name / NASA ID</th>
                  <th className="p-4">Risk Index</th>
                  <th className="p-4">PHA Status</th>
                  <th className="p-4">Est. Diameter</th>
                  <th className="p-4">Relative Velocity</th>
                  <th className="p-4">Miss Distance</th>
                  <th className="p-4">Approach Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filteredAsteroids.map((ast) => {
                  const riskBadge = getRiskBadgeClass(ast.calculatedRiskLevel);
                  const isSaved = isInWatchlist(ast.nasaId);
                  const primaryCA = ast.primaryCloseApproach;

                  return (
                    <tr
                      key={ast.nasaId}
                      className="hover:bg-space-900/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedAsteroid(ast)}
                    >
                      <td className="p-4 font-sans font-bold text-white group-hover:text-cyan-300 transition-colors">
                        <div>{ast.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {ast.nasaId}</div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                          {ast.calculatedRiskScore}/100
                        </span>
                      </td>

                      <td className="p-4">
                        {ast.isPotentiallyHazardous ? (
                          <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> PHA
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>

                      <td className="p-4 font-semibold text-slate-200">
                        {formatDiameter(ast.estimatedDiameter?.meters?.estimatedAverage || 0, preferences.diameterUnit)}
                      </td>

                      <td className="p-4 font-semibold text-slate-200">
                        {formatVelocity(primaryCA?.relativeVelocityKps || 0, preferences.velocityUnit)}
                      </td>

                      <td className="p-4 text-cyan-300 font-bold">
                        <div>{formatDistance(primaryCA?.missDistanceKilometers || 0, preferences.distanceUnit)}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {primaryCA?.missDistanceLunar ? `${primaryCA.missDistanceLunar.toFixed(1)} LD` : ''}
                        </div>
                      </td>

                      <td className="p-4 text-slate-300">
                        {formatDateString(primaryCA?.closeApproachDate || '')}
                      </td>

                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleWatchlist(ast)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isSaved 
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60' 
                                : 'bg-space-900 text-slate-400 border-slate-700 hover:text-cyan-300'
                            }`}
                            title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            onClick={() => setSelectedAsteroid(ast)}
                            className="px-2.5 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default LiveAsteroidFeed;
