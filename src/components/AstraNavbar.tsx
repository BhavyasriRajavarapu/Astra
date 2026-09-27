import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Bookmark,
  ChevronDown,
  Info,
  Layers,
  LogIn,
  LogOut,
  Menu,
  Orbit,
  ShieldAlert,
  UserPlus,
  X,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useAsteroid } from '../context/AsteroidContext';

export interface AstraNavbarProps {
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
}

export function AstraNavbar({ onOpenSettings, onOpenNotifications }: AstraNavbarProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();
  const { watchlist } = useAsteroid();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const loggedInNavItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: Layers,
    },
    {
      to: '/asteroids',
      label: 'Asteroid Feed',
      icon: Orbit,
    },
    {
      to: '/risk',
      label: 'Risk Monitor',
      icon: ShieldAlert,
    },
    {
      to: '/close-approaches',
      label: 'Close Approaches',
      icon: Activity,
    },
    {
      to: '/watchlist',
      label: 'Watchlist',
      icon: Bookmark,
      badge: watchlist.length > 0 ? watchlist.length : undefined,
    },
    {
      to: '/about',
      label: 'NASA Data',
      icon: Info,
    },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);

    await logout();

    navigate('/');
  };

  const handleFeaturesNavigation = () => {
    closeMobileMenu();

    if (location.pathname === '/') {
      const element = document.getElementById('features');

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }

      return;
    }

    navigate('/#features');
  };

  const handleRiskNavigation = () => {
    closeMobileMenu();

    if (isAuthenticated) {
      navigate('/risk');
      return;
    }

    navigate('/login?redirect=/risk');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }

    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto mt-3 w-[calc(100%-24px)] max-w-7xl">
        <div className="relative overflow-visible rounded-2xl border border-white/10 bg-black/50 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="group flex items-center gap-3"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
                <Orbit className="h-5 w-5 text-cyan-300 transition-transform duration-500 group-hover:rotate-180" />

                <span className="absolute inset-0 rounded-xl bg-cyan-400/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="hidden sm:block">
                <div className="text-lg font-bold tracking-[0.25em] text-white">
                  ASTRA
                </div>

                <div className="text-[9px] tracking-[0.18em] text-cyan-300/70">
                  ASTEROID INTELLIGENCE
                </div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden items-center gap-1 lg:flex">

              {!isAuthenticated ? (
                <>
                  {/* HOME */}
                  <Link
                    to="/"
                    className={`rounded-lg px-4 py-2 text-sm transition-all ${location.pathname === '/'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    Home
                  </Link>

                  {/* FEATURES */}
                  <button
                    type="button"
                    onClick={handleFeaturesNavigation}
                    className="rounded-lg px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white"
                  >
                    Features
                  </button>

                  {/* RISK MONITOR */}
                  <button
                    type="button"
                    onClick={handleRiskNavigation}
                    className={`rounded-lg px-4 py-2 text-sm transition-all ${
                      location.pathname === '/risk'
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    Risk Monitor
                  </button>

                  {/* NASA DATA */}
                  <Link
                    to="/about"
                    className={`rounded-lg px-4 py-2 text-sm transition-all ${location.pathname === '/about'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    NASA Data
                  </Link>
                </>
              ) : (
                <>
                  {loggedInNavItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${isActive(item.to)
                          ? 'bg-cyan-400/10 text-cyan-300'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <Icon className="h-4 w-4" />

                        <span>{item.label}</span>

                        {item.badge !== undefined && (
                          <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400/15 px-1.5 text-[10px] font-semibold text-cyan-300">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden items-center gap-2 lg:flex">

              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition-all hover:border-cyan-400/30 hover:bg-white/5 hover:text-white"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-cyan-300"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative">

                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-all hover:border-cyan-400/30 hover:bg-white/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-black">
                      {user?.name?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </div>

                    <div className="hidden xl:block text-left">
                      <div className="max-w-[120px] truncate text-xs font-medium text-white">
                        {user?.name || 'Astronaut'}
                      </div>

                      <div className="max-w-[120px] truncate text-[10px] text-white/40">
                        {user?.email || 'Explorer'}
                      </div>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 text-white/50 transition-transform ${profileOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-60 overflow-hidden rounded-xl border border-white/10 bg-[#080b12]/95 p-2 shadow-2xl backdrop-blur-xl">

                      <div className="border-b border-white/10 px-3 py-3">
                        <p className="text-xs font-semibold text-white">
                          {user?.name || 'Astronaut'}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-white/40">
                          {user?.email || ''}
                        </p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Layers className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <Link
                        to="/watchlist"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Bookmark className="h-4 w-4" />
                        Watchlist
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-400/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* MOBILE NAVIGATION */}
          {mobileMenuOpen && (
            <div className="mt-4 border-t border-white/10 pt-4 lg:hidden">

              {!isAuthenticated ? (
                <div className="flex flex-col gap-1">

                  {/* HOME */}
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className={`rounded-lg px-4 py-3 text-sm transition-all ${location.pathname === '/'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    Home
                  </Link>

                  {/* FEATURES */}
                  <button
                    type="button"
                    onClick={handleFeaturesNavigation}
                    className="w-full rounded-lg px-4 py-3 text-left text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white"
                  >
                    Features
                  </button>

                  {/* RISK MONITOR */}
                  <button
                    type="button"
                    onClick={handleRiskNavigation}
                    className="w-full rounded-lg px-4 py-3 text-left text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white"
                  >
                    Risk Monitor
                  </button>

                  {/* NASA DATA */}
                  <Link
                    to="/about"
                    onClick={closeMobileMenu}
                    className={`rounded-lg px-4 py-3 text-sm transition-all ${location.pathname === '/about'
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    NASA Data
                  </Link>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">

                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/70"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-sm font-semibold text-black"
                    >
                      <UserPlus className="h-4 w-4" />
                      Register
                    </Link>

                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">

                  {loggedInNavItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all ${isActive(item.to)
                          ? 'bg-cyan-400/10 text-cyan-300'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <Icon className="h-4 w-4" />

                        <span>{item.label}</span>

                        {item.badge !== undefined && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400/15 px-1.5 text-[10px] font-semibold text-cyan-300">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  <div className="mt-3 border-t border-white/10 pt-3">

                    <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-black">
                        {user?.name?.charAt(0)?.toUpperCase() ||
                          user?.email?.charAt(0)?.toUpperCase() ||
                          'U'}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {user?.name || 'Astronaut'}
                        </p>

                        <p className="truncate text-xs text-white/40">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-300 transition-colors hover:bg-red-400/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>

                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default AstraNavbar;