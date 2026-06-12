export type InspectorTab = 'config' | 'runtime';

export interface AppStore {
  selectedAppId: string | null;
  setSelectedAppId: (id: string) => void;

  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  isMobilePanelOpen: boolean;
  setMobilePanelOpen: (open: boolean) => void;

  activeInspectorTab: InspectorTab;
  setActiveInspectorTab: (tab: InspectorTab) => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
