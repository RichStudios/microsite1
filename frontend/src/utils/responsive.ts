/**
 * Mobile-First Responsive Utilities for BetCompare
 * Enhanced with advanced hooks, container queries, and performance optimizations
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Breakpoint definitions (mobile-first)
export const BREAKPOINTS = {
  xs: 320,    // Extra small devices (small phones)
  sm: 480,    // Small devices (phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (laptops)
  xl: 1280,   // Extra large devices (desktops)
  xxl: 1536,  // 2x extra large devices (large desktops)
  '3xl': 1920 // 3x extra large devices (ultra-wide)
} as const;

// CSS custom properties for breakpoints
export const CSS_BREAKPOINTS = {
  '--bp-xs': `${BREAKPOINTS.xs}px`,
  '--bp-sm': `${BREAKPOINTS.sm}px`,
  '--bp-md': `${BREAKPOINTS.md}px`,
  '--bp-lg': `${BREAKPOINTS.lg}px`,
  '--bp-xl': `${BREAKPOINTS.xl}px`,
  '--bp-xxl': `${BREAKPOINTS.xxl}px`,
  '--bp-3xl': `${BREAKPOINTS['3xl']}px`,
} as const;

// Device type detection
export const DEVICE_TYPES = {
  mobile: { min: 0, max: BREAKPOINTS.md - 1 },
  tablet: { min: BREAKPOINTS.md, max: BREAKPOINTS.lg - 1 },
  desktop: { min: BREAKPOINTS.lg, max: Infinity }
} as const;

/**
 * Media query helpers for JavaScript
 */
export const mediaQueries = {
  // Mobile-first approach
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `(min-width: ${BREAKPOINTS.xxl}px)`,
  '3xl': `(min-width: ${BREAKPOINTS['3xl']}px)`,
  
  // Max-width queries (desktop-first)
  'max-xs': `(max-width: ${BREAKPOINTS.xs - 1}px)`,
  'max-sm': `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  'max-md': `(max-width: ${BREAKPOINTS.md - 1}px)`,
  'max-lg': `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  'max-xl': `(max-width: ${BREAKPOINTS.xl - 1}px)`,
  'max-xxl': `(max-width: ${BREAKPOINTS.xxl - 1}px)`,
  
  // Device-specific queries
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  
  // Orientation queries
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',
  
  // High DPI displays
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Touch devices
  touch: '(hover: none) and (pointer: coarse)',
  'no-touch': '(hover: hover) and (pointer: fine)',
  
  // Reduced motion preference
  'reduced-motion': '(prefers-reduced-motion: reduce)',
  'no-reduced-motion': '(prefers-reduced-motion: no-preference)',
  
  // Color scheme preferences
  'dark-mode': '(prefers-color-scheme: dark)',
  'light-mode': '(prefers-color-scheme: light)',
  
  // Contrast preferences
  'high-contrast': '(prefers-contrast: high)',
  'low-contrast': '(prefers-contrast: low)',
} as const;

// Enhanced responsive state interface
interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: keyof typeof BREAKPOINTS;
  device: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
  prefersReducedMotion: boolean;
  prefersDarkMode: boolean;
  pixelRatio: number;
}

/**
 * Enhanced hook for comprehensive responsive state
 */
export function useResponsiveState(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        breakpoint: 'xs',
        device: 'mobile',
        orientation: 'portrait',
        isTouch: false,
        prefersReducedMotion: false,
        prefersDarkMode: false,
        pixelRatio: 1,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      breakpoint: getBreakpointFromWidth(width),
      device: getDeviceFromWidth(width),
      orientation: width > height ? 'landscape' : 'portrait',
      isTouch: 'ontouchstart' in window,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      pixelRatio: window.devicePixelRatio || 1,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setState({
        width,
        height,
        breakpoint: getBreakpointFromWidth(width),
        device: getDeviceFromWidth(width),
        orientation: width > height ? 'landscape' : 'portrait',
        isTouch: 'ontouchstart' in window,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        pixelRatio: window.devicePixelRatio || 1,
      });
    };

    // Throttled resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateState, 16); // ~60fps
    };

    // Media query change handlers
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleMotionChange = () => updateState();
    const handleColorSchemeChange = () => updateState();

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', updateState, { passive: true });
    reducedMotionQuery.addEventListener('change', handleMotionChange);
    darkModeQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateState);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
      darkModeQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  return state;
}

