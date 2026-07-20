import { create } from 'zustand';

type EasterEggState = {
  bugs: number;
  sessionSeconds: number;
  incrementBugs: (by?: number) => void;
  tickSession: () => void;
  resetBugs: () => void;
};

export const useEasterEggStore = create<EasterEggState>((set) => ({
  bugs: 0,
  sessionSeconds: 0,
  incrementBugs: (by = 1) => set((s) => ({ bugs: s.bugs + by })),
  tickSession: () => set((s) => ({ sessionSeconds: s.sessionSeconds + 1 })),
  resetBugs: () => set({ bugs: 0 }),
}));
