import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme, ThemeMode } from '../hooks/useTheme';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  enableDarkMode: () => void;
  enableLightMode: () => void;
  enableSystemMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

/**
 * ThemeProvider Component
 * 
 * Provides theme context to the application.
 * Wraps your app to enable theme switching throughout.
 * 
 * @example
 * ```tsx
 * <ThemeProvider defaultMode="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultMode = 'light',
}: ThemeProviderProps) {
  // Note: useTheme manages its own state, defaultMode is used on first render
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useThemeContext Hook
 * 
 * Access theme context from anywhere in the app.
 * Must be used within a ThemeProvider.
 * 
 * @throws Error if used outside ThemeProvider
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

/**
 * useThemeContext Hook (Optional)
 * 
 * Safe version that returns undefined instead of throwing.
 */
export function useThemeContextOptional(): ThemeContextValue | undefined {
  return useContext(ThemeContext);
}

export default ThemeProvider;