/**
 * Hook for responsive value selection with improved performance
 */
export function useResponsiveValue<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
  '3xl'?: T;
}): T | undefined {
  const { width } = useResponsiveState();
  
  return useMemo(() => {
    if (width >= BREAKPOINTS['3xl'] && values['3xl'] !== undefined) return values['3xl'];
    if (width >= BREAKPOINTS.xxl && values.xxl !== undefined) return values.xxl;
    if (width >= BREAKPOINTS.xl && values.xl !== undefined) return values.xl;
    if (width >= BREAKPOINTS.lg && values.lg !== undefined) return values.lg;
    if (width >= BREAKPOINTS.md && values.md !== undefined) return values.md;
    if (width >= BREAKPOINTS.sm && values.sm !== undefined) return values.sm;
    return values.xs;
  }, [width, values]);
}

/**
 * Enhanced media query hook with better performance
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQuery.matches);
    
    updateMatch();
    mediaQuery.addEventListener('change', updateMatch);
    
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}

/**
 * Container query hook for element-based responsive design
 */
export function useContainerQuery<T extends HTMLElement = HTMLDivElement>(
  queries: Record<string, string>
): [React.RefObject<T>, Record<string, boolean>] {
  const ref = useRef<T>(null);
  const [matches, setMatches] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const element = ref.current;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      const newMatches: Record<string, boolean> = {};

      Object.entries(queries).forEach(([key, query]) => {
        // Simple container query parsing (width-based)
        const match = query.match(/\(min-width:\s*(\d+)px\)/);
        if (match) {
          const minWidth = parseInt(match[1], 10);
          newMatches[key] = width >= minWidth;
        }
      });

      setMatches(newMatches);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [queries]);

  return [ref, matches];
}

/**
 * Advanced device detection hooks
 */
export function useIsMobile(): boolean {
  const { device } = useResponsiveState();
  return device === 'mobile';
}

export function useIsTablet(): boolean {
  const { device } = useResponsiveState();
  return device === 'tablet';
}

export function useIsDesktop(): boolean {
  const { device } = useResponsiveState();
  return device === 'desktop';
}

export function useIsTouch(): boolean {
  const { isTouch } = useResponsiveState();
  return isTouch;
}

export function usePrefersReducedMotion(): boolean {
  const { prefersReducedMotion } = useResponsiveState();
  return prefersReducedMotion;
}

export function usePrefersDarkMode(): boolean {
  const { prefersDarkMode } = useResponsiveState();
  return prefersDarkMode;
}

/**
 * Responsive spacing system with enhanced scale
 */
export const responsiveSpacing = {
  // Container padding
  containerPadding: {
    xs: '1rem',     // 16px
    sm: '1.5rem',   // 24px
    md: '2rem',     // 32px
    lg: '2.5rem',   // 40px
    xl: '3rem',     // 48px
  },
  
  // Section spacing
  sectionSpacing: {
    xs: '2rem',     // 32px
    sm: '3rem',     // 48px
    md: '4rem',     // 64px
    lg: '6rem',     // 96px
    xl: '8rem',     // 128px
  },
  
  // Component spacing
  componentSpacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  }
} as const;

/**
 * Enhanced responsive typography system
 */
