import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Info, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Percent,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { getRiskBadgeClass, getRiskColorHex } from '../lib/utils';

export const RiskPredictorPanel: React.FC = () => {
  const { asteroids, setSelectedAsteroid } = useAsteroid();
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);

  const sampleAsteroid = asteroids.length > 0 ? asteroids[selectedSampleIndex] || asteroids[0] : null;

  return (
    <div id="risk-section" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      
      {/* Header & Educational Disclaimer Notice */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase font-mono tracking-widest mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>ASTRA Algorithmic Risk Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-orbitron">
            Transparent Risk Scoring Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A normalized 0–100 comparative risk index calculated transparently from physical and orbital telemetry published by NASA NeoWs.
          </p>
        </div>

        {/* Disclaimer Alert Box */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 max-w-md">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-300 font-semibold">Educational Software Indicator:</strong> ASTRA calculates normalized software heuristics to assist telemetry analysis. It does not replace official NASA JPL Sentry impact probability calculations.
            </div>
          </div>
        </div>
      </div>

      {/* Model Weights Summary & Formula */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Miss Proximity</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">Max 30 pts</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Earth Clearance</div>
          <p className="text-xs text-slate-400 mt-1">Weighted exponentially for lunar orbit intercepts (&lt;1.0 LD).</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Object Diameter</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">Max 25 pts</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Kinetic Potential</div>
          <p className="text-xs text-slate-400 mt-1">Calibrated to NASA's 140m PHA impact threshold and 1km global risk.</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Relative Speed</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">Max 20 pts</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Velocity Vector</div>
          <p className="text-xs text-slate-400 mt-1">Heuristics scaled from 10 km/s baseline to &gt;30 km/s hyper-velocity.</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">NASA PHA Status</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">Max 25 pts</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">Official Flag</div>
          <p className="text-xs text-slate-400 mt-1">Direct inclusion of NASA's Potentially Hazardous Asteroid classification.</p>
        </div>
      </div>

      {/* Interactive Breakdown of an Asteroid */}
      {sampleAsteroid && (
        <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 bg-space-900/60 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Live Factor Decomposition Example
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {sampleAsteroid.name}
              </h3>
            </div>

            {/* Asteroid Selector Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-400 font-mono">Select Object:</label>
              <select
                value={selectedSampleIndex}
                onChange={(e) => setSelectedSampleIndex(Number(e.target.value))}
                className="px-3 py-1.5 bg-space-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                {asteroids.slice(0, 10).map((ast, i) => (
                  <option key={ast.nasaId} value={i}>
                    {ast.name} ({ast.calculatedRiskScore}/100)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Factor Points Breakdown List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {sampleAsteroid.riskFactors?.map((rf, idx) => {
              const pct = Math.min(100, (rf.score / rf.maxScore) * 100);
              return (
                <div key={idx} className="glass-panel p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">{rf.factor}</span>
                    <span className="text-sm font-bold font-mono text-cyan-300">
                      +{rf.score} <span className="text-xs text-slate-500">/ {rf.maxScore} pts</span>
                    </span>
                  </div>
                  <div className="w-full bg-space-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-light">{rf.description}</p>
                </div>
              );
            })}
          </div>

          {/* Total Score Summary Bar */}
          <div className="p-4 rounded-xl bg-space-950/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-extrabold font-mono text-white">
                {sampleAsteroid.calculatedRiskScore}
                <span className="text-sm text-slate-500 font-normal"> / 100</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-mono">Assigned Category:</span>
                <div className="text-sm font-bold text-cyan-300 font-mono">
                  {sampleAsteroid.calculatedRiskLevel} RISK TIER
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedAsteroid(sampleAsteroid)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Full Orbital Telemetry</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
