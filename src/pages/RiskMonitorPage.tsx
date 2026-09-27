import React from 'react';
import { Flame, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { RiskPredictorPanel } from '../components/RiskPredictorPanel';
import { RiskVisualizations } from '../components/RiskVisualizations';

export const RiskMonitorPage: React.FC = () => {
  return (
    <div className="space-y-10">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Algorithmic Telemetry Evaluation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-orbitron">
          Risk Monitor & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
          Comparative normalized risk scores and multi-dimensional orbital clearance visualizations powered by NASA ephemerides data.
        </p>
      </div>

      {/* Visualizations Section */}
      <section>
        <RiskVisualizations />
      </section>

      {/* Transparent Model Breakdown Section */}
      <section>
        <RiskPredictorPanel />
      </section>
    </div>
  );
};
