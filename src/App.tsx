import { useCallback, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { TopBar } from '@/components/layout/TopBar';
import { LeftRail } from '@/components/layout/LeftRail';
import { RightPanel } from '@/components/layout/RightPanel';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { AppCanvas } from '@/components/canvas/AppCanvas';
import { useAppStore } from '@/store/useAppStore';
import { Layers } from 'lucide-react';

function MobilePanelButton() {
  const { setMobilePanelOpen } = useAppStore();
  return (
    <button
      className="mobile-panel-btn"
      onClick={() => setMobilePanelOpen(true)}
      aria-label="Open application panel"
    >
      <Layers size={16} />
      Apps &amp; Inspector
    </button>
  );
}

export default function App() {
  const { selectedNodeId, setSelectedNodeId } = useAppStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNodeId) {
        setSelectedNodeId(null);
      }
      if ((e.key === 'f' || (e.ctrlKey && e.shiftKey && e.key === 'F'))) {
        // Fit view is handled inside AppCanvas via CanvasControls
      }
    },
    [selectedNodeId, setSelectedNodeId]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <ReactFlowProvider>
      <div className="app-shell">
        <div className="app-shell-topbar">
          <TopBar />
        </div>
        <div className="app-shell-rail">
          <LeftRail />
        </div>
        <div className="app-shell-canvas">
          <AppCanvas />
        </div>
        <div className="app-shell-panel">
          <RightPanel />
        </div>
      </div>
      <MobileDrawer />
      <MobilePanelButton />
    </ReactFlowProvider>
  );
}
