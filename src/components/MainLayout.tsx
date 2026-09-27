import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AstraNavbar } from './AstraNavbar';
import { Footer } from './Footer';
import { StarfieldBackground } from './StarfieldBackground';
import { AsteroidDetailsModal } from './AsteroidDetailsModal';
import { SettingsModal } from './SettingsModal';
import { NotificationCenter } from './NotificationCenter';

export const MainLayout: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col justify-between relative selection:bg-cosmic-cyan selection:text-space-950 overflow-x-hidden">
      {/* Background Animated Canvas */}
      <StarfieldBackground />

      {/* Navigation Header */}
      <AstraNavbar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Main Page Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 w-full flex-1">
        <Outlet />
      </main>

      {/* Modals & Slide-over Drawers */}
      <AsteroidDetailsModal />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <NotificationCenter isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Mission Footer */}
      <Footer />
    </div>
  );
};
