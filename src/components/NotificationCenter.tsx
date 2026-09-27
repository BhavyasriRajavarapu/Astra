import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { getRiskBadgeClass } from '../lib/utils';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearNotifications, 
    setSelectedAsteroid, 
    asteroids 
  } = useAsteroid();

  if (!isOpen) return null;

  const handleOpenAsteroid = (asteroidId?: string) => {
    if (!asteroidId) return;
    const found = asteroids.find((a) => a.nasaId === asteroidId);
    if (found) {
      setSelectedAsteroid(found);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-space-950/70 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md glass-panel border-l border-white/10 bg-space-950/95 flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-space-900 border border-white/10 text-cyan-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-orbitron">Mission Alerts</h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {notifications.length} Trajectory Alert{notifications.length === 1 ? '' : 's'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    title="Clear all alerts"
                    className="p-2 rounded-xl bg-space-900 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-space-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-mono">No active proximity alerts</p>
                </div>
              ) : (
                notifications.map((item) => {
                  const badge = getRiskBadgeClass(item.type);
                  return (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`p-4 rounded-2xl border transition-all ${
                        item.read 
                          ? 'bg-space-900/40 border-white/5 opacity-70' 
                          : 'bg-space-900/90 border-cyan-500/30 shadow-lg'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono uppercase ${badge.bg} ${badge.text} border ${badge.border}`}>
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.timestamp}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{item.message}</p>

                      {item.asteroidId && (
                        <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAsteroid(item.asteroidId);
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <span>Inspect Asteroid</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-space-950 text-center text-xs font-mono text-slate-500">
              In-app notifications trigger when an asteroid surpasses your alert risk threshold.
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
