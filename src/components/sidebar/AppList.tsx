import { useState, useMemo, useId } from 'react';
import { Search, Plus } from 'lucide-react';
import { useApps } from '@/hooks/useApps';
import { AppListItem } from './AppListItem';

function AppListSkeleton() {
  return (
    <div className="app-list-skeleton" aria-busy="true" aria-label="Loading apps">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-icon" />
          <div className="skeleton-text" />
        </div>
      ))}
    </div>
  );
}

export function AppList() {
  const { data: apps, isLoading, isError } = useApps();
  const [search, setSearch] = useState('');
  const searchId = useId();

  const filtered = useMemo(() => {
    if (!apps) return [];
    const q = search.toLowerCase().trim();
    return q ? apps.filter((a) => a.name.toLowerCase().includes(q)) : apps;
  }, [apps, search]);

  return (
    <section className="app-list-section" aria-labelledby="app-list-heading">
      <div className="app-list-header">
        <h2 id="app-list-heading" className="app-list-title">
          Application
        </h2>
        <button className="add-app-btn" aria-label="Add application" title="Add application">
          <Plus size={14} />
        </button>
      </div>

      <div className="app-search-wrapper">
        <label htmlFor={searchId} className="sr-only">
          Search applications
        </label>
        <Search size={13} className="search-icon" aria-hidden="true" />
        <input
          id={searchId}
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          aria-label="Search applications"
        />
      </div>

      {isLoading && <AppListSkeleton />}

      {isError && (
        <p className="app-list-error" role="alert">
          Failed to load applications.
        </p>
      )}

      {!isLoading && !isError && (
        <ul className="app-list" role="list" aria-label="Applications">
          {filtered.length === 0 ? (
            <li className="app-list-empty">No apps found</li>
          ) : (
            filtered.map((app) => <AppListItem key={app.id} app={app} />)
          )}
        </ul>
      )}
    </section>
  );
}
