import { useQuery } from '@tanstack/react-query';
import type { AppGraph } from '@/types/app';

interface GraphApiResponse {
  graph: AppGraph;
}

function isGraphApiResponse(value: unknown): value is GraphApiResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'graph' in value &&
    typeof (value as Record<string, unknown>).graph === 'object'
  );
}

async function fetchAppGraph(appId: string): Promise<AppGraph> {
  const res = await fetch(`/api/apps/${encodeURIComponent(appId)}/graph`);
  if (!res.ok) {
    throw new Error(`Failed to fetch graph for ${appId}: ${res.statusText}`);
  }
  const json: unknown = await res.json();
  if (!isGraphApiResponse(json)) {
    throw new Error('Invalid graph response shape');
  }
  return json.graph;
}

export function useAppGraph(appId: string | null) {
  return useQuery<AppGraph, Error>({
    queryKey: ['app-graph', appId],
    queryFn: () => {
      if (!appId) throw new Error('No app selected');
      return fetchAppGraph(appId);
    },
    enabled: appId !== null,
    staleTime: 30_000,
    gcTime: 60_000,
    retry: 1,
  });
}
