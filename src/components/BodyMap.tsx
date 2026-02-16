import type { AppState } from '../types';
import { getBodyPartCounts } from '../store';

interface Props { state: AppState }

const PART_POSITIONS: Record<string, { cx: number; cy: number; r: number; label: string }> = {
  head:      { cx: 50, cy: 12, r: 8, label: 'Head & Mind' },
  eyes:      { cx: 47, cy: 10, r: 3, label: 'Eyes' },
  ears:      { cx: 58, cy: 12, r: 3, label: 'Ears' },
  mouth:     { cx: 50, cy: 16, r: 3, label: 'Mouth' },
  nose:      { cx: 43, cy: 13, r: 2.5, label: 'Nose' },
  shoulders: { cx: 50, cy: 26, r: 6, label: 'Shoulders' },
  arms:      { cx: 30, cy: 38, r: 5, label: 'Arms' },
  hands:     { cx: 24, cy: 52, r: 5, label: 'Hands' },
  chest:     { cx: 50, cy: 35, r: 7, label: 'Heart & Lungs' },
  back:      { cx: 68, cy: 38, r: 5, label: 'Back' },
  core:      { cx: 50, cy: 48, r: 6, label: 'Core' },
  legs:      { cx: 44, cy: 68, r: 6, label: 'Legs' },
  feet:      { cx: 50, cy: 85, r: 5, label: 'Feet' },
};

export default function BodyMap({ state }: Props) {
  const counts = getBodyPartCounts(state);
  const max = Math.max(1, ...Object.values(counts));

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h2 className="text-2xl text-coral text-center mb-2">Body Map of Function</h2>
      <p className="text-center text-warm/50 text-sm mb-4">See which parts you've appreciated most</p>

      <div className="bg-white/40 rounded-2xl p-4 shadow-sm">
        <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: 450 }}>
          {/* Body silhouette - abstract/gentle */}
          <ellipse cx="50" cy="12" rx="8" ry="9" fill="#FFDAB9" opacity="0.3" />
          <rect x="40" y="20" width="20" height="35" rx="8" fill="#FFDAB9" opacity="0.2" />
          <rect x="30" y="24" width="12" height="30" rx="5" fill="#FFDAB9" opacity="0.15" transform="rotate(-10 36 39)" />
          <rect x="58" y="24" width="12" height="30" rx="5" fill="#FFDAB9" opacity="0.15" transform="rotate(10 64 39)" />
          <rect x="42" y="54" width="8" height="35" rx="4" fill="#FFDAB9" opacity="0.15" transform="rotate(-3 46 71)" />
          <rect x="52" y="54" width="8" height="35" rx="4" fill="#FFDAB9" opacity="0.15" transform="rotate(3 56 71)" />

          {/* Heat circles */}
          {Object.entries(PART_POSITIONS).map(([part, pos]) => {
            const count = counts[part] || 0;
            const intensity = count / max;
            const color = intensity > 0.6 ? '#F7946B' : intensity > 0.3 ? '#F0C75E' : '#D4B8E0';
            return (
              <g key={part}>
                <circle
                  cx={pos.cx} cy={pos.cy} r={pos.r + intensity * 3}
                  fill={count > 0 ? color : '#E8E0D8'}
                  opacity={count > 0 ? 0.3 + intensity * 0.5 : 0.15}
                  className={count > 0 ? 'sparkle' : ''}
                  style={{ animationDelay: `${Math.random() * 2}s` }}
                />
                {count > 0 && (
                  <text x={pos.cx} y={pos.cy + 1} textAnchor="middle" fontSize="3" fill="#8B6F47" fontWeight="bold">
                    {count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend list */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {Object.entries(PART_POSITIONS)
            .filter(([part]) => (counts[part] || 0) > 0)
            .sort((a, b) => (counts[b[0]] || 0) - (counts[a[0]] || 0))
            .map(([part, pos]) => (
              <div key={part} className="flex items-center gap-2 text-sm text-bark/70">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: `rgba(247,148,107,${Math.min(1, (counts[part] || 0) / max)})`, color: 'white' }}>
                  {counts[part]}
                </span>
                {pos.label}
              </div>
            ))}
        </div>

        {state.entries.length === 0 && (
          <p className="text-center text-warm/40 mt-4 text-sm">Start logging gratitudes to light up your body map!</p>
        )}
      </div>
    </div>
  );
}
