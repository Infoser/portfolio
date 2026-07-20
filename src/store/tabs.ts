import { create } from 'zustand';
import type { SectionKey } from '@/config/sections-manifest';

type TabsState = {
  openTabs: SectionKey[];
  activeTab: SectionKey | null;
  open: (key: SectionKey) => void;
  close: (key: SectionKey) => void;
  setActive: (key: SectionKey) => void;
};

export const useTabsStore = create<TabsState>((set, get) => ({
  openTabs: [],
  activeTab: null,
  open: (key) => {
    if (!get().openTabs.includes(key)) {
      set((s) => ({ openTabs: [...s.openTabs, key], activeTab: key }));
    } else {
      set({ activeTab: key });
    }
  },
  close: (key) => {
    const remaining = get().openTabs.filter((t) => t !== key);
    const wasActive = get().activeTab === key;
    set((s) => ({
      openTabs: remaining,
      activeTab: wasActive
        ? remaining.length > 0
          ? remaining[remaining.length - 1]
          : null
        : s.activeTab,
    }));
  },
  setActive: (key) => {
    if (get().openTabs.includes(key)) {
      set({ activeTab: key });
    }
  },
}));
