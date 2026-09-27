import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Telescope, 
  Orbit, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StarfieldBackground } from '../components/StarfieldBackground';

export const LoginPage: React.FC = () => {
  const { login, authError, clearAuthError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse redirect destination
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // If already authenticated, redirect immediately to intended target
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email.trim() || !password) {
      setLocalError('Please provide both your mission email and access passcode.');
      return;
    }

    setSubmitting(true);
    const res = await login(email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleFillDemo = () => {
    setEmail('shepard@normandy.space');
    setPassword('NormandyMission2026!');
    setLocalError(null);
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-cosmic-cyan selection:text-space-950">
      <StarfieldBackground />

      {/* Atmospheric Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 bg-space-950/85 backdrop-blur-2xl">
        
        {/* Left Side: Space Visual & Mission Briefing */}
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-space-900/90 via-space-950/80 to-space-900/90 relative overflow-hidden">
          
          {/* Subtle Planetary Orbit Graphic */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 border border-cyan-500/20 rounded-full pointer-events-none animate-orbit" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
                  <Telescope className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-orbitron font-extrabold text-2xl tracking-wider text-white">
                  ASTRA
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-mono text-cyan-400">
                  Planetary Defense Obs
                </span>
              </div>
            </Link>

            <div className="mt-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Restricted Mission Portal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-orbitron leading-tight">
                Access Real-Time Asteroid Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Sign in to synchronize your telemetry watchlist, receive real-time proximity alerts, and configure customized orbital risk thresholds.
              </p>
            </div>
          </div>

          {/* Bottom Telemetry Note & Demo Access */}
          <div className="relative z-10 pt-8 mt-8 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Powered by NASA NeoWs API Telemetry</span>
            </div>

            <button
              onClick={handleFillDemo}
              type="button"
              className="w-full py-2 px-3 rounded-xl bg-space-800/80 hover:bg-space-800 text-xs font-mono text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fill Commander Demo Credentials</span>
            </button>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            <div>
              <h3 className="text-2xl font-bold text-white font-orbitron">
                Commander Sign In
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your security credentials to access the mission control dashboard.
              </p>
            </div>

            {/* Error Banner */}
            {activeError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-start gap-2.5 font-mono"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{activeError}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">
                  Mission Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@normandy.space"
                    className="w-full pl-10 pr-4 py-3 bg-space-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-medium">
                    Access Passcode
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-space-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-6 group"
              >
                {submitting ? (
                  <>
                    <Orbit className="w-4 h-4 animate-spin text-space-950" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Mission Access</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-sans">
              <div>
                Don't have an account?{' '}
                <Link to={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
                  Create Commander Profile
                </Link>
              </div>

              <Link to="/" className="text-slate-400 hover:text-slate-200 text-xs">
                ← Return to Public Landing
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
