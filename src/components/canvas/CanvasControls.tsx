import { useCallback } from 'react';
import { useReactFlow, type Node } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2, Plus } from 'lucide-react';
import type { NodeData } from '@/types/app';

interface CanvasControlsProps {
  _unused?: never;
}

function generateId(): string {
  return `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function createDefaultNodeData(): NodeData {
  return {
    label: 'New Service',
    icon: '⚡',
    iconColor: '#7C3AED',
    costPerHour: 0.05,
    status: 'healthy',
    cpu: 0.1,
    memory: 0.25,
    disk: 5.0,
    region: 1,
    sliderValue: 0,
    description: 'New service node',
  };
}

export function CanvasControls(_props: CanvasControlsProps) {
  const { zoomIn, zoomOut, fitView, setNodes } = useReactFlow();

  const handleFitView = useCallback(() => {
    void fitView({ padding: 0.15, duration: 400 });
  }, [fitView]);

  const handleZoomIn = useCallback(() => {
    void zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    void zoomOut({ duration: 200 });
  }, [zoomOut]);

  const handleAddNode = useCallback(() => {
    const id = generateId();
    const newNode: Node<NodeData> = {
      id,
      type: 'serviceNode',
      position: {
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 300,
      },
      data: createDefaultNodeData(),
    };
    setNodes((prev) => [...prev, newNode]);
  }, [setNodes]);

  return (
    <div className="canvas-controls" role="toolbar" aria-label="Canvas controls">
      <button className="ctrl-btn" onClick={handleZoomIn} aria-label="Zoom in" title="Zoom in">
        <ZoomIn size={14} />
      </button>
      <button className="ctrl-btn" onClick={handleZoomOut} aria-label="Zoom out" title="Zoom out">
        <ZoomOut size={14} />
      </button>
      <button className="ctrl-btn" onClick={handleFitView} aria-label="Fit view" title="Fit view">
        <Maximize2 size={14} />
      </button>
      <div className="ctrl-divider" aria-hidden="true" />
      <button
        className="ctrl-btn ctrl-btn-primary"
        onClick={handleAddNode}
        aria-label="Add node"
        title="Add node"
      >
        <Plus size={14} />
        <span>Add Node</span>
      </button>
    </div>
  );
}
