import React from 'react';
import { 
  Info, 
  Orbit, 
  ShieldAlert, 
  ExternalLink, 
  Database, 
  Sparkles, 
  BookOpen, 
  AlertTriangle,
  Compass
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div id="about-section" className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8">
      
      {/* Section Header */}
      <div className="pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase font-mono tracking-widest mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Astronomical Science & Documentation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-orbitron">
          About ASTRA & NASA NeoWs Telemetry
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Comprehensive guide to planetary defense monitoring, Near-Earth Object categorization, and the algorithmic architecture behind ASTRA.
        </p>
      </div>

      {/* Prominent Educational Notice */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-space-900 to-purple-950/60 border border-cyan-500/30">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-cyan-300 font-orbitron">
              Methodology & Scientific Transparency Disclaimer
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The ASTRA risk score is an <strong>educational software indicator</strong> calculated from publicly available NASA Near-Earth Object Web Service (NeoWs) telemetry parameters. It is designed for comparative risk visualization and computational analysis. <strong>It is NOT an official NASA collision probability, Sentry impact prediction, or formal planetary defense alert.</strong> Official impact risk assessments are conducted by NASA’s Center for Near Earth Object Studies (CNEOS) and ESA's Near-Earth Object Coordination Centre.
            </p>
          </div>
        </div>
      </div>

      {/* Science FAQ Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: What is a NEO? */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Orbit className="w-5 h-5" />
            <span>What is a Near-Earth Object (NEO)?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Near-Earth Objects (NEOs) are asteroids and comets with orbits that bring them into Earth's planetary neighborhood—specifically within 1.3 Astronomical Units (AU) of the Sun (~195 million kilometers). The majority are asteroids nudged by the gravitational attraction of nearby planets into orbits that allow them to approach Earth.
          </p>
        </div>

        {/* Card 2: What is a PHA? */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>What defines a "Potentially Hazardous Asteroid" (PHA)?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            NASA classifies an asteroid as a Potentially Hazardous Asteroid (PHA) if its Minimum Orbit Intersection Distance (MOID) with Earth is <strong>0.05 AU (~7.5 million kilometers)</strong> or less, and its absolute magnitude (H) is <strong>22.0 or brighter</strong> (suggesting an estimated diameter larger than ~140 meters). PHAs receive persistent observational tracking.
          </p>
        </div>

        {/* Card 3: Data Pipeline */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <Database className="w-5 h-5" />
            <span>Data Sources & Telemetry Pipeline</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            ASTRA ingests data directly via NASA's <strong>Near Earth Object Web Service (NeoWs)</strong>, backed by the NASA Jet Propulsion Laboratory (JPL) Small-Body Database. Telemetry includes orbital elements, relative velocities, close approach timestamps, absolute magnitude, and minimum/maximum diameter estimations.
          </p>
        </div>

        {/* Card 4: Algorithmic Scoring */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>Risk Calculation Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            ASTRA normalizes multiple telemetry vectors into a transparent 0–100 index:
            <br />• <strong>Miss Distance (30 pts max):</strong> Proximity in Lunar Distances.
            <br />• <strong>Estimated Diameter (25 pts max):</strong> Mass & kinetic footprint.
            <br />• <strong>Relative Velocity (20 pts max):</strong> Approach speed vectors.
            <br />• <strong>NASA PHA Classification (25 pts max):</strong> Formal hazard classification.
          </p>
        </div>

      </div>

      {/* External Authority Links */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-mono text-slate-400">
          Official Planetary Defense Resources:
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://cneos.jpl.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <span>NASA CNEOS Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://ssd.jpl.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <span>JPL Solar System Dynamics</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <span>NASA Open APIs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
