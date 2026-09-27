import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Radio, 
  ShieldAlert, 
  ChevronDown, 
  Sparkles, 
  Compass, 
  Orbit, 
  Activity,
  ArrowRight
} from 'lucide-react';

interface ScrollExpandMediaProps {
  onExploreClick?: () => void;
  isDemo?: boolean;
  totalAsteroids?: number;
  hazardousCount?: number;
  highestRiskScore?: number;
}

export const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  onExploreClick,
  isDemo = false,
  totalAsteroids = 12,
  hazardousCount = 3,
  highestRiskScore = 74,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { scrollY } = useScroll();

  // Scroll animations for smooth expansion
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.2]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -40]);

  // Space backdrop image (reliable NASA / Unsplash space telescope image with inline fallback)
  const cosmicImageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop';

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const dashboardElement = document.getElementById('dashboard-main');
      if (dashboardElement) {
        dashboardElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-24 pb-12 overflow-hidden">
      {/* Background Cosmic Canvas & Image with Fallback */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 transform scale-105"
          style={{
            backgroundImage: `url(${cosmicImageUrl})`,
            opacity: imageLoaded ? 0.35 : 0.2,
          }}
        />
        {/* Preload background image */}
        <img
          src={cosmicImageUrl}
          alt="Deep Space Backdrop"
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
        {/* Deep Space Vignettes & Glowing Nebulae */}
        <div className="absolute inset-0 bg-gradient-to-b from-space-950/70 via-space-950/85 to-space-950" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cosmic-cyan/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-cosmic-purple/15 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* Floating HUD Orbit Indicators */}
      <div className="absolute top-28 right-8 hidden xl:flex flex-col gap-3 z-10">
        <div className="glass-panel px-3.5 py-2 rounded-xl text-xs flex items-center gap-2.5 border-cosmic-cyan/30 text-cyan-300">
          <Orbit className="w-4 h-4 animate-spin text-cosmic-cyan" style={{ animationDuration: '15s' }} />
          <span>NeoWs Sentry Active</span>
        </div>
        <div className="glass-panel px-3.5 py-2 rounded-xl text-xs flex items-center gap-2.5 border-purple-500/30 text-purple-300">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Telemetry Live Stream</span>
        </div>
      </div>

      {/* Main Hero Container */}
      <motion.div 
        style={{ scale: heroScale, opacity: heroOpacity, y: heroTranslateY }}
        className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center my-auto pt-6"
      >
        {/* Live Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 mb-6"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cosmic-cyan"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300 font-mono">
            {isDemo ? 'NASA NeoWs Telemetry (Demo Feed)' : 'Live NASA NeoWs Stream'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Near-Earth Object Monitor
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 font-orbitron"
        >
          REAL-TIME <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent glow-text-cyan">
            ASTEROID INTELLIGENCE
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed font-light"
        >
          Monitor Near-Earth Objects, analyze close planetary approaches, and understand normalized asteroid risk metrics using live NASA data and transparent scoring algorithms.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={handleExplore}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Launch Mission Dashboard</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#risk-section"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel hover:bg-space-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Risk Methodology</span>
          </a>
        </motion.div>

        {/* Quick Hero Telemetry Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 mt-12 w-full max-w-2xl mx-auto"
        >
          <div className="glass-card p-3 sm:p-4 rounded-xl border border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">{totalAsteroids}</div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Tracked Today</div>
          </div>
          <div className="glass-card p-3 sm:p-4 rounded-xl border border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">{hazardousCount}</div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Hazardous</div>
          </div>
          <div className="glass-card p-3 sm:p-4 rounded-xl border border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-red-400">{highestRiskScore}<span className="text-xs text-slate-500">/100</span></div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Max Risk Score</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="relative z-10 flex flex-col items-center gap-2 cursor-pointer mt-6"
        onClick={handleExplore}
      >
        <span className="text-xs text-slate-400 tracking-widest uppercase font-mono">Scroll to Explore Mission Feed</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};
