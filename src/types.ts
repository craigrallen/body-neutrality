export interface Entry {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  category: 'movement' | 'senses' | 'creation' | 'rest' | 'connection' | 'general';
  bodyParts: string[];
}

export interface AppState {
  entries: Entry[];
  streak: number;
  lastEntryDate: string;
  milestones: string[];
}

export type TabId = 'home' | 'garden' | 'bodymap' | 'reflect' | 'affirm';
