import { useState, useEffect } from 'react';
import type { TabId, AppState } from './types';
import { loadState } from './store';
import DailyPrompt from './components/DailyPrompt';
import Garden from './components/Garden';
import BodyMap from './components/BodyMap';
import Reflection from './components/Reflection';
import Affirmations from './components/Affirmations';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home', icon: '🌅', label: 'Today' },
  { id: 'garden', icon: '🌿', label: 'Garden' },
  { id: 'bodymap', icon: '✨', label: 'Body Map' },
  { id: 'reflect', icon: '📝', label: 'Reflect' },
  { id: 'affirm', icon: '💛', label: 'Affirm' },
];

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [tab, setTab] = useState<TabId>('home');
  const [milestone, setMilestone] = useState<string | null>(null);

  const handleUpdate = (newState: AppState, ms: string | null) => {
    setState(newState);
    if (ms) {
      setMilestone(ms);
      setTimeout(() => setMilestone(null), 3000);
    }
  };

  // Sync state from storage on focus
  useEffect(() => {
    const handler = () => setState(loadState());
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-bark relative">
      {/* Milestone toast */}
      {milestone && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur shadow-lg rounded-2xl px-6 py-4 text-center celebrate fade-in">
          <p className="text-lg">{milestone}</p>
        </div>
      )}

      {/* Content */}
      {tab === 'home' && <DailyPrompt state={state} onUpdate={handleUpdate} />}
      {tab === 'garden' && <Garden state={state} />}
      {tab === 'bodymap' && <BodyMap state={state} />}
      {tab === 'reflect' && <Reflection state={state} />}
      {tab === 'affirm' && <Affirmations />}

      {/* Tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-blush/20 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-all ${
                tab === t.id ? 'text-coral scale-105' : 'text-warm/40 hover:text-warm/60'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-[10px]">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
