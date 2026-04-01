import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'SALT-search-history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load search history:', e);
    }
  }, []);

  // Save search to history
  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setHistory(prev => {
      const trimmed = query.trim().toLowerCase();
      // Remove if already exists (to move to top)
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed);
      // Add to front
      const newHistory = [query, ...filtered].slice(0, MAX_HISTORY);
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save search history:', e);
      }
      return newHistory;
    });
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addToHistory, clearHistory };
}