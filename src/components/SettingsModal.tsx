import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  X, 
  Check, 
  Sliders, 
  Bell, 
  Compass, 
  RefreshCw, 
  Layers, 
  Save,
  Globe
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { IUserPreferences } from '../types/asteroid';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = useAsteroid();
  const [formData, setFormData] = useState<IUserPreferences>(preferences);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePreferences(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/15 bg-space-900/95 shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-space-800 text-cyan-400 border border-cyan-500/30">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-orbitron">Mission Preferences</h3>
                <p className="text-xs text-slate-400 font-mono">Customize telemetry units & risk thresholds</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-space-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-slate-200">
            
            {/* Units Selection */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Telemetry Units
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                {/* Distance Unit */}
                <div>
                  <label className="block text-slate-400 mb-1.5">Miss Distance Unit</label>
                  <select
                    value={formData.distanceUnit}
                    onChange={(e) => setFormData({ ...formData, distanceUnit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-space-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="km">Kilometers (km / M km)</option>
                    <option value="lunar">Lunar Distances (LD)</option>
                    <option value="au">Astronomical Units (AU)</option>
                    <option value="miles">Miles (mi / M mi)</option>
                  </select>
                </div>

                {/* Velocity Unit */}
                <div>
                  <label className="block text-slate-400 mb-1.5">Velocity Unit</label>
                  <select
                    value={formData.velocityUnit}
                    onChange={(e) => setFormData({ ...formData, velocityUnit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-space-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="kps">Kilometers/sec (km/s)</option>
                    <option value="kph">Kilometers/hour (km/h)</option>
                    <option value="mph">Miles/hour (mph)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Alert Thresholds */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Bell className="w-4 h-4" /> Alert System Thresholds
              </h4>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400">Risk Score Alert Trigger:</span>
                  <span className="text-cyan-300 font-bold">{formData.alertThresholdRiskScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={formData.alertThresholdRiskScore}
                  onChange={(e) => setFormData({ ...formData, alertThresholdRiskScore: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>Sensitive (10)</span>
                  <span>Moderate (50)</span>
                  <span>Critical Only (90)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifyOnHazardous}
                    onChange={(e) => setFormData({ ...formData, notifyOnHazardous: e.target.checked })}
                    className="rounded bg-space-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Always notify on Potentially Hazardous Asteroid (PHA) detections</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifyOnCloseApproach}
                    onChange={(e) => setFormData({ ...formData, notifyOnCloseApproach: e.target.checked })}
                    className="rounded bg-space-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Notify on sub-lunar proximity encounters (&lt;1.0 LD)</span>
                </label>
              </div>
            </div>

            {/* Auto Refresh */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" /> Telemetry Polling Frequency
              </h4>

              <div>
                <label className="block text-slate-400 mb-1.5 text-xs font-mono">Live Refresh Interval</label>
                <select
                  value={formData.autoRefreshIntervalSeconds}
                  onChange={(e) => setFormData({ ...formData, autoRefreshIntervalSeconds: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-space-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="30">Every 30 seconds (High frequency)</option>
                  <option value="60">Every 60 seconds (Standard)</option>
                  <option value="120">Every 2 minutes</option>
                  <option value="300">Every 5 minutes</option>
                  <option value="0">Manual Refresh Only</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Preferences Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
