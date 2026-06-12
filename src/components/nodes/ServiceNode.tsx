import { memo, useState, useCallback } from 'react';
import { Handle, Position, useReactFlow, type NodeProps, type Node } from '@xyflow/react';
import { Settings } from 'lucide-react';
import type { NodeData } from '@/types/app';
import { NodeStatusPill } from './NodeStatusPill';
import { NodeMetricTabs, type MetricTab } from './NodeMetricTabs';
import { useAppStore } from '@/store/useAppStore';

type ServiceFlowNode = Node<NodeData, 'serviceNode'>;
type ServiceNodeProps = NodeProps<ServiceFlowNode>;

function getTabValue(data: NodeData, tab: MetricTab): number {
  switch (tab) {
    case 'cpu':
      return data.cpu * 100;
    case 'memory':
      return Math.min(data.memory * 200, 100);
    case 'disk':
      return Math.min((data.disk / 20) * 100, 100);
    case 'region':
      return Math.min(data.region * 25, 100);
  }
}

function ServiceNodeInner({ id, data, selected }: ServiceNodeProps) {
  const [activeTab, setActiveTab] = useState<MetricTab>('cpu');
  const { setNodes } = useReactFlow();
  const setActiveInspectorTab = useAppStore((s) => s.setActiveInspectorTab);

  const handleTabChange = useCallback(
    (tab: MetricTab) => {
      setActiveTab(tab);
      setActiveInspectorTab(tab === 'cpu' || tab === 'memory' ? 'config' : 'runtime');
    },
    [setActiveInspectorTab]
  );

  const sliderPercent = getTabValue(data, activeTab);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, data: { ...(n.data as NodeData), sliderValue: val } }
            : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className={`service-node ${selected ? 'service-node-selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="node-handle" />

      <div className="sn-header">
        <div className="sn-icon" style={{ background: data.iconColor }} aria-hidden="true">
          {data.icon}
        </div>
        <span className="sn-label">{data.label}</span>
        <div className="sn-header-right">
          <span
            className="cost-badge"
            aria-label={`Cost: $${data.costPerHour.toFixed(2)} per hour`}
          >
            ${data.costPerHour.toFixed(2)}/HR
          </span>
          <button
            className="sn-settings-btn"
            aria-label="Settings"
            title="Node settings"
          >
            <Settings size={12} />
          </button>
        </div>
      </div>

      <div className="sn-metrics" aria-label="Metrics">
        <span title="CPU">{data.cpu.toFixed(2)}</span>
        <span title="Memory">{data.memory.toFixed(2)} GB</span>
        <span title="Disk">{data.disk.toFixed(2)} GB</span>
        <span title="Regions">{data.region}</span>
      </div>

      <NodeMetricTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cpu={data.cpu}
        memory={data.memory}
        disk={data.disk}
        region={data.region}
      />

      <div className="sn-slider-row">
        <input
          type="range"
          min={0}
          max={100}
          value={data.sliderValue}
          onChange={handleSliderChange}
          className="sn-slider"
          aria-label={`${activeTab} slider`}
        />
        <span className="sn-slider-value">{sliderPercent.toFixed(2)}</span>
      </div>

      <div className="sn-footer">
        <NodeStatusPill status={data.status} />
        <span className="aws-logo" aria-label="Amazon Web Services">
          aws
          <svg
            width="18"
            height="11"
            viewBox="0 0 60 36"
            fill="none"
            aria-hidden="true"
            style={{ display: 'inline', marginLeft: 2 }}
          >
            <path
              d="M17 22c-5.5 3-8.5 3-10 1.5-2-2 0-7 5-11"
              stroke="#FF9900"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M43 22c5.5 3 8.5 3 10 1.5 2-2 0-7-5-11"
              stroke="#FF9900"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M10 18C10 9 19 2 30 2s20 7 20 16-9 16-20 16"
              stroke="#FF9900"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="node-handle" />
    </div>
  );
}

export const ServiceNode = memo(ServiceNodeInner);