export const responsiveTypography = {
  // Heading sizes
  h1: {
    xs: { fontSize: '1.5rem', lineHeight: '1.3', letterSpacing: '-0.02em' },
    sm: { fontSize: '1.75rem', lineHeight: '1.3', letterSpacing: '-0.02em' },
    md: { fontSize: '2.25rem', lineHeight: '1.2', letterSpacing: '-0.02em' },
    lg: { fontSize: '3rem', lineHeight: '1.1', letterSpacing: '-0.03em' },
    xl: { fontSize: '3.75rem', lineHeight: '1.1', letterSpacing: '-0.03em' },
  },
  h2: {
    xs: { fontSize: '1.25rem', lineHeight: '1.4', letterSpacing: '-0.01em' },
    sm: { fontSize: '1.5rem', lineHeight: '1.4', letterSpacing: '-0.01em' },
    md: { fontSize: '1.875rem', lineHeight: '1.3', letterSpacing: '-0.02em' },
    lg: { fontSize: '2.25rem', lineHeight: '1.2', letterSpacing: '-0.02em' },
    xl: { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.02em' },
  },
  h3: {
    xs: { fontSize: '1.125rem', lineHeight: '1.4', letterSpacing: '0' },
    sm: { fontSize: '1.25rem', lineHeight: '1.4', letterSpacing: '0' },
    md: { fontSize: '1.5rem', lineHeight: '1.3', letterSpacing: '-0.01em' },
    lg: { fontSize: '1.875rem', lineHeight: '1.3', letterSpacing: '-0.01em' },
    xl: { fontSize: '2.25rem', lineHeight: '1.2', letterSpacing: '-0.02em' },
  },
  body: {
    xs: { fontSize: '0.875rem', lineHeight: '1.6', letterSpacing: '0' },
    sm: { fontSize: '1rem', lineHeight: '1.6', letterSpacing: '0' },
    md: { fontSize: '1rem', lineHeight: '1.6', letterSpacing: '0' },
    lg: { fontSize: '1.125rem', lineHeight: '1.6', letterSpacing: '0' },
    xl: { fontSize: '1.125rem', lineHeight: '1.6', letterSpacing: '0' },
  },
  small: {
    xs: { fontSize: '0.75rem', lineHeight: '1.5', letterSpacing: '0' },
    sm: { fontSize: '0.875rem', lineHeight: '1.5', letterSpacing: '0' },
    md: { fontSize: '0.875rem', lineHeight: '1.5', letterSpacing: '0' },
    lg: { fontSize: '1rem', lineHeight: '1.5', letterSpacing: '0' },
    xl: { fontSize: '1rem', lineHeight: '1.5', letterSpacing: '0' },
  }
} as const;

/**
 * Utility functions
 */
function getBreakpointFromWidth(width: number): keyof typeof BREAKPOINTS {
  if (width >= BREAKPOINTS['3xl']) return '3xl';
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

function getDeviceFromWidth(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
}

/**
 * Generate responsive CSS classes programmatically
 */
export function generateResponsiveClasses(
  property: string,
  values: Record<string, string | number>
): Record<string, string> {
  const classes: Record<string, string> = {};
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    const className = breakpoint === 'xs' 
      ? `${property}-${value}` 
      : `${breakpoint}\\:${property}-${value}`;
    
    const cssProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    classes[className] = `${cssProperty}: ${value}`;
  });
  
  return classes;
}

/**
 * Initialize responsive CSS custom properties
 */
export function initResponsiveCSSProperties(): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Set breakpoint properties
  Object.entries(CSS_BREAKPOINTS).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Set responsive state properties
  const updateResponsiveProperties = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoint = getBreakpointFromWidth(width);
    const device = getDeviceFromWidth(width);
    
    root.style.setProperty('--current-breakpoint', breakpoint);
    root.style.setProperty('--current-device', device);
    root.style.setProperty('--viewport-width', `${width}px`);
    root.style.setProperty('--viewport-height', `${height}px`);
  };
  
  updateResponsiveProperties();
  window.addEventListener('resize', updateResponsiveProperties, { passive: true });
}

/**
 * Performance-optimized intersection observer for responsive elements
 */
export function useResponsiveIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * Hook for responsive grid calculations
 */
export function useResponsiveGrid(
  itemWidth: number,
  gap: number = 16,
  minItems: number = 1,
  maxItems: number = 12
): { columns: number; itemsPerRow: number } {
  const { width } = useResponsiveState();
  
  return useMemo(() => {
    const availableWidth = width - (2 * 16); // Account for container padding
    const columns = Math.max(
      minItems,
      Math.min(maxItems, Math.floor((availableWidth + gap) / (itemWidth + gap)))
    );
    
    return {
      columns,
      itemsPerRow: columns
    };
  }, [width, itemWidth, gap, minItems, maxItems]);
} 