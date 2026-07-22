import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/design-system/tokens';
import { THEME_STORAGE_KEY } from '@/design-system/tokens';

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  applyToDocument: () => void;
};

const applyMode = (mode: ThemeMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  root.style.colorScheme = mode;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      setMode: (mode) => {
        applyMode(mode);
        set({ mode });
      },
      toggle: () => {
        const next = get().mode === 'dark' ? 'light' : 'dark';
        applyMode(next);
        set({ mode: next });
      },
      applyToDocument: () => {
        applyMode(get().mode);
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) applyMode(state.mode);
      },
      skipHydration: true,
    },
  ),
);

export const initTheme = () => {
  let stored: unknown = null;
  try {
    stored = useThemeStore.persist.getOptions().storage?.getItem(THEME_STORAGE_KEY);
  } catch {
  }
  if (typeof stored === 'string') {
    try {
      const parsed = JSON.parse(stored) as { state?: { mode?: ThemeMode } };
      if (parsed.state?.mode) {
        applyMode(parsed.state.mode);
        useThemeStore.setState({ mode: parsed.state.mode });
        return;
      }
    } catch {
    }
  }
  const initial: ThemeMode = 'light';
  applyMode(initial);
  useThemeStore.setState({ mode: initial });
};
