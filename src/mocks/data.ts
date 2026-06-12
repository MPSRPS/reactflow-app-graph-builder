import type { App, AppGraph, AppNode, AppEdge, NodeStatus } from '@/types/app';

export const APPS: App[] = [
  { id: 'supertokens-golang', name: 'supertokens-golang', icon: '⚡', color: '#7C3AED' },
  { id: 'supertokens-java', name: 'supertokens-java', icon: '⚙', color: '#7C3AED' },
  { id: 'supertokens-python', name: 'supertokens-python', icon: '🚀', color: '#DC2626' },
  { id: 'supertokens-ruby', name: 'supertokens-ruby', icon: '📦', color: '#7C3AED' },
  { id: 'supertokens-go', name: 'supertokens-go', icon: '🧩', color: '#7C3AED' },
];

const STATUSES: NodeStatus[] = ['healthy', 'degraded', 'error'];

function randomStatus(): NodeStatus {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}

function randomBetween(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

const NODE_TEMPLATES: Array<{
  label: string;
  icon: string;
  iconColor: string;
  costPerHour: number;
}> = [
  { label: 'Postgres', icon: '🐘', iconColor: '#4169E1', costPerHour: 0.03 },
  { label: 'Redis', icon: '🟥', iconColor: '#DC2626', costPerHour: 0.03 },
  { label: 'MongoDB', icon: '🍃', iconColor: '#16A34A', costPerHour: 0.03 },
  { label: 'Service', icon: '⚡', iconColor: '#7C3AED', costPerHour: 0.05 },
];

function buildNodes(appId: string): AppNode[] {
  const positions: Array<{ x: number; y: number }> = [
    { x: 80, y: 60 },
    { x: 520, y: 60 },
    { x: 80, y: 320 },
    { x: 520, y: 320 },
  ];

  return NODE_TEMPLATES.map((tpl, i) => ({
    id: `${appId}-node-${i}`,
    type: 'serviceNode' as const,
    position: positions[i],
    data: {
      label: tpl.label,
      icon: tpl.icon,
      iconColor: tpl.iconColor,
      costPerHour: tpl.costPerHour,
      status: randomStatus(),
      cpu: randomBetween(0, 1),
      memory: randomBetween(0.01, 0.5),
      disk: randomBetween(5, 20),
      region: Math.floor(randomBetween(1, 4, 0)),
      sliderValue: randomBetween(0, 100, 0),
      description: `Managed ${tpl.label} instance for ${appId}`,
    },
  }));
}

function buildEdges(nodes: AppNode[]): AppEdge[] {
  return [
    {
      id: `${nodes[0].id}->${nodes[1].id}`,
      source: nodes[0].id,
      target: nodes[1].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: `${nodes[0].id}->${nodes[2].id}`,
      source: nodes[0].id,
      target: nodes[2].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: `${nodes[1].id}->${nodes[3].id}`,
      source: nodes[1].id,
      target: nodes[3].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#4169E1', strokeWidth: 2 },
    },
  ];
}

export function generateGraph(appId: string): AppGraph {
  const nodes = buildNodes(appId);
  const edges = buildEdges(nodes);
  return { nodes, edges };
}
