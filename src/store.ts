import type { Entry, AppState } from './types';
import { CATEGORIES, BODY_PARTS, MILESTONES } from './data';

const STORAGE_KEY = 'body-neutrality-state';

const defaultState: AppState = {
  entries: [],
  streak: 0,
  lastEntryDate: '',
  milestones: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return JSON.parse(raw);
  } catch { return defaultState; }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function categorize(text: string): Entry['category'] {
  const lower = text.toLowerCase();
  let best: Entry['category'] = 'general';
  let bestScore = 0;
  for (const [cat, { keywords }] of Object.entries(CATEGORIES)) {
    const score = keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = cat as Entry['category']; }
  }
  return best;
}

export function detectBodyParts(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.entries(BODY_PARTS)
    .filter(([, keywords]) => keywords.some(k => lower.includes(k)))
    .map(([part]) => part);
}

export function addEntry(state: AppState, text: string): { state: AppState; milestone: string | null } {
  const today = new Date().toISOString().slice(0, 10);
  const entry: Entry = {
    id: crypto.randomUUID(),
    text,
    date: today,
    timestamp: Date.now(),
    category: categorize(text),
    bodyParts: detectBodyParts(text),
  };

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = state.lastEntryDate === yesterday || state.lastEntryDate === today
    ? (state.lastEntryDate === today ? state.streak : state.streak + 1)
    : 1;

  const entries = [...state.entries, entry];
  const count = entries.length;
  let milestone: string | null = null;
  if (MILESTONES[count] && !state.milestones.includes(MILESTONES[count])) {
    milestone = MILESTONES[count];
  }

  const newState: AppState = {
    entries,
    streak: newStreak,
    lastEntryDate: today,
    milestones: milestone ? [...state.milestones, milestone] : state.milestones,
  };
  saveState(newState);
  return { state: newState, milestone };
}

export function getWeekEntries(state: AppState): Entry[] {
  const weekAgo = Date.now() - 7 * 86400000;
  return state.entries.filter(e => e.timestamp > weekAgo);
}

export function getWordFrequency(entries: Entry[]): [string, number][] {
  const freq: Record<string, number> = {};
  const stopWords = new Set(['my', 'i', 'me', 'the', 'a', 'an', 'to', 'and', 'of', 'for', 'in', 'it', 'was', 'is', 'that', 'this', 'with', 'on', 'at', 'from', 'but', 'or', 'so', 'be', 'do', 'did', 'has', 'had', 'have', 'been', 'today', 'body']);
  entries.forEach(e => {
    e.text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w))
      .forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30);
}

export function getBodyPartCounts(state: AppState): Record<string, number> {
  const counts: Record<string, number> = {};
  Object.keys(BODY_PARTS).forEach(p => counts[p] = 0);
  state.entries.forEach(e => e.bodyParts.forEach(p => counts[p] = (counts[p] || 0) + 1));
  return counts;
}
