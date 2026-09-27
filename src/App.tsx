import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AsteroidProvider } from './context/AsteroidContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AsteroidFeedPage } from './pages/AsteroidFeedPage';
import { RiskMonitorPage } from './pages/RiskMonitorPage';
import { CloseApproachesPage } from './pages/CloseApproachesPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  return (
    <AuthProvider>
      <AsteroidProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Public About Page in Main Layout */}
            <Route element={<MainLayout />}>
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Protected Mission Control Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/asteroids" element={<AsteroidFeedPage />} />
              <Route path="/risk" element={<RiskMonitorPage />} />
              <Route path="/close-approaches" element={<CloseApproachesPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AsteroidProvider>
    </AuthProvider>
  );
}

export default App;
