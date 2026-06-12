import type { ReactNode } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { InspectorTab } from '@/types/store';
import { cn } from '@/lib/utils';

interface InspectorTabsProps {
  configContent: ReactNode;
  runtimeContent: ReactNode;
}

const TABS: Array<{ key: InspectorTab; label: string }> = [
  { key: 'config', label: 'Config' },
  { key: 'runtime', label: 'Runtime' },
];

export function InspectorTabs({ configContent, runtimeContent }: InspectorTabsProps) {
  const { activeInspectorTab, setActiveInspectorTab } = useAppStore();

  return (
    <div className="inspector-tabs">
      <div className="inspector-tab-list" role="tablist" aria-label="Inspector tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            id={`tab-${key}`}
            aria-selected={activeInspectorTab === key}
            aria-controls={`tabpanel-${key}`}
            className={cn('inspector-tab', activeInspectorTab === key && 'inspector-tab-active')}
            onClick={() => setActiveInspectorTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        id={`tabpanel-${activeInspectorTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeInspectorTab}`}
        className="inspector-tab-panel"
      >
        {activeInspectorTab === 'config' ? configContent : runtimeContent}
      </div>
    </div>
  );
}
