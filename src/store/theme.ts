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
      mode: 'dark',
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
  // The persist middleware's default storage (createJSONStorage) returns the
  // already-parsed { state, version } object, NOT a raw JSON string. The old
  // code did `typeof stored === 'string'` which was always false, so the
  // user's saved theme was silently dropped on every reload — always dark.
  //
  // Delegate to the middleware's own rehydrate so storage-shape handling stays
  // the middleware's job. The store's `onRehydrateStorage` callback applies
  // the mode to the DOM whenever a stored state is found. After rehydrate
  // resolves (synchronously for localStorage), if the store still reports the
  // initial 'dark' default AND there was no persisted state in storage, we
  // explicitly pin dark so the DOM matches.
  const storage = useThemeStore.persist.getOptions().storage;
  const hasStored = (() => {
    try {
      if (!storage) return false;
      const v = storage.getItem(THEME_STORAGE_KEY);
      // For the default localStorage storage v is the parsed StorageValue
      // ({state, version}); for async storages it is a Promise. null/undefined
      // means no stored entry. Anything else means we have a stored value.
      return v != null && typeof v !== 'function';
    } catch {
      return false;
    }
  })();

  useThemeStore.persist.rehydrate();

  if (!hasStored) {
    applyMode('dark');
    useThemeStore.setState({ mode: 'dark' });
  }
};
