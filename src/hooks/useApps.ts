import { useQuery } from '@tanstack/react-query';
import type { App } from '@/types/app';

interface AppsApiResponse {
  apps: App[];
}

function isAppsApiResponse(value: unknown): value is AppsApiResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'apps' in value &&
    Array.isArray((value as Record<string, unknown>).apps)
  );
}

async function fetchApps(): Promise<App[]> {
  const res = await fetch('/api/apps');
  if (!res.ok) {
    throw new Error(`Failed to fetch apps: ${res.statusText}`);
  }
  const json: unknown = await res.json();
  if (!isAppsApiResponse(json)) {
    throw new Error('Invalid apps response shape');
  }
  return json.apps;
}

export function useApps() {
  return useQuery<App[], Error>({
    queryKey: ['apps'],
    queryFn: fetchApps,
    staleTime: 60_000,
    gcTime: 120_000,
  });
}
