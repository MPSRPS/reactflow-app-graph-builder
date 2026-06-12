import { create } from 'zustand';
import type { AppStore, InspectorTab } from '@/types/store';

export const useAppStore = create<AppStore>()((set) => ({
  selectedAppId: 'supertokens-golang',
  setSelectedAppId: (id: string) => set({ selectedAppId: id, selectedNodeId: null }),

  selectedNodeId: null,
  setSelectedNodeId: (id: string | null) => set({ selectedNodeId: id }),

  isMobilePanelOpen: false,
  setMobilePanelOpen: (open: boolean) => set({ isMobilePanelOpen: open }),

  activeInspectorTab: 'config',
  setActiveInspectorTab: (tab: InspectorTab) => set({ activeInspectorTab: tab }),

  isDarkMode: true,
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkMode: next };
    }),
}));
