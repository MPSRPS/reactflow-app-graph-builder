import type { NodeStatus } from '@/types/app';
import { cn } from '@/lib/utils';

interface NodeStatusPillProps {
  status: NodeStatus;
}

const STATUS_CONFIG: Record<NodeStatus, { label: string; className: string; icon: string }> = {
  healthy: { label: 'Success', className: 'pill-healthy', icon: '✓' },
  degraded: { label: 'Degraded', className: 'pill-degraded', icon: '⚠' },
  error: { label: 'Error', className: 'pill-error', icon: '⚠' },
};

export function NodeStatusPill({ status }: NodeStatusPillProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn('status-pill', config.className)} role="status" aria-label={config.label}>
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
