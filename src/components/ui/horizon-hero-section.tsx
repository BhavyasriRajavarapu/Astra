import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Telescope, 
  Orbit, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Radio, 
  Compass,
  ChevronDown
} from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { useAsteroid } from '../../context/AsteroidContext';

interface HorizonHeroProps {
  onExploreClick?: () => void;
  onViewAsteroidsClick?: () => void;
  onGetStartedClick?: () => void;
}

export const HorizonHeroSection: React.FC<HorizonHeroProps> = ({
  onExploreClick,
  onViewAsteroidsClick,
  onGetStartedClick,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const { isAuthenticated, user } = useAuth();
  const { stats, isDemo } = useAsteroid();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.0012);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(0, 5, 80);

    // Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Starfield Particles (Depth distribution)
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const colorPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#00f0ff'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#facc15'),
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 900;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1600;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 2. Horizon Wireframe Curved Grid
    const gridGeo = new THREE.PlaneGeometry(800, 800, 60, 60);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -40;
    scene.add(gridMesh);

    // 3. Glowing Horizon Halo / Atmosphere
    const horizonGeo = new THREE.RingGeometry(350, 360, 64);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const horizonRing = new THREE.Mesh(horizonGeo, horizonMat);
    horizonRing.rotation.x = Math.PI / 2.3;
    horizonRing.position.set(0, -35, -200);
    scene.add(horizonRing);

    // 4. Floating Asteroid Simulation Wireframe
    const asteroidGeo = new THREE.DodecahedronGeometry(12, 1);
    const asteroidMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const asteroidMesh = new THREE.Mesh(asteroidGeo, asteroidMat);
    asteroidMesh.position.set(50, 15, -40);
    scene.add(asteroidMesh);

    // GSAP Intro Camera Tween
    gsap.fromTo(
      camera.position,
      { y: 30, z: 140 },
      { y: 5, z: 80, duration: 2.5, ease: 'power2.out' }
    );

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Slow orbital and star rotation
      starField.rotation.y = elapsedTime * 0.015;
      starField.rotation.x = elapsedTime * 0.008;

      // Asteroid floating and rotation
      asteroidMesh.rotation.x = elapsedTime * 0.15;
      asteroidMesh.rotation.y = elapsedTime * 0.2;
      asteroidMesh.position.y = 15 + Math.sin(elapsedTime * 0.8) * 3;

      // Horizon grid ripple
      gridMesh.position.z = (elapsedTime * 15) % 40;

      // Subtle parallax camera float
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 4 + 5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      starGeo.dispose();
      starMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      horizonGeo.dispose();
      horizonMat.dispose();
      asteroidGeo.dispose();
      asteroidMat.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-28 pb-12 overflow-hidden select-none">
      
      {/* Three.js Canvas Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-90"
      />

      {/* Fallback & Atmospheric Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-950/60 via-transparent to-space-950 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cosmic-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[350px] bg-cosmic-purple/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating HUD Telemetry Badges */}
      <div className="absolute top-28 right-8 hidden xl:flex flex-col gap-3 z-10 pointer-events-none">
        <div className="glass-panel px-3.5 py-2 rounded-xl text-xs flex items-center gap-2.5 border-cosmic-cyan/30 text-cyan-300">
          <Orbit className="w-4 h-4 animate-spin text-cosmic-cyan" style={{ animationDuration: '12s' }} />
          <span className="font-mono">Orbital Vector Engine Active</span>
        </div>
        <div className="glass-panel px-3.5 py-2 rounded-xl text-xs flex items-center gap-2.5 border-purple-500/30 text-purple-300">
          <Activity className="w-4 h-4 text-purple-400" />
          <span className="font-mono">NASA NeoWs Live Telemetry</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center my-auto pt-4">
        
        {/* Live NASA NeoWs Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 mb-6 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDemo ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isDemo ? 'bg-amber-500' : 'bg-emerald-400'}`}></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300 font-mono">
            {isDemo ? 'NASA NeoWs Telemetry (Demo Feed)' : 'Live NASA NeoWs Stream'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-300 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Near-Earth Object Monitor
          </span>
        </motion.div>

        {/* Brand Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-2"
        >
          <div className="text-xs sm:text-sm uppercase tracking-[0.35em] text-cyan-400 font-mono font-bold">
            Planetary Defense & Space Observation
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-orbitron leading-none">
            ASTRA
          </h1>
          <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent glow-text-cyan font-orbitron pt-2">
            REAL-TIME ASTEROID INTELLIGENCE
          </div>
        </motion.div>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl my-8 leading-relaxed font-light"
        >
          Track near-Earth objects, monitor close approaches, and explore transparent risk indicators powered by live NASA data and algorithmic orbital mechanics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <span>Explore Astra</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onViewAsteroidsClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel hover:bg-space-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Orbit className="w-4 h-4 text-cyan-400" />
            <span>View Asteroids</span>
          </button>

          <button
            onClick={onGetStartedClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/10"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{isAuthenticated ? `Mission Center (${user?.name?.split(' ')[0] || 'Commander'})` : 'Get Started'}</span>
          </button>
        </motion.div>

        {/* Real-time Hero Statistics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 mt-12 w-full max-w-2xl mx-auto"
        >
          <div className="glass-card p-3 sm:p-4 rounded-xl border border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
              {stats?.totalObjects || 12}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1 font-mono">
              Tracked Today
            </div>
          </div>
          
          <div className="glass-card p-3 sm:p-4 rounded-xl border border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
              {stats?.hazardousCount || 0}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1 font-mono">
              Hazardous (PHA)
            </div>
          </div>

          <div className="glass-card p-3 sm:p-4 rounded-xl border border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-red-400">
              {stats?.highestRisk?.score || 74}<span className="text-xs text-slate-500">/100</span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1 font-mono">
              Peak Risk Score
            </div>
          </div>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        onClick={onExploreClick}
        className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer mt-8"
      >
        <span className="text-[11px] text-slate-400 tracking-widest uppercase font-mono">
          Scroll to explore mission feed
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};
