import React from 'react';
import { Activity, Calendar, Clock } from 'lucide-react';
import { CloseApproachMonitor } from '../components/CloseApproachMonitor';

export const CloseApproachesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Orbital Vector Sequence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-orbitron">
          Close Approach Monitor
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
          Chronological trajectory stream tracking planetary intersection windows, sub-lunar clearances, and relative velocities.
        </p>
      </div>

      {/* Close Approach Component */}
      <section>
        <CloseApproachMonitor />
      </section>
    </div>
  );
};
