# ASTRA — Real-Time Asteroid Tracker & Risk Predictor

<div align="center">

![ASTRA Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

**A professional, NASA-inspired Near-Earth Object (NEO) monitoring platform, JWT authentication system, and algorithmic risk intelligence suite.**

[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-white.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald.svg)](https://www.mongodb.com/)
[![NASA Open API](https://img.shields.io/badge/NASA_NeoWs-Live_API-red.svg)](https://api.nasa.gov/)

</div>

---

## 🌌 Overview

**ASTRA** is a complete, full-stack space-observatory and asteroid intelligence web application. It connects directly to NASA's **Near Earth Object Web Service (NeoWs)** API and JPL Small-Body Database, calculates a transparent 0–100 asteroid risk score, provides secure MongoDB authentication, isolates user-specific watchlists, and presents all telemetry through an astronomy/cosmic-themed mission control interface.

> [!IMPORTANT]
> **Educational Software Disclaimer:** The ASTRA risk score is a software heuristic designed for comparative risk visualization and computational analysis based on available NASA NeoWs telemetry. It is **NOT** an official NASA collision probability or scientific impact prediction. Official impact assessments are conducted by [NASA JPL CNEOS](https://cneos.jpl.nasa.gov/).

---

## 🗺️ Core User Flow

```
                         ASTRA
                           │
                     LANDING PAGE (Public /)
                           │
              ┌────────────┴────────────┐
              ↓                         ↓
         LOGIN (/login)          REGISTER (/register)
              │                         │
              └────────────┬────────────┘
                           ↓
                 DASHBOARD (/dashboard)
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
   ASTEROID FEED      RISK MONITOR      WATCHLIST (/watchlist)
   (/asteroids)         (/risk)             │
          │                                 ↓
          └───────────→ ASTEROID DETAILS (Modal)
```

---

## ✨ Features & Pages

1. **Public Landing Page (`/`)**:
   - **Horizon Hero Experience**: Three.js + GSAP animated starfield, horizon glow, and real-time NASA status badges with WebGL fallback.
   - **Mission Overview & KPI Summary**: Live Near-Earth Objects count, hazardous PHA count, and closest approaches.
   - **Live Asteroid Feed Preview**: Real-time asteroid encounters directly from NASA NeoWs.
   - **Platform Features Matrix**: Telemetry tracking, risk modeling, close approach sequences, and watchlist persistence.
   - **Planetary Defense Call-to-Action**: Seamless gateway for user enrollment.
2. **Authentication Flow (`/login` & `/register`)**:
   - Spacecraft mission-control split-screen visual layout.
   - Secure password hashing with `bcryptjs` and session tokens with `jsonwebtoken` (JWT).
   - Real-time password strength meter and instant auto-login after registration.
   - One-click Commander Demo credential autofill for rapid testing.
3. **Protected Dashboard (`/dashboard`)**:
   - Personalized welcome header: *"Welcome back, Commander [Name]"*.
   - 5 Animated KPI metric cards (Tracked Today, Hazardous PHAs, Close Approaches, Highest Risk, Closest Clearance).
   - Live Asteroid Feed preview, Risk Overview chart, Close Approaches stream, and User Watchlist preview with empty state CTAs.
4. **Asteroid Intelligence Feed (`/asteroids`)**:
   - Dynamic search by asteroid name, year, or NASA ID.
   - Multi-tier filters (PHA status, risk tiers: Low, Moderate, High, Critical).
   - Card View and Tabular View toggles.
   - Quick watchlist bookmarking and orbital deep-dive inspection.
5. **Risk Monitor & Analytical Engine (`/risk`)**:
   - Transparent, documented 0–100 mathematical risk scoring engine.
   - Factor-by-factor breakdown (+Miss distance proximity, +Kinetic diameter, +Velocity, +NASA PHA classification).
   - Interactive Recharts bar and scatter plot visualizations with cosmic tooltips.
6. **Close Approach Monitor (`/close-approaches`)**:
   - Chronological timeline stream of upcoming planetary flybys with sub-lunar clearance alerts ($<5\text{ LD}$).
7. **User-Specific Watchlist (`/watchlist`)**:
   - 100% user data isolation in MongoDB (User A and User B cannot access each other's bookmarks).
   - Saved asteroid cards, approach countdowns, and quick removal.
8. **NASA Data & Science Guide (`/about`)**:
   - Comprehensive documentation on Near-Earth Objects, PHA criteria, NASA NeoWs architecture, and educational disclaimers.
9. **Interactive 3D Asteroid Modal**:
   - CSS simulated 3D asteroid wireframe, physical parameters, approach ephemerides, and direct links to the official NASA JPL Small-Body Database.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19 + TypeScript 5.7 + Vite 6
  - React Router DOM 7 (Declarative routing & Protected route guards)
  - Tailwind CSS + Custom Space/Cosmic tokens
  - Framer Motion (Page transitions, dropdowns, and modal animations)
  - Three.js + GSAP (Horizon hero starfield & parallax)
  - Lucide React (Astronomy & telemetry iconography)
  - Recharts (Responsive cosmic data charts)
- **Backend**:
  - Node.js + Express.js 4.21
  - TypeScript / TSX Runtime
  - NASA Near Earth Object Web Service (NeoWs) REST API with caching
  - MongoDB + Mongoose 8 (with automatic in-memory fallback)
  - Bcryptjs (Password security) + JSON Web Tokens (JWT)
  - CORS + Dotenv

---

## 📁 Project Structure

```
c:/Astra/
├── server/
│   ├── config/
│   │   ├── config.ts              # Settings, risk weights & JWT secret
│   │   └── db.ts                  # MongoDB connection with offline fallback
│   ├── controllers/
│   │   ├── authController.ts      # Register, Login, GetMe, Logout
│   │   ├── asteroidController.ts  # Feed, Stats, Upcoming, Search, Details
│   │   ├── watchlistController.ts # User-isolated Watchlist CRUD
│   │   └── preferenceController.ts# User preference settings
│   ├── middleware/
│   │   └── authMiddleware.ts      # JWT authentication verification
│   ├── models/
│   │   ├── User.ts                # User credentials & role schema
│   │   ├── Asteroid.ts            # Asteroid Mongoose schema & indexes
│   │   ├── Watchlist.ts           # User-specific Watchlist schema
│   │   └── UserPreference.ts      # Preferences Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.ts          # /api/auth/*
│   │   ├── asteroidRoutes.ts      # /api/asteroids/*
│   │   ├── watchlistRoutes.ts     # /api/watchlist
│   │   └── preferenceRoutes.ts    # /api/preferences
│   ├── services/
│   │   ├── nasaService.ts         # NASA NeoWs integration & caching
│   │   └── riskService.ts         # Transparent risk scoring engine
│   ├── utils/
│   │   └── mockData.ts            # High-precision fallback dataset
│   └── server.ts                  # Express server entrypoint (Port 5000)
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── horizon-hero-section.tsx # Three.js + GSAP hero
│   │   │   └── scroll-expansion-hero.tsx
│   │   ├── AboutSection.tsx       # Scientific guide & methodology
│   │   ├── AsteroidDetailsModal.tsx # Deep-dive modal with 3D wireframe
│   │   ├── AstraNavbar.tsx        # Responsive mission navbar with auth
│   │   ├── CloseApproachMonitor.tsx # Chronological approach timeline
│   │   ├── Footer.tsx             # Mission control footer
│   │   ├── LiveAsteroidFeed.tsx   # Card/Table telemetry feed
│   │   ├── MainLayout.tsx         # Authenticated layout with modals
│   │   ├── MetricCards.tsx        # 5 Animated KPI metric cards
│   │   ├── NotificationCenter.tsx # In-app alert notification drawer
│   │   ├── ProtectedRoute.tsx     # Route guard with session verification
│   │   ├── RiskPredictorPanel.tsx # Transparent risk scoring panel
│   │   ├── RiskVisualizations.tsx # Recharts bar & scatter graphs
│   │   ├── SearchAndFilters.tsx   # Query search & multi-tier filters
│   │   ├── SettingsModal.tsx      # Unit & alert preferences modal
│   │   ├── StarfieldBackground.tsx# Interactive canvas starfield
│   │   └── WatchlistPanel.tsx     # Bookmarked asteroids tracker
│   ├── context/
│   │   ├── AuthContext.tsx        # User authentication & token state
│   │   └── AsteroidContext.tsx    # Central telemetry state provider
│   ├── pages/
│   │   ├── LandingPage.tsx        # Public landing experience
│   │   ├── LoginPage.tsx          # Spacecraft commander sign in
│   │   ├── RegisterPage.tsx       # Commander clearance enrollment
│   │   ├── DashboardPage.tsx      # Main protected mission dashboard
│   │   ├── AsteroidFeedPage.tsx   # Dedicated Asteroid Feed
│   │   ├── RiskMonitorPage.tsx    # Dedicated Risk Monitor
│   │   ├── CloseApproachesPage.tsx# Dedicated Close Approaches
│   │   ├── WatchlistPage.tsx      # Dedicated user Watchlist
│   │   └── AboutPage.tsx          # NASA Data & methodology page
│   ├── lib/
│   │   └── utils.ts               # Unit formatters & color tokens
│   ├── services/
│   │   └── api.ts                 # Axios client with JWT interceptor
│   ├── types/
│   │   └── asteroid.ts            # TypeScript definitions
│   ├── App.tsx                    # React Router configuration
│   ├── index.css                  # Tailwind styles & cosmic tokens
│   └── main.tsx                   # React root
├── .env                           # Local environment variables
├── .env.example                   # Template environment variables
├── package.json                   # Dependencies & build scripts
├── tailwind.config.js             # Tailwind cosmic theme extension
├── tsconfig.json                  # TypeScript compiler options
└── vite.config.ts                 # Vite bundler & API proxy configuration
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication Secret
JWT_SECRET=astra_planetary_defense_jwt_secret_2026_secure

# NASA NeoWs API Key (Optional: Get a free key at https://api.nasa.gov or leave DEMO_KEY)
NASA_API_KEY=DEMO_KEY

# MongoDB Connection String (Leave default or connect to MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/astra_db

# Risk Scoring Model Weights (Normalized out of 100)
RISK_WEIGHT_MISS_DISTANCE=30
RISK_WEIGHT_DIAMETER=25
RISK_WEIGHT_VELOCITY=20
RISK_WEIGHT_HAZARDOUS=25
```

---

## 🚀 Installation & Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full Stack (Client + Server Concurrently)
```bash
npm run dev
```
- **Frontend (Vite)**: `http://localhost:5173`
- **Backend API (Express)**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

### 3. Individual Startup Commands
```bash
# Run only frontend client
npm run dev:client

# Run only backend server (with live file watching)
npm run dev:server

# Build for production
npm run build
```

---

## 🔬 Risk Scoring Formula & Methodology

ASTRA calculates a normalized composite risk score ($0 \le \text{Risk Score} \le 100$):

$$\text{Risk Score} = S_{\text{distance}} + S_{\text{diameter}} + S_{\text{velocity}} + S_{\text{hazard}}$$

1. **Miss Distance ($S_{\text{distance}}$, Max 30 pts)**:
   - $<0.2 \text{ LD}$ ($\sim 76,000 \text{ km}$): $30 \text{ pts}$
   - $<1.0 \text{ LD}$ (Sub-lunar orbit intercept): $27 \text{ pts}$
   - $<5.0 \text{ LD}$ ($\sim 1.92\text{M km}$): $21 \text{ pts}$
   - $<10.0 \text{ LD}$ ($\sim 3.84\text{M km}$): $13.5 \text{ pts}$
   - $<20.0 \text{ LD}$ ($\sim 7.68\text{M km}$): $7.5 \text{ pts}$
   - $\ge 20 \text{ LD}$: Scaled safe clearance decay ($1 \text{ to } 5 \text{ pts}$).
2. **Estimated Diameter ($S_{\text{diameter}}$, Max 25 pts)**:
   - $\ge 1,000\text{m}$ ($1\text{km}$ global extinction scale): $25 \text{ pts}$
   - $300\text{m} - 999\text{m}$ (Regional catastrophe scale): $20 \text{ pts}$
   - $140\text{m} - 299\text{m}$ (NASA PHA baseline threshold): $15 \text{ pts}$
   - $50\text{m} - 139\text{m}$ (Tunguska/meteor scale): $8.75 \text{ pts}$
   - $<50\text{m}$: $3.75 \text{ pts}$.
3. **Relative Velocity ($S_{\text{velocity}}$, Max 20 pts)**:
   - $\ge 30\text{ km/s}$ ($\sim 108,000\text{ km/h}$ hyper-velocity): $20 \text{ pts}$
   - $20 - 29.9\text{ km/s}$: $15 \text{ pts}$
   - $12 - 19.9\text{ km/s}$: $10 \text{ pts}$
   - $<12\text{ km/s}$: $5 \text{ pts}$.
4. **NASA PHA Classification ($S_{\text{hazard}}$, Max 25 pts)**:
   - Formally designated Potentially Hazardous Asteroid (PHA): $+25 \text{ pts}$
   - Standard Near-Earth Object: $+0 \text{ pts}$.

---

## 🛡️ Security & Privacy
- Passwords are securely hashed with salted **bcryptjs** rounds before storing in MongoDB.
- All protected API routes verify **JSON Web Tokens (JWT)** via `Authorization: Bearer <token>`.
- Watchlists are isolated per user ID (`req.userId`), guaranteeing User A cannot view or modify User B's bookmarks.
- NASA API keys and database credentials are fully encapsulated in the backend environment.

---

## 📜 License
MIT License. Built for planetary defense awareness, astronomy education, and scientific exploration.
