import type { AppState } from '../types';
import { getWeekEntries, getWordFrequency } from '../store';

interface Props { state: AppState }

export default function Reflection({ state }: Props) {
  const weekEntries = getWeekEntries(state);
  const words = getWordFrequency(weekEntries);
  const maxFreq = words.length > 0 ? words[0][1] : 1;

  const sizeClass = (freq: number) => {
    const ratio = freq / maxFreq;
    if (ratio > 0.8) return 'word-xl';
    if (ratio > 0.6) return 'word-lg';
    if (ratio > 0.4) return 'word-md';
    if (ratio > 0.2) return 'word-sm';
    return 'word-xs';
  };

  const colors = ['text-coral', 'text-warm', 'text-sage-dark', 'text-lavender', 'text-gold', 'text-blush'];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h2 className="text-2xl text-coral text-center mb-2">Weekly Reflection</h2>
      <p className="text-center text-warm/50 text-sm mb-6">
        {weekEntries.length} entries this week
      </p>

      {weekEntries.length === 0 ? (
        <div className="text-center text-warm/40 mt-20">
          <p className="text-4xl mb-4">📝</p>
          <p>No entries this week yet.</p>
          <p className="text-sm mt-1">Start sharing gratitudes to see your word cloud!</p>
        </div>
      ) : (
        <>
          {/* Word cloud */}
          <div className="bg-white/40 rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex flex-wrap justify-center items-center gap-3">
              {words.map(([word, freq], i) => (
                <span
                  key={word}
                  className={`${sizeClass(freq)} ${colors[i % colors.length]} font-medium transition-all hover:scale-110 cursor-default`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/40 rounded-xl p-4 text-center">
              <p className="text-2xl text-coral font-bold">{weekEntries.length}</p>
              <p className="text-xs text-warm/50">entries</p>
            </div>
            <div className="bg-white/40 rounded-xl p-4 text-center">
              <p className="text-2xl text-sage-dark font-bold">
                {new Set(weekEntries.flatMap(e => e.bodyParts)).size}
              </p>
              <p className="text-xs text-warm/50">body parts</p>
            </div>
            <div className="bg-white/40 rounded-xl p-4 text-center">
              <p className="text-2xl text-gold font-bold">
                {new Set(weekEntries.map(e => e.category)).size}
              </p>
              <p className="text-xs text-warm/50">categories</p>
            </div>
          </div>

          {/* Recent entries list */}
          <div className="mt-6">
            <p className="text-warm/50 text-sm mb-3">This week's entries</p>
            <div className="space-y-2">
              {weekEntries.slice().reverse().slice(0, 10).map(e => (
                <div key={e.id} className="bg-white/30 rounded-xl px-4 py-3 text-bark/70 text-sm fade-in">
                  <span className="text-warm/40 text-xs">{new Date(e.timestamp).toLocaleDateString()}</span>
                  <p className="mt-1">{e.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
