import { useState, useCallback } from 'react';

const STORAGE_KEY = 'visit_history';

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Tracks which venue IDs the user has visited.
 * Persisted to localStorage so stamps survive page refreshes.
 */
export const useVisitHistory = () => {
  const [visitedVenueIds, setVisitedVenueIds] = useState(loadHistory);

  const logVisit = useCallback((venueId) => {
    if (!venueId) return;
    setVisitedVenueIds((prev) => {
      if (prev.includes(venueId)) return prev;
      const next = [venueId, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* silent */ }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* silent */ }
    setVisitedVenueIds([]);
  }, []);

  return { visitedVenueIds, logVisit, clearHistory };
};
