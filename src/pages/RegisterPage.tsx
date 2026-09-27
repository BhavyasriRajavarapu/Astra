import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Telescope, 
  Orbit, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StarfieldBackground } from '../components/StarfieldBackground';

export const RegisterPage: React.FC = () => {
  const { register, authError, clearAuthError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // If already authenticated, redirect immediately to intended target
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();
  const passcodesMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passcodesMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (localError) setLocalError(null);
    if (authError) clearAuthError();
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (localError) setLocalError(null);
    if (authError) clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!name.trim()) {
      setLocalError('Please enter your full commander name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setLocalError('Please provide a valid mission email address.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Passcode must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Access passcodes do not match. Please verify confirmation.');
      return;
    }

    setSubmitting(true);
    const res = await register(name.trim(), email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-cosmic-cyan selection:text-space-950">
      <StarfieldBackground />

      {/* Atmospheric Glowing Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cosmic-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 bg-space-950/85 backdrop-blur-2xl">
        
        {/* Left Side: Space Visual & Benefits */}
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-space-900/90 via-space-950/80 to-space-900/90 relative overflow-hidden">
          
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-mono text-purple-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Planetary Defense Enrollment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-orbitron leading-tight">
                Create Commander Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Join the planetary intelligence network to monitor near-Earth orbital approaches with personalized telemetry tools.
              </p>

              <div className="space-y-3 pt-4 text-xs font-sans text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Isolated user-specific asteroid watchlist</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Custom sub-lunar proximity alert triggers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Configurable astronomical distance & velocity units</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-white/5 text-xs text-slate-400 font-mono">
            Powered by NASA Near Earth Object Web Service (NeoWs)
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            <div>
              <h3 className="text-2xl font-bold text-white font-orbitron">
                Register Clearance
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your details to create your secure mission credentials.
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono" autoComplete="on">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Commander Shepard"
                    className="w-full pl-10 pr-4 py-3 bg-space-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">
                  Mission Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@normandy.space"
                    className="w-full pl-10 pr-4 py-3 bg-space-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">
                  Create Passcode (Min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-space-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                    title={showPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-space-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          strength <= 25 ? 'bg-red-500' : strength <= 50 ? 'bg-amber-500' : strength <= 75 ? 'bg-cyan-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Passcode Complexity</span>
                      <span className={strength >= 75 ? 'text-emerald-400 font-bold' : ''}>
                        {strength <= 25 ? 'Weak' : strength <= 50 ? 'Moderate' : strength <= 75 ? 'Strong' : 'Very Secure'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-medium">
                    Confirm Passcode
                  </label>
                  {passcodesMatch && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passcodes match
                    </span>
                  )}
                  {passcodesMismatch && (
                    <span className="text-[11px] text-amber-400 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3.5 h-3.5" /> Does not match
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-space-900/90 border rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all font-sans ${
                      passcodesMatch
                        ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40'
                        : passcodesMismatch
                        ? 'border-amber-500/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40'
                        : 'border-slate-700/80 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                    title={showConfirmPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-6 group"
              >
                {submitting ? (
                  <>
                    <Orbit className="w-4 h-4 animate-spin text-space-950" />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Enroll Commander Clearance</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-sans">
              <div>
                Already enrolled?{' '}
                <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
                  Sign in here
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

export default RegisterPage;
