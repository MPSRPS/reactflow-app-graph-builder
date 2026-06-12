import { Github, Database, Box, LayoutGrid, Network, Server, Layers } from 'lucide-react';

const RAIL_ICONS = [
  { Icon: Github, label: 'GitHub' },
  { Icon: Database, label: 'Database' },
  { Icon: Server, label: 'Redis' },
  { Icon: Box, label: 'MongoDB' },
  { Icon: Layers, label: 'Layers' },
  { Icon: LayoutGrid, label: 'Grid' },
  { Icon: Network, label: 'Network' },
];

export function LeftRail() {
  return (
    <nav className="left-rail" aria-label="Service navigation">
      {RAIL_ICONS.map(({ Icon, label }) => (
        <button key={label} className="rail-icon-btn" aria-label={label} title={label}>
          <Icon size={18} />
        </button>
      ))}
    </nav>
  );
}
