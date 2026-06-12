import { useCallback } from 'react';
import { Share2, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useApps } from '@/hooks/useApps';

export function TopBar() {
  const { selectedAppId, setSelectedAppId, isDarkMode, toggleDarkMode } = useAppStore();
  const { data: apps } = useApps();

  const handleAppChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedAppId(e.target.value);
    },
    [setSelectedAppId]
  );

  const selectedApp = apps?.find((a) => a.id === selectedAppId);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9" />
            <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="app-selector-wrapper">
          {selectedApp && (
            <span
              className="app-icon-dot"
              style={{ background: selectedApp.color }}
              aria-hidden="true"
            >
              {selectedApp.icon}
            </span>
          )}
          <select
            id="app-selector"
            className="app-selector"
            value={selectedAppId ?? ''}
            onChange={handleAppChange}
            aria-label="Select application"
          >
            {apps?.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </select>
          <svg
            className="selector-chevron"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Share" title="Share">
          <Share2 size={16} />
        </button>
        <button
          className="icon-btn"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Light mode' : 'Dark mode'}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="avatar" aria-label="User avatar" role="img">
          <span aria-hidden="true">U</span>
        </div>
      </div>
    </header>
  );
}
