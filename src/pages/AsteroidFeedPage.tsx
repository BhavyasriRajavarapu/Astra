import React from 'react';
import { Orbit, Sparkles, Database } from 'lucide-react';
import { SearchAndFilters } from '../components/SearchAndFilters';
import { LiveAsteroidFeed } from '../components/LiveAsteroidFeed';
import { useAsteroid } from '../context/AsteroidContext';

export const AsteroidFeedPage: React.FC = () => {
  const { isDemo, lastUpdated } = useAsteroid();

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
            <Orbit className="w-4 h-4" />
            <span>Planetary Observational Stream</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-orbitron">
            Asteroid Intelligence Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
            Near-Earth Objects tracked via NASA's Near Earth Object Web Service (NeoWs) and Jet Propulsion Laboratory small-body ephemerides.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl glass-card border border-white/10 self-start sm:self-auto">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className={isDemo ? 'text-amber-400' : 'text-emerald-400'}>
            {isDemo ? 'Demo Telemetry Mode' : 'Live NASA NeoWs Stream'}
          </span>
        </div>
      </div>

      {/* Dynamic Search & Multi-tier Filters */}
      <section>
        <SearchAndFilters />
      </section>

      {/* Live Feed Component */}
      <section>
        <LiveAsteroidFeed />
      </section>
    </div>
  );
};
