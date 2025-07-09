// Performance optimization utilities
import React, { lazy } from 'react';
import dynamic from 'next/dynamic';

/**
 * Lazy load components with loading fallbacks
 */
export const createLazyComponent = (importFunction: () => Promise<any>, fallback?: React.ComponentType) => {
  return lazy(importFunction);
};

/**
 * Dynamic import with Next.js optimization
 */
export const createDynamicComponent = (
  importFunction: () => Promise<any>,
  options: {
    loading?: () => React.ReactElement;
    ssr?: boolean;
    suspense?: boolean;
  } = {}
) => {
  const defaultLoading = () => (
    <div className="w-full h-32 bg-gray-100 animate-pulse rounded-lg" />
  );

  return dynamic(importFunction, {
    loading: options.loading || defaultLoading,
    ssr: options.ssr ?? true,
    suspense: options.suspense ?? false,
  });
};

/**
 * Loading skeleton components
 */
export const LoadingSkeleton = {
  Card: ({ height = 'h-48' }: { height?: string }) => (
    <div className={`w-full ${height} bg-gray-100 animate-pulse rounded-lg`} />
  ),
  
  Table: ({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) => (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  ),

  List: ({ items = 3 }: { items?: number }) => (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),

  Text: ({ lines = 3 }: { lines?: number }) => (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-gray-200 rounded animate-pulse ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`} 
        />
      ))}
    </div>
  )
};

/**
 * Performance monitoring
 */
export const performanceTracker = {
  markStart: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
  },

  markEnd: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }
  },

  trackComponentLoad: (componentName: string) => {
    if (typeof window !== 'undefined') {
      console.log(`[Performance] ${componentName} loaded at ${Date.now()}`);
    }
  }
};

/**
 * Intersection Observer for lazy loading
 */
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return null;

  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Image loading optimization
 */
export const optimizeImageLoading = () => {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img[loading="lazy"]');
  
  images.forEach((img) => {
    if (img instanceof HTMLImageElement) {
      // Preload critical images
      if (img.getBoundingClientRect().top < window.innerHeight * 1.5) {
        img.loading = 'eager';
      }
    }
  });
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Lazy load hook for components
 */
export const useLazyLoad = (ref: React.RefObject<Element>) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = createIntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current && observer) {
      observer.observe(ref.current);
    }

    return () => observer?.disconnect();
  }, [ref]);

  return isVisible;
};

export default {
  createLazyComponent,
  createDynamicComponent,
  LoadingSkeleton,
  performanceTracker,
  createIntersectionObserver,
  optimizeImageLoading,
  debounce,
  throttle,
  useLazyLoad
}; 