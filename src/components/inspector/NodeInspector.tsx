import { useCallback, useId } from 'react';
import { useNodes, useReactFlow } from '@xyflow/react';
import { useAppStore } from '@/store/useAppStore';
import { NodeStatusPill } from '@/components/nodes/NodeStatusPill';
import { InspectorTabs } from './InspectorTabs';
import { SyncedSlider } from './SyncedSlider';
import type { NodeData } from '@/types/app';

function isNodeData(data: unknown): data is NodeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'label' in data &&
    'status' in data &&
    'sliderValue' in data
  );
}

export function NodeInspector() {
  const { selectedNodeId } = useAppStore();
  const { setNodes } = useReactFlow();

  // useNodes() subscribes to the ReactFlow store and re-renders whenever nodes
  // change — unlike getNodes() which is a non-reactive snapshot and can return
  // stale/empty data when the component first mounts after a selection event.
  const nodes = useNodes();

  const nameInputId = useId();
  const descInputId = useId();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const nodeData = selectedNode && isNodeData(selectedNode.data) ? selectedNode.data : null;

  const updateNodeData = useCallback(
    (patch: Partial<NodeData>) => {
      if (!selectedNodeId) return;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === selectedNodeId
            ? { ...n, data: { ...(n.data as NodeData), ...patch } }
            : n
        )
      );
    },
    [selectedNodeId, setNodes]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.slice(0, 64);
      updateNodeData({ label: val });
    },
    [updateNodeData]
  );

  const handleDescChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value.slice(0, 256);
      updateNodeData({ description: val });
    },
    [updateNodeData]
  );

  const handleSliderChange = useCallback(
    (value: number) => {
      updateNodeData({ sliderValue: value });
    },
    [updateNodeData]
  );

  if (!nodeData) {
    return (
      <div className="inspector-loading" role="status" aria-label="Loading node data">
        <div className="spinner-ring" style={{ width: 20, height: 20, borderWidth: 2 }} />
      </div>
    );
  }

  const configContent = (
    <div className="inspector-fields">
      <div className="inspector-field">
        <label htmlFor={nameInputId} className="field-label">
          Name
        </label>
        <input
          id={nameInputId}
          type="text"
          value={nodeData.label}
          onChange={handleNameChange}
          className="field-input"
          maxLength={64}
          aria-label="Node name"
        />
      </div>
      <div className="inspector-field">
        <label htmlFor={descInputId} className="field-label">
          Description
        </label>
        <textarea
          id={descInputId}
          value={nodeData.description}
          onChange={handleDescChange}
          className="field-textarea"
          maxLength={256}
          rows={3}
          aria-label="Node description"
        />
      </div>
      <div className="inspector-field">
        <span className="field-label">Cost / Hour</span>
        <span className="field-readonly">${nodeData.costPerHour.toFixed(3)}</span>
      </div>
      <div className="inspector-field">
        <span className="field-label">Region</span>
        <span className="field-readonly">{nodeData.region}</span>
      </div>
    </div>
  );

  const runtimeContent = (
    <div className="inspector-fields">
      <div className="inspector-field">
        <span className="field-label">CPU Usage</span>
        <span className="field-readonly">{(nodeData.cpu * 100).toFixed(1)}%</span>
      </div>
      <div className="inspector-field">
        <span className="field-label">Memory</span>
        <span className="field-readonly">{nodeData.memory.toFixed(2)} GB</span>
      </div>
      <div className="inspector-field">
        <span className="field-label">Disk</span>
        <span className="field-readonly">{nodeData.disk.toFixed(2)} GB</span>
      </div>
    </div>
  );

  return (
    <div className="node-inspector" aria-label="Node inspector">
      <div className="inspector-header">
        <div className="inspector-icon" style={{ background: nodeData.iconColor }} aria-hidden="true">
          {nodeData.icon}
        </div>
        <span className="inspector-name">{nodeData.label}</span>
        <NodeStatusPill status={nodeData.status} />
      </div>

      <SyncedSlider
        value={nodeData.sliderValue}
        onChange={handleSliderChange}
        label="Slider"
      />

      <InspectorTabs configContent={configContent} runtimeContent={runtimeContent} />
    </div>
  );
}
