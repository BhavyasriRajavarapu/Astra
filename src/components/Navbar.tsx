import React, { useState } from 'react';
import { 
  Telescope, 
  Orbit, 
  ShieldAlert, 
  Bookmark, 
  Info, 
  Bell, 
  Settings, 
  RefreshCw, 
  Menu, 
  X, 
  Activity,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenNotifications,
}) => {
  const { 
    isDemo, 
    lastUpdated, 
    loading, 
    refreshData, 
    unreadNotificationCount, 
    watchlist 
  } = useAsteroid();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'asteroids', label: 'Asteroid Feed', icon: Orbit },
    { id: 'approaches', label: 'Close Approaches', icon: Activity },
    { id: 'risk', label: 'Risk Monitor', icon: ShieldAlert },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlist.length > 0 ? watchlist.length : undefined },
    { id: 'about', label: 'About & NASA Data', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id === 'dashboard' ? 'dashboard-main' : `${id}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatLastUpdatedTime = (iso: string) => {
    if (!iso) return 'Just now';
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 bg-space-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300">
            <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
              <Telescope className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-extrabold text-xl sm:text-2xl tracking-wider text-white">
                ASTRA
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 font-mono border border-cyan-500/30 uppercase tracking-widest hidden sm:inline-block">
                v1.0
              </span>
            </div>
            <div className="text-[10px] tracking-widest uppercase font-mono text-slate-400 hidden sm:block">
              NEO Risk Intelligence
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-space-900/60 p-1.5 rounded-2xl border border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'text-cyan-300 bg-space-800/90 shadow-sm border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Live Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live / Demo Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-white/5 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDemo ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isDemo ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className={isDemo ? 'text-amber-400' : 'text-emerald-400'}>
              {isDemo ? 'DEMO DATA' : 'LIVE NASA'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">
              {formatLastUpdatedTime(lastUpdated)}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refreshData()}
            disabled={loading}
            title="Refresh NASA Feed"
            className="p-2.5 rounded-xl glass-panel hover:bg-space-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            title="Mission Alerts"
            className="relative p-2.5 rounded-xl glass-panel hover:bg-space-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg shadow-red-500/50 animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Settings & Units"
            className="p-2.5 rounded-xl glass-panel hover:bg-space-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-4 py-4 space-y-2 bg-space-950/95 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-2 py-1 mb-2 text-xs font-mono text-slate-400">
            <span>Status: {isDemo ? 'DEMO DATASET' : 'LIVE NASA FEED'}</span>
            <span>Updated: {formatLastUpdatedTime(lastUpdated)}</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center justify-between ${
                  isActive 
                    ? 'text-cyan-300 bg-space-800 border border-cyan-500/40' 
                    : 'text-slate-300 hover:bg-space-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
