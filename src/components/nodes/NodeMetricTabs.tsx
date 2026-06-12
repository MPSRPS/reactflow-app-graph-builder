import { useCallback } from 'react';
import { cn } from '@/lib/utils';

type MetricTab = 'cpu' | 'memory' | 'disk' | 'region';

interface NodeMetricTabsProps {
  activeTab: MetricTab;
  onTabChange: (tab: MetricTab) => void;
  cpu: number;
  memory: number;
  disk: number;
  region: number;
}

const TABS: Array<{ key: MetricTab; label: string; icon: string }> = [
  { key: 'cpu', label: 'CPU', icon: '⊞' },
  { key: 'memory', label: 'Memory', icon: '⊟' },
  { key: 'disk', label: 'Disk', icon: '⊠' },
  { key: 'region', label: 'Region', icon: '⊡' },
];

export function NodeMetricTabs({
  activeTab,
  onTabChange,
  cpu,
  memory,
  disk,
  region,
}: NodeMetricTabsProps) {
  const getMetricValue = useCallback(
    (key: MetricTab): string => {
      switch (key) {
        case 'cpu': return cpu.toFixed(2);
        case 'memory': return `${memory.toFixed(2)} GB`;
        case 'disk': return `${disk.toFixed(2)} GB`;
        case 'region': return String(region);
      }
    },
    [cpu, memory, disk, region]
  );

  return (
    <div className="metric-tabs" role="tablist" aria-label="Metrics">
      {TABS.map(({ key, label, icon }) => (
        <button
          key={key}
          role="tab"
          aria-selected={activeTab === key}
          className={cn('metric-tab', activeTab === key && 'metric-tab-active')}
          onClick={() => onTabChange(key)}
          title={`${label}: ${getMetricValue(key)}`}
        >
          <span className="metric-tab-icon" aria-hidden="true">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export type { MetricTab };
