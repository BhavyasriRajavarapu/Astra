import React from 'react';
import { motion } from 'framer-motion';
import { 
  Orbit, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Crosshair, 
  TrendingUp, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { formatDistance, getRiskBadgeClass } from '../lib/utils';

export const MetricCards: React.FC = () => {
  const { stats, loading, preferences, setSelectedAsteroid, asteroids } = useAsteroid();

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl border border-white/5 animate-pulse h-36 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-20 h-4 bg-slate-800 rounded"></div>
              <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
            </div>
            <div className="w-16 h-8 bg-slate-800 rounded my-2"></div>
            <div className="w-28 h-3 bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const handleOpenAsteroid = (id?: string) => {
    if (!id) return;
    const found = asteroids.find((a) => a.nasaId === id);
    if (found) setSelectedAsteroid(found);
  };

  const highestRiskLevel = stats?.highestRisk?.level || 'LOW';
  const riskBadge = getRiskBadgeClass(highestRiskLevel);

  const cards = [
    {
      id: 'neo-total',
      title: 'Near-Earth Objects',
      value: stats?.totalObjects || 0,
      subvalue: 'Tracked in timeframe',
      context: 'Live NeoWs catalog stream',
      icon: Orbit,
      iconColor: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]',
      gradient: 'from-cyan-500/10 to-transparent',
    },
    {
      id: 'hazardous-count',
      title: 'Potentially Hazardous',
      value: stats?.hazardousCount || 0,
      subvalue: `${((stats?.hazardousCount || 0) / Math.max(1, stats?.totalObjects || 1) * 100).toFixed(0)}% of total feed`,
      context: stats?.hazardousCount && stats.hazardousCount > 0 ? 'Exceeds NASA PHA baseline' : 'No PHAs detected',
      icon: ShieldAlert,
      iconColor: (stats?.hazardousCount || 0) > 0 ? 'text-amber-400' : 'text-emerald-400',
      borderGlow: (stats?.hazardousCount || 0) > 0 
        ? 'hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]'
        : 'hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]',
      gradient: (stats?.hazardousCount || 0) > 0 ? 'from-amber-500/10 to-transparent' : 'from-emerald-500/10 to-transparent',
    },
    {
      id: 'close-approaches',
      title: 'Close Approaches',
      value: stats?.closeApproachesCount || 0,
      subvalue: 'Orbital intersections',
      context: 'Earth-centric trajectory count',
      icon: Activity,
      iconColor: 'text-purple-400',
      borderGlow: 'hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]',
      gradient: 'from-purple-500/10 to-transparent',
    },
    {
      id: 'highest-risk',
      title: 'Highest Calculated Risk',
      customValue: (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {stats?.highestRisk?.score || 0}
          </span>
          <span className="text-xs text-slate-400 font-mono">/100</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${riskBadge.bg} ${riskBadge.text} border ${riskBadge.border}`}>
            {stats?.highestRisk?.level || 'LOW'}
          </span>
        </div>
      ),
      subvalue: stats?.highestRisk?.name || 'None',
      context: 'Click to inspect risk factors',
      icon: Flame,
      iconColor: 'text-red-400',
      borderGlow: 'hover:border-red-500/40 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]',
      gradient: 'from-red-500/10 to-transparent',
      onClick: () => handleOpenAsteroid(stats?.highestRisk?.id),
    },
    {
      id: 'closest-approach',
      title: 'Closest Approach',
      customValue: (
        <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">
          {formatDistance(stats?.closestApproach?.missDistanceKm || 0, preferences.distanceUnit)}
        </div>
      ),
      subvalue: stats?.closestApproach?.name || 'None',
      context: stats?.closestApproach?.missDistanceLunar 
        ? `${stats.closestApproach.missDistanceLunar.toFixed(2)} Lunar Distances`
        : 'Safe clearance',
      icon: Crosshair,
      iconColor: 'text-teal-400',
      borderGlow: 'hover:border-teal-500/40 hover:shadow-[0_0_25px_rgba(20,184,166,0.15)]',
      gradient: 'from-teal-500/10 to-transparent',
      onClick: () => handleOpenAsteroid(stats?.closestApproach?.id),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            onClick={card.onClick}
            className={`glass-card p-5 rounded-2xl border border-white/10 bg-gradient-to-b ${card.gradient} transition-all duration-300 flex flex-col justify-between group ${card.borderGlow} ${
              card.onClick ? 'cursor-pointer' : ''
            }`}
          >
            {/* Header: Title + Icon */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                {card.title}
              </span>
              <div className="p-2 rounded-xl bg-space-900/80 border border-white/10 group-hover:scale-110 transition-transform">
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            {/* Value */}
            <div className="my-1">
              {card.customValue ? (
                card.customValue
              ) : (
                <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {card.value}
                </div>
              )}
            </div>

            {/* Subvalue & Context */}
            <div className="mt-2 pt-2 border-t border-white/5 flex flex-col gap-0.5">
              <div className="text-xs font-medium text-slate-200 truncate">
                {card.subvalue}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                <span>{card.context}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
