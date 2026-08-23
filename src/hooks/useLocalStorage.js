import { useState, useEffect } from 'react';

// Generic localStorage-backed useState. Reads the initial value lazily (once,
// on mount) so it never touches localStorage during server-less first paint,
// and persists on every change via useEffect (PRD §40).
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable (private browsing, quota, etc.) — fail silently,
      // the app still works for the session, it just won't persist.
    }
  }, [key, value]);

  return [value, setValue];
}
