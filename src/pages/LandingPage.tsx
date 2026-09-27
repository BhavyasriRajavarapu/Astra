import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Telescope,
  Orbit,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Activity,
  Database,
  Lock,
  Eye,
  Flame,
  BarChart3,
  Bookmark,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAsteroid } from '../context/AsteroidContext';
import { HorizonHeroSection } from '../components/ui/horizon-hero-section';
import { AstraNavbar } from '../components/AstraNavbar';
import { Footer } from '../components/Footer';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { MetricCards } from '../components/MetricCards';
import {
  formatDistance,
  formatVelocity,
  formatDiameter,
  getRiskBadgeClass,
  getRiskColorHex,
  formatDateString
} from '../lib/utils';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { asteroids, stats, upcomingTimeline, preferences, setSelectedAsteroid } = useAsteroid();
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash === '#features') {
      const timer = window.setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleExploreScroll = () => {
    const el = document.getElementById('mission-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const previewAsteroids = asteroids.slice(0, 3);
  const previewApproaches = upcomingTimeline.slice(0, 3);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col justify-between relative selection:bg-cosmic-cyan selection:text-space-950 overflow-x-hidden">
      <StarfieldBackground />

      {/* Public Navbar */}
      <AstraNavbar />

      {/* Hero Section */}
      <HorizonHeroSection
        onExploreClick={handleExploreScroll}
        onViewAsteroidsClick={() => navigate(isAuthenticated ? '/asteroids' : '/login?redirect=/asteroids')}
        onGetStartedClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
      />

      {/* Main Public Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-20 w-full pt-10">

        {/* SECTION 1: MISSION / ASTRA EXPLANATION */}
        <section id="mission-section" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Telescope className="w-3.5 h-3.5" />
              <span>Planetary Defense & Discovery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-orbitron tracking-tight">
              Why Planetary Telemetry Matters
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Over 34,000 Near-Earth Asteroids orbit within our solar neighborhood. ASTRA provides transparent software-driven trajectory intelligence, risk indices, and observational monitoring directly using official NASA NeoWs data feeds.
            </p>
          </div>

          {/* KPI Metrics Strip */}
          <MetricCards />
        </section>

        {/* SECTION 2: LIVE ASTEROID INTELLIGENCE PREVIEW */}
        <section id="live-intelligence" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Telemetry Feed
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-orbitron mt-1">
                Monitored Near-Earth Encounters
              </h3>
            </div>
            <Link
              to={isAuthenticated ? '/asteroids' : '/login?redirect=/asteroids'}
              className="px-4 py-2 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <span>View All Monitored Objects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewAsteroids.map((ast, idx) => {
              const riskBadge = getRiskBadgeClass(ast.calculatedRiskLevel);
              const riskColor = getRiskColorHex(ast.calculatedRiskScore);

              return (
                <div
                  key={ast.nasaId}
                  className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between glass-panel-hover relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: riskColor }}
                  />

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-white font-sans truncate max-w-[200px]">
                          {ast.name}
                        </h4>
                        <span className="text-xs font-mono text-slate-400">NASA ID: {ast.nasaId}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                        {ast.calculatedRiskScore}/100
                      </span>
                    </div>

                    <div className="my-3">
                      {ast.isPotentiallyHazardous ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                          <ShieldAlert className="w-3 h-3" /> Potentially Hazardous
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">Standard Orbit NEO</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono bg-space-900/60 p-3 rounded-xl border border-white/5">
                      <div>
                        <span className="text-slate-500 text-[10px]">Diameter</span>
                        <div className="font-semibold text-slate-200">
                          {formatDiameter(ast.estimatedDiameter?.meters?.estimatedAverage || 0, preferences.distanceUnit === 'miles' ? 'feet' : 'meters')}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px]">Velocity</span>
                        <div className="font-semibold text-slate-200">
                          {formatVelocity(ast.primaryCloseApproach?.relativeVelocityKps || 0, preferences.velocityUnit)}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 text-[10px]">Miss Distance</span>
                        <div className="font-semibold text-cyan-300">
                          {formatDistance(ast.primaryCloseApproach?.missDistanceKilometers || 0, preferences.distanceUnit)} ({ast.primaryCloseApproach?.missDistanceLunar.toFixed(1)} LD)
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        setSelectedAsteroid(ast);
                      } else {
                        navigate(`/login?redirect=/asteroids`);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-space-800 hover:bg-space-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 border border-cyan-500/30 transition-all cursor-pointer"
                  >
                    <span>Inspect Orbital Vectors</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: KEY PLATFORM FEATURES */}
        <section id="features" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
              Mission Control Features
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-orbitron">
              Advanced Telemetry Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              State-of-the-art tools for space enthusiasts, researchers, and planetary defense observers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Orbit className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white font-orbitron">Live NASA NeoWs Stream</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Direct integration with NASA's Near-Earth Object API, indexing orbital ephemerides, absolute magnitude, and approach data in real-time.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white font-orbitron">Transparent Risk Predictor</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Documented 0–100 algorithmic score calculating mass, lunar clearance, velocity vectors, and formal PHA designations with full factor breakdowns.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white font-orbitron">Close Approach Timeline</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Chronological visualization of upcoming flybys, highlighting sub-lunar close passes and planetary intersection windows.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white font-orbitron">User-Isolated Watchlist</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Securely persist personal asteroid bookmarks in MongoDB with account isolation and customized orbital alerts.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white font-orbitron">Interactive Visualizations</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Recharts scatter plots correlating clearance against kinetic diameter, alongside ranking distribution bar charts.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white font-orbitron">Mission Alerts Engine</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                In-app notification system that triggers immediate alarms when newly discovered asteroids surpass your risk sensitivity threshold.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 4: CLOSE APPROACH PREVIEW */}
        <section id="close-approaches-preview" className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Upcoming Trajectory Sequence
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-orbitron mt-0.5">
                Next Earth Encounters
              </h3>
            </div>
            <Link
              to={isAuthenticated ? '/close-approaches' : '/login?redirect=/close-approaches'}
              className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5"
            >
              <span>Full Chronological Stream</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {previewApproaches.map((item, idx) => (
              <div
                key={`${item.asteroidId}-${idx}`}
                className="glass-card p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-space-900 border border-white/10 text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm font-sans">{item.name}</div>
                    <div className="text-slate-400">Pass Date: {formatDateString(item.closeApproachDate)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-500 text-[10px]">Miss Distance</span>
                    <div className="text-slate-200 font-bold">{formatDistance(item.missDistanceKilometers, preferences.distanceUnit)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Velocity</span>
                    <div className="text-slate-200 font-bold">{formatVelocity(item.relativeVelocityKps, preferences.velocityUnit)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Risk Tier</span>
                    <div className="text-cyan-400 font-bold">{item.calculatedRiskScore}/100</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: FINAL CTA */}
        <section className="relative rounded-3xl overflow-hidden glass-card border border-cyan-500/30 p-8 sm:p-14 text-center bg-gradient-to-b from-space-900 via-space-950 to-space-900 shadow-2xl">
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready for Exploration</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-orbitron leading-tight">
              Begin Monitoring Near-Earth Trajectories
            </h3>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-light">
              Create your commander clearance to personalize telemetry thresholds, track saved asteroids in your watchlist, and analyze orbital risks in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>{isAuthenticated ? 'Open Mission Dashboard' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={isAuthenticated ? '/asteroids' : '/login?redirect=/asteroids'}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel text-slate-200 border border-slate-700 hover:border-cyan-500/40 text-sm font-semibold transition-all"
              >
                Explore Live Data
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
