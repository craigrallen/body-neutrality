import type { AppState } from '../types';

interface Props { state: AppState }

function Tree({ index, total }: { index: number; total: number }) {
  const x = 10 + (index % 8) * 12 + (Math.sin(index * 2.7) * 4);
  const y = 30 + Math.floor(index / 8) * 18 + (Math.cos(index * 1.3) * 5);
  const h = 20 + Math.sin(index * 3.1) * 8;
  const delay = index * 0.1;
  const hue = 100 + Math.sin(index) * 20;
  return (
    <g style={{ animation: `grow 0.8s ease-out ${delay}s both` }} transform={`translate(${x},${y})`}>
      <rect x="-1" y={-h * 0.3} width="2" height={h * 0.3} fill="#8B6F47" rx="1" />
      <circle cx="0" cy={-h * 0.4} r={4 + total * 0.05} fill={`hsl(${hue}, 50%, 45%)`} className="sway" />
      <circle cx="-3" cy={-h * 0.3} r={3 + total * 0.03} fill={`hsl(${hue + 10}, 45%, 50%)`} className="sway" style={{ animationDelay: '0.5s' }} />
    </g>
  );
}

function Flower({ index }: { index: number }) {
  const x = 8 + (index % 10) * 9 + (Math.cos(index * 1.9) * 3);
  const y = 35 + Math.floor(index / 10) * 15 + (Math.sin(index * 2.1) * 4);
  const delay = index * 0.12;
  const colors = ['#F4C2C2', '#FFDAB9', '#D4B8E0', '#F0C75E', '#F7946B'];
  const color = colors[index % colors.length];
  return (
    <g style={{ animation: `bloom 0.6s ease-out ${delay}s both` }} transform={`translate(${x},${y})`}>
      <line x1="0" y1="0" x2="0" y2="6" stroke="#6B8E5A" strokeWidth="1" />
      {[0, 72, 144, 216, 288].map(a => (
        <circle key={a} cx={Math.cos(a * Math.PI / 180) * 2.5} cy={Math.sin(a * Math.PI / 180) * 2.5 - 2} r="2" fill={color} opacity="0.8" />
      ))}
      <circle cx="0" cy="-2" r="1.5" fill="#F0C75E" />
    </g>
  );
}

function Vine({ index }: { index: number }) {
  const x = 5 + (index % 6) * 16;
  const y = 28 + Math.floor(index / 6) * 20;
  const delay = index * 0.15;
  return (
    <g style={{ animation: `bloom 1s ease-out ${delay}s both` }} transform={`translate(${x},${y})`}>
      <path d={`M0,10 Q5,5 3,0 Q8,-3 12,2 Q16,-1 20,3`} fill="none" stroke="#6B8E5A" strokeWidth="1.5"
        strokeDasharray="200" style={{ animation: `vine-grow 1.5s ease-out ${delay}s both` }} />
      <circle cx="3" cy="0" r="1.5" fill="#9DC183" opacity="0.7" />
      <circle cx="12" cy="2" r="2" fill="#9DC183" opacity="0.8" />
      <circle cx="20" cy="3" r="1.5" fill="#9DC183" opacity="0.6" />
    </g>
  );
}

export default function Garden({ state }: Props) {
  const { entries } = state;
  const trees = entries.filter(e => e.category === 'movement' || e.category === 'rest');
  const flowers = entries.filter(e => e.category === 'senses' || e.category === 'connection');
  const vines = entries.filter(e => e.category === 'creation' || e.category === 'general');

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h2 className="text-2xl text-coral text-center mb-2">Your Gratitude Garden</h2>
      <p className="text-center text-warm/50 text-sm mb-4">
        {entries.length} gratitude{entries.length !== 1 ? 's' : ''} planted
      </p>

      {entries.length === 0 ? (
        <div className="text-center text-warm/40 mt-20">
          <p className="text-4xl mb-4">🌱</p>
          <p>Your garden is waiting for its first seed.</p>
          <p className="text-sm mt-1">Share what your body did today to start growing.</p>
        </div>
      ) : (
        <div className="bg-white/40 rounded-2xl p-2 shadow-sm">
          <svg viewBox="0 0 100 80" className="w-full" style={{ minHeight: 300 }}>
            {/* Sky gradient */}
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF8F0" />
                <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9DC183" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6B8E5A" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect width="100" height="80" fill="url(#sky)" rx="4" />
            {/* Ground */}
            <ellipse cx="50" cy="78" rx="55" ry="12" fill="url(#ground)" />
            {/* Sun */}
            <circle cx="82" cy="12" r="8" fill="#F0C75E" opacity="0.6" className="float-anim" />
            {/* Plants */}
            {trees.map((_, i) => <Tree key={`t${i}`} index={i} total={trees.length} />)}
            {flowers.map((_, i) => <Flower key={`f${i}`} index={i} />)}
            {vines.map((_, i) => <Vine key={`v${i}`} index={i} />)}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-3 mb-2 text-xs text-warm/60">
            <span>🌳 Movement ({trees.length})</span>
            <span>🌸 Senses ({flowers.length})</span>
            <span>🌿 Creation ({vines.length})</span>
          </div>
        </div>
      )}
    </div>
  );
}
