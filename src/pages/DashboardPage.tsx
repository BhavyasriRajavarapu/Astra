import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Telescope, 
  Orbit, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Bookmark, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ExternalLink,
  ChevronRight,
  User as UserIcon,
  Compass,
  AlertTriangle,
  RotateCw,
  Database,
  Radio,
  BarChart3,
  Layers,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAsteroid } from '../context/AsteroidContext';
import { MetricCards } from '../components/MetricCards';
import { RiskVisualizations } from '../components/RiskVisualizations';
import { 
  formatDistance, 
  formatVelocity, 
  formatDiameter, 
  getRiskBadgeClass, 
  getRiskColorHex, 
  formatDateString 
} from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    asteroids, 
    upcomingTimeline, 
    watchlist, 
    preferences, 
    isDemo, 
    lastUpdated, 
    loading,
    error,
    refreshData,
    setSelectedAsteroid,
    toggleWatchlist,
    isInWatchlist
  } = useAsteroid();

  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await refreshData();
    setTimeout(() => setIsSyncing(false), 600);
  };

  const recentAsteroids = asteroids.slice(0, 4);
  const nextApproaches = upcomingTimeline.slice(0, 4);

  // Quick navigation shortcuts
  const navigationShortcuts = [
    {
      title: 'Asteroid Feed',
      subtitle: `${asteroids.length} Monitored NEOs`,
      description: 'Live ephemerides & search filters',
      path: '/asteroids',
      icon: Orbit,
      iconColor: 'text-cyan-400',
      borderColor: 'hover:border-cyan-500/40',
      badge: `${asteroids.length} Live`,
    },
    {
      title: 'Risk Monitor',
      subtitle: 'Predictor & Visualizations',
      description: 'Transparent 0–100 risk decomposition',
      path: '/risk',
      icon: Flame,
      iconColor: 'text-orange-400',
      borderColor: 'hover:border-orange-500/40',
      badge: '4 Factors',
    },
    {
      title: 'Close Approaches',
      subtitle: `${upcomingTimeline.length} Encounters`,
      description: 'Chronological Earth pass sequence',
      path: '/close-approaches',
      icon: Activity,
      iconColor: 'text-purple-400',
      borderColor: 'hover:border-purple-500/40',
      badge: 'Flybys',
    },
    {
      title: 'Mission Watchlist',
      subtitle: `${watchlist.length} Saved Targets`,
      description: 'Isolated commander telemetry store',
      path: '/watchlist',
      icon: Bookmark,
      iconColor: 'text-amber-400',
      borderColor: 'hover:border-amber-500/40',
      badge: `${watchlist.length} Saved`,
    },
  ];

  return (
    <div className="space-y-10">
      
      {/* SECTION: MISSION CONTROL COMMAND CENTER HEADER */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/15 bg-gradient-to-r from-space-950 via-space-900 to-space-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Commander Welcome & System Briefing */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <Telescope className="w-3.5 h-3.5 text-cyan-400" />
              <span>MISSION CONTROL • PLANETARY DEFENSE OBSERVATORY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-orbitron tracking-tight">
              Commander <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">{user?.name || 'Explorer'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Real-time Near-Earth Object orbital telemetry and transparent relative risk indexes powered directly by official NASA NeoWs data feeds.
            </p>
          </div>

          {/* Right: Telemetry Live Status Indicators & Refresh */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            
            {/* Live Feed Status Badge */}
            <div className="px-4 py-2.5 rounded-2xl glass-card border border-white/10 flex items-center gap-2.5 bg-space-900/80">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDemo ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDemo ? 'bg-amber-500' : 'bg-emerald-400'}`} />
              </span>
              <div>
                <span className="text-slate-400 text-[10px] block">DATA STREAM</span>
                <span className={`font-bold ${isDemo ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isDemo ? 'DEMO DATA' : 'NASA NeoWs LIVE'}
                </span>
              </div>
            </div>

            {/* Sync Button */}
            <button
              onClick={handleManualSync}
              disabled={loading || isSyncing}
              className="px-4 py-2.5 rounded-2xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              title="Sync Telemetry from NASA NeoWs"
            >
              <RotateCw className={`w-4 h-4 ${isSyncing || loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Telemetry'}</span>
            </button>

          </div>
        </div>

        {/* Telemetry metadata footer */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Live Stream Active'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">
              Units: <strong className="text-slate-200">{preferences.distanceUnit.toUpperCase()}</strong> / <strong className="text-slate-200">{preferences.velocityUnit.toUpperCase()}</strong>
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Risk Alert Threshold: <strong className="text-cyan-300">{preferences.alertThresholdRiskScore}/100</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ERROR ALERT BANNER (If any) */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => refreshData()}
            className="px-3 py-1.5 rounded-xl bg-red-900/80 hover:bg-red-800 text-white font-bold text-xs cursor-pointer shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* SECTION: 5 KEY TELEMETRY METRIC CARDS */}
      <section className="space-y-2">
        <MetricCards />
      </section>

      {/* SECTION: QUICK MISSION CONTROL NAVIGATION SHORTCUTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-orbitron flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Mission Operations Navigation</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Direct clearance shortcuts across the Astra telemetry modules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {navigationShortcuts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`glass-card p-5 rounded-2xl border border-white/10 hover:bg-space-900/80 transition-all duration-300 group flex flex-col justify-between ${item.borderColor}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-space-900/90 border border-white/10 group-hover:scale-110 transition-transform">
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-space-800/90 text-cyan-300 border border-white/10 font-mono text-[10px]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-orbitron font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 mt-0.5">{item.subtitle}</div>
                  <p className="text-xs text-slate-400 mt-2 font-light">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300 font-mono">
                  <span>Enter Module</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION: LIVE ASTEROID FEED PREVIEW */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-orbitron flex items-center gap-2">
              <Orbit className="w-5 h-5 text-cyan-400" />
              <span>Recent Near-Earth Encounters</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Most recent close passes and calculated relative risk indices</p>
          </div>

          <Link
            to="/asteroids"
            className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <span>Explore All Asteroids ({asteroids.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid of Recent Asteroids */}
        {loading && asteroids.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-5 rounded-2xl border border-white/5 animate-pulse h-64 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-slate-800 rounded" />
                  <div className="w-36 h-5 bg-slate-800 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-slate-800 rounded" />
                  <div className="w-full h-3 bg-slate-800 rounded" />
                </div>
                <div className="w-full h-8 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : recentAsteroids.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-3">
            <Orbit className="w-8 h-8 text-slate-500 mx-auto animate-spin" style={{ animationDuration: '15s' }} />
            <h3 className="text-sm font-bold text-slate-300 font-orbitron">No Asteroids in Current Cache</h3>
            <p className="text-xs text-slate-400">Click "Sync Telemetry" above to refresh data from NASA NeoWs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentAsteroids.map((ast) => {
              const riskBadge = getRiskBadgeClass(ast.calculatedRiskLevel);
              const isSaved = isInWatchlist(ast.nasaId);
              const riskColor = getRiskColorHex(ast.calculatedRiskScore);

              return (
                <div
                  key={ast.nasaId}
                  className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between glass-panel-hover relative overflow-hidden group"
                >
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: riskColor }}
                  />

                  <div>
                    {/* Name + Bookmark button */}
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="truncate">
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-sans truncate">
                          {ast.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">NASA ID: {ast.nasaId}</span>
                      </div>

                      <button
                        onClick={() => toggleWatchlist(ast)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                          isSaved 
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                            : 'bg-space-900 text-slate-400 border-slate-700 hover:text-cyan-300'
                        }`}
                        title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Hazard & Risk Level Badges */}
                    <div className="flex items-center justify-between gap-2 my-2.5">
                      {ast.isPotentiallyHazardous ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-500/40">
                          <ShieldAlert className="w-3 h-3" /> PHA
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Standard NEO</span>
                      )}

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                        Risk {ast.calculatedRiskScore}/100
                      </span>
                    </div>

                    {/* Physical Metrics Grid */}
                    <div className="space-y-1.5 text-xs font-mono bg-space-900/60 p-2.5 rounded-xl border border-white/5 my-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[11px]">Diameter:</span>
                        <span className="text-slate-200">{formatDiameter(ast.estimatedDiameter?.meters?.estimatedAverage || 0, preferences.diameterUnit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[11px]">Velocity:</span>
                        <span className="text-slate-200">{formatVelocity(ast.primaryCloseApproach?.relativeVelocityKps || 0, preferences.velocityUnit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[11px]">Miss Clearance:</span>
                        <span className="text-cyan-300 font-bold truncate max-w-[120px] text-right">
                          {formatDistance(ast.primaryCloseApproach?.missDistanceKilometers || 0, preferences.distanceUnit)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setSelectedAsteroid(ast)}
                    className="w-full mt-2 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-cyan-500/30 transition-colors cursor-pointer"
                  >
                    <span>Inspect Orbital Vectors</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION: RISK VISUALIZATIONS OVERVIEW */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-orbitron flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>Orbital Risk Distribution & Scatter Model</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Comparative multi-parameter visualizations correlating clearance and kinetic scale</p>
          </div>

          <Link
            to="/risk"
            className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <span>Explore Full Risk Model</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <RiskVisualizations />

        <div className="p-3 rounded-xl bg-space-900/60 border border-white/5 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>ASTRA Risk Index is an educational software indicator. It does not represent an official NASA impact prediction.</span>
        </div>
      </section>

      {/* SECTION: CLOSE APPROACHES & USER WATCHLIST DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Close Approaches Preview */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white font-orbitron flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Next Earth Encounters</span>
              </h3>
              <p className="text-xs text-slate-400">Earth-centric orbital trajectory encounters</p>
            </div>

            <Link
              to="/close-approaches"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Sequence</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {nextApproaches.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 font-mono">
                No upcoming approach events in current buffer.
              </div>
            ) : (
              nextApproaches.map((item, idx) => (
                <div
                  key={`${item.asteroidId}-${idx}`}
                  onClick={() => {
                    const match = asteroids.find((a) => a.nasaId === item.asteroidId);
                    if (match) setSelectedAsteroid(match);
                  }}
                  className="glass-card p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs font-mono hover:border-cyan-500/30 transition-all cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-white font-sans text-sm">{item.name}</div>
                    <div className="text-slate-400 text-[11px]">Pass: {formatDateString(item.closeApproachDate)}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-cyan-300 font-bold">{formatDistance(item.missDistanceKilometers, preferences.distanceUnit)}</div>
                    <div className="text-[10px] text-slate-400">{formatVelocity(item.relativeVelocityKps, preferences.velocityUnit)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: User Watchlist Preview */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white font-orbitron flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>My Saved Asteroids</span>
                </h3>
                <p className="text-xs text-slate-400">Personalized commander tracking ({watchlist.length})</p>
              </div>

              <Link
                to="/watchlist"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Manage</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {watchlist.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-space-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 font-orbitron">Watchlist Empty</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Save Near-Earth Objects from the live feed to receive customized alerts and trajectory tracking.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/asteroids')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  Explore Asteroids
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-3">
                {watchlist.slice(0, 3).map((item) => (
                  <div
                    key={item.nasaId}
                    onClick={() => {
                      const match = asteroids.find((a) => a.nasaId === item.nasaId);
                      if (match) setSelectedAsteroid(match);
                    }}
                    className="p-3 rounded-xl bg-space-900/70 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono hover:border-cyan-500/30 transition-all cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-white font-sans text-sm truncate max-w-[140px]">{item.name}</div>
                      <div className="text-slate-400 text-[10px]">Pass: {formatDateString(item.closeApproachDate)}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
                        Score {item.currentRiskScore}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400 text-center">
            User-isolated storage synced with MongoDB
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
