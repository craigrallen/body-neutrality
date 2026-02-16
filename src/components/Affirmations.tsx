import { useState } from 'react';
import { AFFIRMATIONS } from '../data';

export default function Affirmations() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [touchStart, setTouchStart] = useState(0);

  const next = (dir: 'left' | 'right') => {
    setDirection(dir);
    setTimeout(() => {
      setIndex(i => (dir === 'right' ? (i + 1) % AFFIRMATIONS.length : (i - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length));
      setDirection(null);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) next(diff > 0 ? 'left' : 'right');
  };

  const cardStyle = direction
    ? { transform: `translateX(${direction === 'left' ? -120 : 120}%) rotate(${direction === 'left' ? -10 : 10}deg)`, opacity: 0, transition: 'all 0.3s ease' }
    : { transform: 'translateX(0) rotate(0)', opacity: 1, transition: 'all 0.3s ease' };

  const colors = [
    'from-blush/30 to-peach/30',
    'from-lavender/30 to-blush/30',
    'from-peach/30 to-gold/20',
    'from-sage/20 to-peach/20',
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h2 className="text-2xl text-coral text-center mb-2">Affirmation Cards</h2>
      <p className="text-center text-warm/50 text-sm mb-8">Swipe for body-neutral affirmations</p>

      <div className="relative h-80 flex items-center justify-center"
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* Background cards */}
        <div className="absolute w-72 h-64 bg-white/20 rounded-2xl transform rotate-3 scale-95" />
        <div className="absolute w-72 h-64 bg-white/30 rounded-2xl transform -rotate-2 scale-97" />

        {/* Active card */}
        <div
          className={`relative w-72 h-64 bg-gradient-to-br ${colors[index % colors.length]} backdrop-blur rounded-2xl shadow-lg flex items-center justify-center p-8 cursor-grab active:cursor-grabbing`}
          style={cardStyle}
        >
          <p className="text-xl text-bark text-center leading-relaxed font-medium">
            {AFFIRMATIONS[index]}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-8 mt-4">
        <button onClick={() => next('left')} className="w-12 h-12 rounded-full bg-white/40 text-warm hover:bg-white/60 transition text-xl">
          ←
        </button>
        <span className="text-warm/40 text-sm">{index + 1} / {AFFIRMATIONS.length}</span>
        <button onClick={() => next('right')} className="w-12 h-12 rounded-full bg-white/40 text-warm hover:bg-white/60 transition text-xl">
          →
        </button>
      </div>

      {/* Share */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigator.clipboard?.writeText(AFFIRMATIONS[index])}
          className="text-sm text-warm/40 hover:text-warm/60 transition"
        >
          📋 Copy to clipboard
        </button>
      </div>
    </div>
  );
}
