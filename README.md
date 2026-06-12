# App Graph Builder

A visual infrastructure/service topology builder built with React, ReactFlow, Zustand, TanStack Query, and MSW.

## Setup (< 5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Initialize MSW service worker
npx msw init public/ --save

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production bundle |
| `npm run preview` | Preview production bundle locally |
| `npm run lint` | ESLint with zero-warning gate |
| `npm run typecheck` | TypeScript strict check (no emit) |

## Key Architectural Decisions

### MSW (Mock Service Worker)
Chosen over fetch-level mocks or manual promise wrappers. MSW intercepts at the network level (via Service Worker), so React hooks, TanStack Query, and all retry/caching logic work exactly as they would against a real backend. No import-patching required.

### Zustand (Minimal Store)
The store holds only UI coordination state:
- `selectedAppId` — which app graph to display
- `selectedNodeId` — which node is inspected
- `isMobilePanelOpen` — mobile drawer visibility
- `activeInspectorTab` — Config or Runtime tab

Server data lives exclusively in TanStack Query. ReactFlow node/edge state lives in ReactFlow's internal state (via `useNodesState`/`useEdgesState`). No duplication.

### ReactFlow State Strategy
Node mutations (slider value, name edits) go through `useReactFlow().setNodes()` with an immutable spread pattern. Zustand never holds node objects. This ensures ReactFlow's change-detection and undo system works correctly.

### TanStack Query Caching
- `/api/apps`: `staleTime: 60s` — rarely changes
- `/api/apps/:id/graph`: `staleTime: 30s` — switching back to a previously visited app shows cached data immediately, then revalidates in the background after 30 seconds
- Graph queries have `retry: 1` — one automatic retry on failure before showing the error UI

### Component Architecture
```
layout/      — Shell zones (TopBar, LeftRail, RightPanel, MobileDrawer)
canvas/      — ReactFlow wrapper + controls toolbar
nodes/       — Custom node card + sub-components (tabs, status pill)
inspector/   — Right panel inspection UI (tabs, synced slider, fields)
sidebar/     — App list with search and skeleton loading
```

## Features
-  ReactFlow dotted canvas with drag, select, delete, zoom/pan
-  Fit view on graph load
-  Custom `ServiceNode` cards (header, metrics, tabs, gradient slider, status pill, AWS logo)
-  Node inspector (status badge, Config/Runtime tabs, synced slider, editable name/description)
-  Slider ↔ input bidirectional sync, persisted to node data
-  TanStack Query: loading skeleton, error state with retry, cached results
-  MSW: 300ms simulated latency, 10% random graph failure rate
-  Zustand: all 4 required fields
-  Dark/light mode toggle
-  **Add Node** button (bonus)
-  Animated `smoothstep` edges (bonus)
-  MiniMap (bonus)
-  Keyboard shortcuts: `Escape` to deselect node (bonus)
-  Mobile: right panel becomes bottom slide-over drawer
-  TypeScript strict mode throughout
-  ESLint + Prettier configured

## Known Limitations

1. **No persistent storage** — node edits (name, slider value) reset on page refresh (by design; no backend)
2. **MSW Service Worker** requires HTTPS or localhost — does not work when the HTML file is opened directly from the filesystem
3. **10% random graph failure rate** — by design to demonstrate the error + retry UI; simply click Retry or switch apps to reload
4. **No undo/redo** — ReactFlow's built-in history is not wired (out of scope for the brief)

## Project Structure

```
src/
├── components/
│   ├── canvas/        AppCanvas.tsx, CanvasControls.tsx
│   ├── inspector/     NodeInspector, InspectorTabs, SyncedSlider, InspectorEmpty
│   ├── layout/        TopBar, LeftRail, RightPanel, MobileDrawer
│   ├── nodes/         ServiceNode, NodeMetricTabs, NodeStatusPill
│   └── sidebar/       AppList, AppListItem
├── hooks/             useApps.ts, useAppGraph.ts
├── mocks/             browser.ts, handlers.ts, data.ts
├── store/             useAppStore.ts
├── types/             app.ts, store.ts
├── lib/               utils.ts
├── App.tsx
├── main.tsx
└── index.css
```
