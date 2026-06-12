import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type OnSelectionChangeParams,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ServiceNode } from '@/components/nodes/ServiceNode';
import { CanvasControls } from './CanvasControls';
import { useAppStore } from '@/store/useAppStore';
import { useAppGraph } from '@/hooks/useAppGraph';
import type { NodeData } from '@/types/app';

const nodeTypes = { serviceNode: ServiceNode };

function GraphLoader() {
  const { selectedAppId, setSelectedNodeId, setMobilePanelOpen } = useAppStore();
  const { data, isLoading, isError, refetch } = useAppGraph(selectedAppId);
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (data) {
      setNodes(data.nodes);
      setEdges(data.edges);
      setTimeout(() => {
        void fitView({ padding: 0.15, duration: 400 });
      }, 50);
    }
  }, [data, setNodes, setEdges, fitView]);

  const handleNodesChange = useCallback(
    (changes: NodeChange<Node<NodeData>>[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  const handleSelectionChange = useCallback(
    ({ nodes: selected }: OnSelectionChangeParams) => {
      const first = selected[0];
      setSelectedNodeId(first ? first.id : null);
      // On mobile viewports, automatically open the drawer so the
      // inspector is immediately visible after tapping a node.
      if (first && window.innerWidth < 768) {
        setMobilePanelOpen(true);
      }
    },
    [setSelectedNodeId, setMobilePanelOpen]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((prev) =>
        addEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#7C3AED', strokeWidth: 2 },
          },
          prev
        )
      );
    },
    [setEdges]
  );

  if (isLoading) {
    return (
      <div className="canvas-overlay">
        <div className="canvas-spinner" aria-label="Loading graph">
          <div className="spinner-ring" />
          <span>Loading graph…</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="canvas-overlay">
        <div className="canvas-error" role="alert">
          <span className="error-icon">⚠</span>
          <p>Failed to load graph</p>
          <button className="retry-btn" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onSelectionChange={handleSelectionChange}
      onConnect={handleConnect}
      nodeTypes={nodeTypes}
      deleteKeyCode={['Delete', 'Backspace']}
      fitView
      colorMode="dark"
      panOnDrag={true}
      panOnScroll={false}
      zoomOnScroll={true}
      zoomOnPinch={true}
      zoomOnDoubleClick={false}
      proOptions={{ hideAttribution: false }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#333" />
      <MiniMap
        nodeColor={(n) => {
          const d = n.data as NodeData;
          return d.iconColor ?? '#7C3AED';
        }}
        maskColor="rgba(0,0,0,0.6)"
        style={{ background: '#1a1a1a', borderRadius: 8 }}
        className="canvas-minimap"
      />
      <CanvasControls />
    </ReactFlow>
  );
}

export function AppCanvas() {
  return (
    <main className="canvas-wrapper" aria-label="Service dependency canvas">
      <GraphLoader />
    </main>
  );
}
