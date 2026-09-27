import React from 'react';
import { Info, BookOpen, Database } from 'lucide-react';
import { AboutSection } from '../components/AboutSection';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Science & Planetary Defense Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-orbitron">
          About ASTRA & NASA NeoWs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
          Understanding Near-Earth Objects, Potentially Hazardous Asteroid (PHA) criteria, and ASTRA's transparent algorithmic risk index.
        </p>
      </div>

      {/* About Section */}
      <section>
        <AboutSection />
      </section>
    </div>
  );
};
