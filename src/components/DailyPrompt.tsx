import { useState } from 'react';
import { PROMPTS } from '../data';
import type { AppState } from '../types';
import { addEntry } from '../store';

interface Props {
  state: AppState;
  onUpdate: (state: AppState, milestone: string | null) => void;
}

export default function DailyPrompt({ state, onUpdate }: Props) {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const todayEntries = state.entries.filter(e => e.date === today);

  const handleSubmit = () => {
    if (!text.trim()) return;
    const { state: newState, milestone } = addEntry(state, text.trim());
    onUpdate(newState, milestone);
    setText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="text-center mb-8 fade-in">
        <h1 className="text-3xl text-coral mb-2">Body Neutrality Mirror</h1>
        <p className="text-warm/70 text-sm">Reflect on what your body does, not how it looks</p>
      </div>

      {/* Streak */}
      {state.streak > 0 && (
        <div className="text-center mb-6 fade-in">
          <span className="inline-block bg-peach/40 text-bark px-4 py-1.5 rounded-full text-sm">
            🔥 {state.streak} day streak
          </span>
        </div>
      )}

      {/* Prompt card */}
      <div className="bg-white/60 backdrop-blur rounded-2xl p-6 shadow-sm mb-6 fade-in">
        <p className="text-warm/60 text-sm mb-2">Today's inspiration:</p>
        <p className="text-coral italic text-lg mb-1">"{prompt}"</p>
        <button
          onClick={() => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])}
          className="text-xs text-warm/40 hover:text-warm/60 transition"
        >
          ↻ another suggestion
        </button>
      </div>

      {/* Input */}
      <div className="bg-white/60 backdrop-blur rounded-2xl p-6 shadow-sm mb-6 fade-in">
        <label className="block text-warm/80 mb-3 text-lg">
          What did your body do for you today?
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="My hands made a warm meal today..."
          className="w-full bg-cream/80 rounded-xl p-4 text-bark placeholder:text-warm/30 resize-none focus:outline-none focus:ring-2 focus:ring-blush/50 min-h-[100px]"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="mt-3 w-full bg-coral text-white py-3 rounded-xl hover:bg-warm transition disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          Plant this gratitude 🌱
        </button>
      </div>

      {/* Success flash */}
      {submitted && (
        <div className="text-center text-sage-dark mb-4 fade-in celebrate">
          ✨ Beautiful! Your gratitude is growing ✨
        </div>
      )}

      {/* Today's entries */}
      {todayEntries.length > 0 && (
        <div className="fade-in">
          <p className="text-warm/50 text-sm mb-3">Today's gratitudes ({todayEntries.length})</p>
          <div className="space-y-2">
            {todayEntries.map(e => (
              <div key={e.id} className="bg-white/40 rounded-xl px-4 py-3 text-bark/80 text-sm">
                {e.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
