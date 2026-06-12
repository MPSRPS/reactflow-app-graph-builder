import { AppList } from '@/components/sidebar/AppList';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { InspectorEmpty } from '@/components/inspector/InspectorEmpty';
import { useAppStore } from '@/store/useAppStore';

export function RightPanel() {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);

  return (
    <aside className="right-panel" aria-label="Application panel">
      <div className="right-panel-section">
        <AppList />
      </div>
      <div className="right-panel-section right-panel-inspector">
        {selectedNodeId ? <NodeInspector /> : <InspectorEmpty />}
      </div>
    </aside>
  );
}
