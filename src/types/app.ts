import type { Node, Edge } from '@xyflow/react';

export type NodeStatus = 'healthy' | 'degraded' | 'error';

export interface NodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  iconColor: string;
  costPerHour: number;
  status: NodeStatus;
  cpu: number;
  memory: number;
  disk: number;
  region: number;
  sliderValue: number;
  description: string;
}

// AppNode and AppEdge alias the ReactFlow generics directly so there is
// no structural mismatch and no type casts are needed at the call-sites.
export type AppNode = Node<NodeData, 'serviceNode'>;
export type AppEdge = Edge;

export interface AppGraph {
  nodes: AppNode[];
  edges: AppEdge[];
}

export interface App {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface AppsResponse {
  apps: App[];
}

export interface GraphResponse {
  graph: AppGraph;
}
