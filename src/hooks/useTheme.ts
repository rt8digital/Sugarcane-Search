import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'salt-theme-mode';
const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/**
 * useTheme Hook
 * 
 * Manages theme state (light/dark/system) with persistence and system preference detection.
 * 
 * @example
 * ```tsx
 * const { mode, isDark, setMode, toggleTheme } = useTheme();
 * ```
 */
export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return stored || 'light';
  });

  const [isDark, setIsDark] = useState(false);

  // Determine if dark mode should be active
  const getIsDark = useCallback((themeMode: ThemeMode): boolean => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    
    // System mode - check media query
    if (typeof window !== 'undefined') {
      return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches;
    }
    return false;
  }, []);

  // Update document class and state when mode changes
  useEffect(() => {
    const shouldUseDark = getIsDark(mode);
    setIsDark(shouldUseDark);

    // Update document class for CSS selectors
    const root = document.documentElement;
    if (shouldUseDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode, getIsDark]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDark(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      // If system, toggle to opposite of current system state
      return isDark ? 'light' : 'dark';
    });
  }, [isDark]);

  const enableDarkMode = useCallback(() => setMode('dark'), [setMode]);
  const enableLightMode = useCallback(() => setMode('light'), [setMode]);
  const enableSystemMode = useCallback(() => setMode('system'), [setMode]);

  return {
    mode,
    isDark,
    setMode,
    toggleTheme,
    enableDarkMode,
    enableLightMode,
    enableSystemMode,
  };
}

/**
 * useThemePreference Hook
 * 
 * A simpler hook that just tracks dark/light without system mode.
 * Useful for components that need a simple binary theme toggle.
 */
export function useThemePreference() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    setIsDark(root.classList.contains('dark'));

    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, []);

  return { isDark, toggle };
}

export default useTheme;
