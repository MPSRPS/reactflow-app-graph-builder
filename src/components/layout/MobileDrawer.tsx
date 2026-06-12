import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AppList } from '@/components/sidebar/AppList';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { InspectorEmpty } from '@/components/inspector/InspectorEmpty';
import { X } from 'lucide-react';

export function MobileDrawer() {
  const { isMobilePanelOpen, setMobilePanelOpen, selectedNodeId } = useAppStore();
  const inspectorRef = useRef<HTMLDivElement>(null);

  // When a node is selected and the drawer opens, scroll the inspector
  // section into view so the user immediately sees node details.
  useEffect(() => {
    if (isMobilePanelOpen && selectedNodeId && inspectorRef.current) {
      setTimeout(() => {
        inspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120); // allow drawer slide-up animation to finish first
    }
  }, [isMobilePanelOpen, selectedNodeId]);

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
          <span className="drawer-title">
            {selectedNodeId ? 'Node Inspector' : 'Application Panel'}
          </span>
          <button
            className="icon-btn"
            onClick={() => setMobilePanelOpen(false)}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>
        <div className="drawer-body">
          {/* Inspector first when a node is selected so it is immediately visible */}
          {selectedNodeId ? (
            <>
              <div className="drawer-inspector" ref={inspectorRef}>
                <NodeInspector />
              </div>
              <div className="drawer-app-list">
                <AppList />
              </div>
            </>
          ) : (
            <>
              <AppList />
              <div className="drawer-inspector">
                <InspectorEmpty />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
