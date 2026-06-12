import { MousePointer2 } from 'lucide-react';

export function InspectorEmpty() {
  return (
    <div className="inspector-empty" role="status" aria-label="No node selected">
      <MousePointer2 size={28} className="inspector-empty-icon" aria-hidden="true" />
      <p className="inspector-empty-title">No node selected</p>
      <p className="inspector-empty-hint">Click a node on the canvas to inspect and configure it</p>
    </div>
  );
}
