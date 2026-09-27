import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { BarChart3, ScatterChart as ScatterIcon, Activity, Flame, ShieldAlert } from 'lucide-react';
import { useAsteroid } from '../context/AsteroidContext';
import { getRiskColorHex } from '../lib/utils';

export const RiskVisualizations: React.FC = () => {
  const { asteroids, preferences, setSelectedAsteroid } = useAsteroid();

  // Prepare Bar Chart Data (Top 10 highest risk)
  const barData = asteroids.slice(0, 10).map((ast) => ({
    name: ast.name.length > 14 ? ast.name.substring(0, 12) + '...' : ast.name,
    fullName: ast.name,
    riskScore: ast.calculatedRiskScore,
    level: ast.calculatedRiskLevel,
    isHazardous: ast.isPotentiallyHazardous,
    raw: ast,
  }));

  // Prepare Scatter Data (Miss distance in Million km vs Diameter in meters)
  const scatterData = asteroids.map((ast) => {
    const missKm = ast.primaryCloseApproach?.missDistanceKilometers || 0;
    const missMillionKm = Number((missKm / 1e6).toFixed(2));
    const diameterM = Math.round(ast.estimatedDiameter?.meters?.estimatedAverage || 0);

    return {
      name: ast.name,
      x: missMillionKm,
      y: diameterM,
      z: ast.calculatedRiskScore,
      riskScore: ast.calculatedRiskScore,
      riskLevel: ast.calculatedRiskLevel,
      velocity: ast.primaryCloseApproach?.relativeVelocityKps || 0,
      hazardous: ast.isPotentiallyHazardous,
      raw: ast,
    };
  });

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-cyan-500/40 shadow-2xl text-xs space-y-1 bg-space-950/95 font-sans z-50">
          <div className="font-bold text-white text-sm">{data.name}</div>
          <div className="text-cyan-300 font-mono">
            Risk Score: <span className="font-bold">{data.riskScore} / 100</span> ({data.riskLevel})
          </div>
          <div className="text-slate-300 font-mono">
            Miss Distance: <span className="text-white">{data.x} Million km</span>
          </div>
          <div className="text-slate-300 font-mono">
            Estimated Diameter: <span className="text-white">~{data.y} meters</span>
          </div>
          <div className="text-slate-300 font-mono">
            Velocity: <span className="text-white">{data.velocity.toFixed(1)} km/s</span>
          </div>
          {data.hazardous && (
            <div className="text-amber-400 font-semibold text-[11px] pt-1">
              ⚠ NASA Potentially Hazardous Asteroid
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-cyan-500/40 shadow-2xl text-xs space-y-1 bg-space-950/95 font-sans z-50">
          <div className="font-bold text-white text-sm">{data.fullName}</div>
          <div className="text-cyan-300 font-mono">
            Calculated Risk: <span className="font-bold">{data.riskScore} / 100</span> ({data.level})
          </div>
          {data.isHazardous && (
            <div className="text-amber-400 font-semibold text-[11px] pt-1">
              ⚠ NASA Potentially Hazardous Asteroid
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-orbitron flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-cosmic-cyan" />
          <span>Orbital Risk Visualizations</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Interactive telemetry distribution and physical correlation graphs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Risk Distribution Bar Chart */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Risk Distribution (Top NEOs)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Normalized score ranking (0 - 100)</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  angle={-30} 
                  textAnchor="end" 
                  interval={0} 
                />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="riskScore" 
                  radius={[6, 6, 0, 0]}
                  onClick={(entry) => entry.raw && setSelectedAsteroid(entry.raw)}
                  cursor="pointer"
                >
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getRiskColorHex(entry.riskScore)} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low (&lt;25)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Mod (26-50)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High (51-75)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical (&gt;75)</div>
          </div>
        </div>

        {/* Chart 2: Miss Distance vs Estimated Diameter Scatter Plot */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ScatterIcon className="w-4 h-4 text-purple-400" />
                <span>Miss Distance vs Estimated Diameter</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Orbital Clearance vs Kinetic Scale</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Miss Distance" 
                  unit="M km" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false}
                  label={{ value: 'Miss Distance (Million km)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Diameter" 
                  unit="m" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false}
                  label={{ value: 'Diameter (m)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 10 }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 250]} />
                <Tooltip content={<CustomScatterTooltip />} />
                <Scatter 
                  name="Asteroids" 
                  data={scatterData} 
                  onClick={(entry) => entry.raw && setSelectedAsteroid(entry.raw)}
                  cursor="pointer"
                >
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`scatter-cell-${index}`} 
                      fill={getRiskColorHex(entry.riskScore)}
                      stroke="rgba(255,255,255,0.3)"
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center text-xs font-mono text-slate-400 pt-3 border-t border-white/5">
            Dot size represents calculated risk magnitude. Click any point to view orbital telemetry.
          </div>
        </div>

      </div>
    </div>
  );
};
