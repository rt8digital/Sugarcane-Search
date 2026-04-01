/**
 * SALT - South African Lineage Tracer
 * Theme Configuration & Design Tokens
 * 
 * Centralized theme management for consistent UI/UX
 */

/* ═══════════════════════════════════════════════════════════
   Color Palette - Botanical Organic Theme
══════════════════════════════════════════════════════════════ */

export const colors = {
  // Base
  background: '#F9F8F4',
  foreground: '#2D3A31',
  
  // Cards & Surfaces
  card: '#FFFFFF',
  cardForeground: '#2D3A31',
  
  // Primary - Sage Green
  primary: '#8C9A84',
  primaryForeground: '#FFFFFF',
  primaryLight: '#A3B59A',
  primaryDark: '#6B7A68',
  primaryMuted: 'rgba(140, 154, 132, 0.1)',
  
  // Secondary - Warm Beige
  secondary: '#DCCFC2',
  secondaryForeground: '#2D3A31',
  
  // Muted
  muted: '#F2F0EB',
  mutedForeground: '#6B7A68',
  mutedLight: '#F7F6F4',
  
  // Accent - Terracotta
  accent: '#C27B66',
  accentForeground: '#FFFFFF',
  accentLight: '#D49A8A',
  accentMuted: 'rgba(194, 123, 102, 0.1)',
  
  // Borders
  border: '#E6E2DA',
  borderLight: '#F0EDE9',
  
  // Ring/Focus
  ring: '#8C9A84',
  
  // Destructive
  destructive: '#A85848',
  destructiveForeground: '#FFFFFF',
  
  // Legacy SA Colors (for decorative elements)
  saRed: '#E03C31',
  saGreen: '#007749',
  saYellow: '#FFB81C',
  saBlue: '#001489',
} as const;

/* ═══════════════════════════════════════════════════════════
   Typography
══════════════════════════════════════════════════════════════ */

export const typography = {
  fonts: {
    display: "'Playfair Display', Georgia, serif",
    body: "'Source Sans 3', system-ui, -apple-system, sans-serif",
    lora: "'Lora', Georgia, serif",
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  tracking: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
    loose: 2,
  },
} as const;

/* ═══════════════════════════════════════════════════════════
   Spacing Scale
══════════════════════════════════════════════════════════════ */

export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

/* ═══════════════════════════════════════════════════════════
   Border Radius
══════════════════════════════════════════════════════════════ */

export const radius = {
  none: '0',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

/* ═══════════════════════════════════════════════════════════
   Shadows
══════════════════════════════════════════════════════════════ */

export const shadows = {
  xs: '0 1px 2px rgba(45, 58, 49, 0.03)',
  sm: '0 2px 4px rgba(45, 58, 49, 0.04)',
  md: '0 4px 6px -1px rgba(45, 58, 49, 0.05)',
  lg: '0 10px 15px -3px rgba(45, 58, 49, 0.06)',
  xl: '0 20px 40px -10px rgba(45, 58, 49, 0.08)',
  '2xl': '0 25px 50px -12px rgba(45, 58, 49, 0.12)',
  inner: 'inset 0 2px 4px rgba(45, 58, 49, 0.03)',
  none: 'none',
} as const;

/* ═══════════════════════════════════════════════════════════
   Animation
══════════════════════════════════════════════════════════════ */

export const animation = {
  durations: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    organic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

/* ═══════════════════════════════════════════════════════════
   Breakpoints
══════════════════════════════════════════════════════════════ */

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/* ═══════════════════════════════════════════════════════════
   Z-Index Scale
══════════════════════════════════════════════════════════════ */

export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  60: 60,
  70: 70,
  80: 80,
  90: 90,
  100: 100,
  150: 150,
  200: 200,
  250: 250,
} as const;

/* ═══════════════════════════════════════════════════════════
   Component Tokens
══════════════════════════════════════════════════════════════ */

export const componentTokens = {
  button: {
    paddingX: spacing[6],
    paddingY: spacing[3],
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.tracking.wider,
    textTransform: 'uppercase' as const,
    borderRadius: radius.md,
    transitionDuration: animation.durations[200],
  },
  input: {
    paddingX: spacing[5],
    paddingY: spacing[3.5],
    fontSize: typography.sizes.base,
    borderRadius: radius.md,
    borderWidth: 1,
    transitionDuration: animation.durations[200],
  },
  card: {
    padding: spacing[6],
    borderRadius: radius.lg,
    borderWidth: 1,
    boxShadow: shadows.sm,
    transitionDuration: animation.durations[300],
  },
  badge: {
    paddingX: spacing[2.5],
    paddingY: spacing[0.5],
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    borderRadius: radius.full,
  },
} as const;

/* ═══════════════════════════════════════════════════════════
   Dark Mode Colors (Future Support)
══════════════════════════════════════════════════════════════ */

export const darkColors = {
  background: '#1A1F1B',
  foreground: '#E8E6E1',
  card: '#242A26',
  cardForeground: '#E8E6E1',
  primary: '#8C9A84',
  primaryForeground: '#FFFFFF',
  primaryLight: '#6B7A68',
  primaryDark: '#A3B59A',
  secondary: '#3D4540',
  secondaryForeground: '#E8E6E1',
  muted: '#2D3430',
  mutedForeground: '#9CA398',
  mutedLight: '#343C37',
  accent: '#C27B66',
  accentForeground: '#FFFFFF',
  accentLight: '#A56855',
  border: '#3D4540',
  borderLight: '#343C37',
  ring: '#8C9A84',
} as const;

/* ═══════════════════════════════════════════════════════════
   Theme Exports
══════════════════════════════════════════════════════════════ */

export type ThemeColors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Shadows = typeof shadows;
export type Animation = typeof animation;
export type Breakpoints = typeof breakpoints;
export type ZIndex = typeof zIndex;
export type ComponentTokens = typeof componentTokens;

export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  radius: Radius;
  shadows: Shadows;
  animation: Animation;
  breakpoints: Breakpoints;
  zIndex: ZIndex;
  componentTokens: ComponentTokens;
}

export const theme: Theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  animation,
  breakpoints,
  zIndex,
  componentTokens,
};

export default theme;
