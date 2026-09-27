import React from 'react';
import { Bookmark, Sparkles, UserCheck } from 'lucide-react';
import { WatchlistPanel } from '../components/WatchlistPanel';
import { useAuth } from '../context/AuthContext';

export const WatchlistPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Personal Mission Observational Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-orbitron">
            Asteroid Watchlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
            User-isolated monitoring list synchronized with your mission credentials and persisted in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-xl glass-card border border-white/10 self-start sm:self-auto text-slate-300">
          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Profile: {user?.name || 'Commander'}</span>
        </div>
      </div>

      {/* Watchlist Panel Component */}
      <section>
        <WatchlistPanel />
      </section>
    </div>
  );
};
