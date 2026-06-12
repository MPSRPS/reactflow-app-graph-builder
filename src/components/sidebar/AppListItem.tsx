import { ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { App } from '@/types/app';
import { cn } from '@/lib/utils';

interface AppListItemProps {
  app: App;
}

export function AppListItem({ app }: AppListItemProps) {
  const { selectedAppId, setSelectedAppId } = useAppStore();
  const isSelected = selectedAppId === app.id;

  return (
    <li>
      <button
        className={cn('app-list-item', isSelected && 'app-list-item-active')}
        onClick={() => setSelectedAppId(app.id)}
        aria-pressed={isSelected}
        aria-label={`Select ${app.name}`}
      >
        <span
          className="app-list-icon"
          style={{ background: app.color }}
          aria-hidden="true"
        >
          {app.icon}
        </span>
        <span className="app-list-name">{app.name}</span>
        <ChevronRight size={14} className="app-list-chevron" aria-hidden="true" />
      </button>
    </li>
  );
}
