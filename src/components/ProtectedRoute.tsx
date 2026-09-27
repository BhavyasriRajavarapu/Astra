import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Orbit, Telescope } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-space-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-space-900 border border-cyan-500/40 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <Telescope className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <Orbit className="absolute -inset-4 w-24 h-24 text-cyan-500/30 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <h3 className="text-lg font-bold text-white font-orbitron tracking-wider">
          AUTHENTICATING MISSION CREDENTIALS
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Decrypting NASA telemetry telemetry stream...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};
