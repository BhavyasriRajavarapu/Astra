import React from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  ShieldAlert, 
  ArrowUpDown, 
  RotateCcw,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';

export const SearchAndFilters: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    selectedHazardOnly,
    setSelectedHazardOnly,
    selectedRiskLevels,
    setSelectedRiskLevels,
    selectedSort,
    setSelectedSort,
    asteroids,
  } = useAsteroid();

  const handleRiskToggle = (level: string) => {
    if (selectedRiskLevels.includes(level)) {
      setSelectedRiskLevels(selectedRiskLevels.filter((l) => l !== level));
    } else {
      setSelectedRiskLevels([...selectedRiskLevels, level]);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedHazardOnly(false);
    setSelectedRiskLevels([]);
    setSelectedSort('risk_desc');
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedHazardOnly || selectedRiskLevels.length > 0 || selectedSort !== 'risk_desc';

  const riskOptions = [
    { id: 'CRITICAL', label: 'Critical Risk', count: asteroids.filter(a => a.calculatedRiskLevel === 'CRITICAL').length, color: 'border-red-500/50 text-red-300 bg-red-950/60 shadow-[0_0_12px_rgba(239,68,68,0.2)]' },
    { id: 'HIGH', label: 'High Risk', count: asteroids.filter(a => a.calculatedRiskLevel === 'HIGH').length, color: 'border-orange-500/50 text-orange-300 bg-orange-950/60 shadow-[0_0_12px_rgba(249,115,22,0.2)]' },
    { id: 'MODERATE', label: 'Moderate Risk', count: asteroids.filter(a => a.calculatedRiskLevel === 'MODERATE').length, color: 'border-amber-500/50 text-amber-300 bg-amber-950/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]' },
    { id: 'LOW', label: 'Low Risk', count: asteroids.filter(a => a.calculatedRiskLevel === 'LOW').length, color: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]' },
  ];

  const phaCount = asteroids.filter(a => a.isPotentiallyHazardous).length;

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 bg-space-950/80 shadow-xl space-y-4">
      {/* Top Row: Search Input + Date Picker + Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by asteroid name, NASA ID, or year (e.g. Apophis, 2024 YR4, 99942)..."
            className="w-full pl-10 pr-10 py-2.5 bg-space-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Selector */}
        <div className="md:col-span-3 relative">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-space-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono cursor-pointer"
            title="Observation Date"
          />
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-3 relative">
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-space-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all appearance-none cursor-pointer font-sans"
          >
            <option value="risk_desc">Sort: Highest Risk Score</option>
            <option value="distance_asc">Sort: Closest Miss Distance</option>
            <option value="diameter_desc">Sort: Largest Estimated Diameter</option>
            <option value="velocity_desc">Sort: Highest Relative Velocity</option>
            <option value="date_asc">Sort: Approach Date (Earliest)</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Filter Pills + Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
        
        {/* Hazardous Toggle + Risk Level Checkboxes */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filters:
          </span>

          {/* Hazardous Only Toggle */}
          <button
            onClick={() => setSelectedHazardOnly(!selectedHazardOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              selectedHazardOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-space-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Hazardous (PHA) Only</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-space-950 font-mono text-amber-300">
              {phaCount}
            </span>
          </button>

          {/* Risk Level Pills */}
          {riskOptions.map((opt) => {
            const isChecked = selectedRiskLevels.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => handleRiskToggle(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isChecked
                    ? `${opt.color} border-current font-bold`
                    : 'bg-space-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-[10px] opacity-70">({opt.count})</span>
              </button>
            );
          })}
        </div>

        {/* Clear / Reset Action */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-space-800/80 hover:bg-space-800 border border-cyan-500/30 transition-all cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Active Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;
