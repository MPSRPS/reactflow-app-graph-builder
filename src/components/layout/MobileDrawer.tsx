import { useAppStore } from '@/store/useAppStore';
import { AppList } from '@/components/sidebar/AppList';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { InspectorEmpty } from '@/components/inspector/InspectorEmpty';
import { X } from 'lucide-react';

export function MobileDrawer() {
  const { isMobilePanelOpen, setMobilePanelOpen, selectedNodeId } = useAppStore();

  if (!isMobilePanelOpen) return null;

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={() => setMobilePanelOpen(false)}
        aria-hidden="true"
      />
      <div
        className="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Application panel"
      >
        <div className="drawer-header">
          <span className="drawer-title">Application Panel</span>
          <button
            className="icon-btn"
            onClick={() => setMobilePanelOpen(false)}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>
        <div className="drawer-body">
          <AppList />
          <div className="drawer-inspector">
            {selectedNodeId ? <NodeInspector /> : <InspectorEmpty />}
          </div>
        </div>
      </div>
    </>
  );
}
