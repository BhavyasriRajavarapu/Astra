import React from 'react';
import { Telescope, Orbit, Heart, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';

export const Footer: React.FC = () => {
  const { isDemo, lastUpdated } = useAsteroid();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-space-950/90 py-12 px-4 sm:px-6 lg:px-8 mt-20 text-slate-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Attribution */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
              <Telescope className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="font-orbitron font-bold text-base text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>ASTRA</span>
              <span className="text-[10px] text-cyan-400 font-mono">NEO INTELLIGENCE</span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Powered by NASA Near Earth Object Web Service (NeoWs) & JPL Horizons
            </p>
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-space-900 border border-white/10">
            <span className={`w-2 h-2 rounded-full ${isDemo ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
            <span className="text-slate-300">
              Status: {isDemo ? 'Demo Telemetry' : 'Live NASA Stream'}
            </span>
          </div>

          <div className="text-slate-500 hidden sm:block">
            Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Active'}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} ASTRA. Educational planetary intelligence platform.
        </div>
        <div className="flex items-center gap-4">
          <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            NASA Open Data
          </a>
          <span>•</span>
          <a href="https://cneos.jpl.nasa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            CNEOS JPL
          </a>
          <span>•</span>
          <a href="#about-section" className="hover:text-cyan-400 transition-colors">
            Methodology
          </a>
        </div>
      </div>
    </footer>
  );
};
