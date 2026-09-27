import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Orbit, 
  ShieldAlert, 
  Bookmark, 
  ExternalLink, 
  Ruler, 
  Gauge, 
  Sparkles, 
  Calendar, 
  Clock, 
  Info, 
  Activity, 
  Compass, 
  Flame,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { 
  formatDistance, 
  formatVelocity, 
  formatDiameter, 
  getRiskBadgeClass, 
  getRiskColorHex, 
  formatDateString 
} from '../lib/utils';

export const AsteroidDetailsModal: React.FC = () => {
  const { 
    selectedAsteroid, 
    setSelectedAsteroid, 
    preferences, 
    toggleWatchlist, 
    isInWatchlist 
  } = useAsteroid();

  const [activeTab, setActiveTab] = useState<'overview' | 'physical' | 'approach' | 'risk'>('overview');

  if (!selectedAsteroid) return null;

  const isSaved = isInWatchlist(selectedAsteroid.nasaId);
  const riskBadge = getRiskBadgeClass(selectedAsteroid.calculatedRiskLevel);
  const riskColor = getRiskColorHex(selectedAsteroid.calculatedRiskScore);
  const primaryApproach = selectedAsteroid.primaryCloseApproach;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-space-950/85 backdrop-blur-xl">
        
        {/* Modal Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedAsteroid(null)}
          className="fixed inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/15 bg-space-900/95 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[92vh] z-10"
        >
          {/* Top Risk Color Accent Line */}
          <div 
            className="h-1.5 w-full transition-colors"
            style={{ backgroundColor: riskColor }}
          />

          {/* Modal Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-cyan-400">
                  NASA NeoWs ID: {selectedAsteroid.nasaId}
                </span>
                {selectedAsteroid.isPotentiallyHazardous && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                    <ShieldAlert className="w-3.5 h-3.5" /> Potentially Hazardous Asteroid (PHA)
                  </span>
                )}
                {selectedAsteroid.isSentryObject && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40">
                    Sentry Impact Monitored
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron">
                {selectedAsteroid.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleWatchlist(selectedAsteroid)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'bg-space-800 text-slate-400 border-slate-700 hover:text-cyan-300'
                }`}
                title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => setSelectedAsteroid(null)}
                className="p-2.5 rounded-xl bg-space-800 hover:bg-space-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Tabs */}
          <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-white/5 overflow-x-auto text-xs font-mono">
            {[
              { id: 'overview', label: 'Mission Overview' },
              { id: 'physical', label: 'Physical Characteristics' },
              { id: 'approach', label: 'Close Approach Vectors' },
              { id: 'risk', label: 'Risk Factor Decomposition' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 border-b-2 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Modal Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 3D Simulated Orbital Wireframe Banner */}
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden glass-card border border-white/10 flex items-center justify-center p-6 bg-gradient-to-r from-space-950 via-space-900 to-space-950">
                  <div className="absolute w-72 h-72 border border-cyan-500/20 rounded-full animate-orbit pointer-events-none" />
                  
                  <div className="relative flex flex-col items-center">
                    <div 
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-[40%] bg-gradient-to-br from-slate-600 via-zinc-800 to-slate-950 border-2 border-slate-500/40 shadow-2xl animate-spin relative overflow-hidden flex items-center justify-center"
                      style={{ 
                        animationDuration: '30s',
                        boxShadow: `0 0 40px ${riskColor}40`,
                      }}
                    >
                      <div className="absolute top-3 left-4 w-5 h-5 rounded-full bg-slate-900/80 border border-slate-700/60" />
                      <div className="absolute bottom-4 right-5 w-7 h-6 rounded-full bg-slate-900/80 border border-slate-700/60" />
                      <div className="absolute top-10 right-3 w-4 h-4 rounded-full bg-slate-900/80 border border-slate-700/60" />
                    </div>

                    <span className="text-[11px] font-mono text-cyan-300 mt-3 uppercase tracking-widest">
                      {selectedAsteroid.name} Simulation
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono">
                    *Illustrative Asteroid Representation
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="glass-panel p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Risk Index</span>
                    <div className="text-lg font-bold text-white mt-1">
                      {selectedAsteroid.calculatedRiskScore} / 100
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${riskBadge.bg} ${riskBadge.text}`}>
                      {selectedAsteroid.calculatedRiskLevel}
                    </span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Est. Mean Diameter</span>
                    <div className="text-lg font-bold text-white mt-1">
                      {formatDiameter(selectedAsteroid.estimatedDiameter?.meters?.estimatedAverage || 0, preferences.diameterUnit)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Magnitude (H): {selectedAsteroid.absoluteMagnitudeH}
                    </span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Miss Clearance</span>
                    <div className="text-lg font-bold text-white mt-1 truncate">
                      {formatDistance(primaryApproach?.missDistanceKilometers || 0, preferences.distanceUnit)}
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold">
                      {primaryApproach?.missDistanceLunar?.toFixed(1)} LD
                    </span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Relative Velocity</span>
                    <div className="text-lg font-bold text-white mt-1">
                      {formatVelocity(primaryApproach?.relativeVelocityKps || 0, preferences.velocityUnit)}
                    </div>
                    <span className="text-[10px] text-purple-400">
                      {(primaryApproach?.relativeVelocityKph || 0).toLocaleString()} km/h
                    </span>
                  </div>
                </div>

                {/* NASA JPL Small-Body Database Link */}
                <div className="p-4 rounded-xl glass-card border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Orbit className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white">NASA JPL Small-Body Database Record</div>
                      <div className="text-xs text-slate-400">Official ephemeris, orbit diagrams & covariance parameters</div>
                    </div>
                  </div>

                  {selectedAsteroid.nasaJplUrl ? (
                    <a
                      href={selectedAsteroid.nasaJplUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <span>Open NASA JPL Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">NASA JPL record</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PHYSICAL DATA */}
            {activeTab === 'physical' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white font-orbitron">
                  Physical Characteristics & Orbital Properties
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  
                  {/* Diameter breakdown */}
                  <div className="glass-card p-4 rounded-xl border border-white/5 space-y-3">
                    <span className="text-cyan-400 font-semibold uppercase text-[11px]">Diameter Breakdown</span>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Estimated Minimum</span>
                      <span className="text-white font-bold">{Math.round(selectedAsteroid.estimatedDiameter?.meters?.min || 0)} meters</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Estimated Maximum</span>
                      <span className="text-white font-bold">{Math.round(selectedAsteroid.estimatedDiameter?.meters?.max || 0)} meters</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Average Mean Diameter</span>
                      <span className="text-cyan-300 font-bold">{Math.round(selectedAsteroid.estimatedDiameter?.meters?.estimatedAverage || 0)} meters</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Imperial Estimation</span>
                      <span className="text-white font-bold">{Math.round(selectedAsteroid.estimatedDiameter?.feet?.max || 0)} ft</span>
                    </div>
                  </div>

                  {/* Optical & Designation Flags */}
                  <div className="glass-card p-4 rounded-xl border border-white/5 space-y-3">
                    <span className="text-purple-400 font-semibold uppercase text-[11px]">Optical & Designation Flags</span>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Absolute Magnitude (H)</span>
                      <span className="text-white font-bold">{selectedAsteroid.absoluteMagnitudeH}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Potentially Hazardous (PHA)</span>
                      <span className={selectedAsteroid.isPotentiallyHazardous ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {selectedAsteroid.isPotentiallyHazardous ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-slate-400">Sentry Impact Monitoring</span>
                      <span className={selectedAsteroid.isSentryObject ? 'text-purple-400 font-bold' : 'text-slate-400'}>
                        {selectedAsteroid.isSentryObject ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">NASA Designation</span>
                      <span className="text-white font-bold">{selectedAsteroid.designation || selectedAsteroid.name}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: CLOSE APPROACH */}
            {activeTab === 'approach' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white font-orbitron">
                  Close Approach Telemetry History & Future Flybys
                </h3>

                <div className="space-y-3">
                  {selectedAsteroid.closeApproaches && selectedAsteroid.closeApproaches.length > 0 ? (
                    selectedAsteroid.closeApproaches.map((ca, idx) => (
                      <div key={idx} className="glass-card p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between text-cyan-300 font-bold">
                          <span>Pass Date: {ca.closeApproachDateFull || ca.closeApproachDate}</span>
                          <span className="text-slate-400">Target Body: {ca.orbitingBody || 'Earth'}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5">
                          <div>
                            <div className="text-slate-400 text-[11px]">Miss Distance (km)</div>
                            <div className="text-white font-bold">{(ca.missDistanceKilometers / 1e6).toFixed(2)}M km</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[11px]">Lunar Distances (LD)</div>
                            <div className="text-amber-300 font-bold">{ca.missDistanceLunar.toFixed(2)} LD</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[11px]">Velocity (km/s)</div>
                            <div className="text-purple-300 font-bold">{ca.relativeVelocityKps.toFixed(2)} km/s</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[11px]">Velocity (km/h)</div>
                            <div className="text-white font-bold">{Math.round(ca.relativeVelocityKph).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-xs font-mono py-4">
                      No additional close approach events recorded.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: RISK ANALYSIS */}
            {activeTab === 'risk' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white font-orbitron">
                    Transparent Factor Decomposition
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border self-start sm:self-auto ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                    Score: {selectedAsteroid.calculatedRiskScore} / 100 ({selectedAsteroid.calculatedRiskLevel})
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  ASTRA calculates a weighted 0–100 educational risk index derived from publicly published NASA Near-Earth Object parameters:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedAsteroid.riskFactors?.map((rf, idx) => (
                    <div key={idx} className="glass-panel p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{rf.factor}</span>
                        <span className="font-mono font-bold text-cyan-300">+{rf.score} / {rf.maxScore} pts</span>
                      </div>
                      <div className="w-full bg-space-950 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, (rf.score / rf.maxScore) * 100)}%` }}
                        />
                      </div>
                      <p className="text-slate-400 font-light text-[11px] leading-normal">{rf.description}</p>
                    </div>
                  ))}
                </div>

                {/* Educational Disclaimer Banner */}
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Educational Indicator Disclaimer
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                    The ASTRA risk score is an educational software calculation for comparative analysis. It is not an official NASA collision probability, Sentry impact warning, or formal planetary defense announcement. Official asteroid impact predictions are maintained by NASA CNEOS.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-space-950/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span>Telemetry Source: {selectedAsteroid.source === 'demo_dataset' ? 'NASA NeoWs Demo Mode' : 'NASA NeoWs Live'}</span>
            <button
              onClick={() => setSelectedAsteroid(null)}
              className="px-5 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-white font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AsteroidDetailsModal;
