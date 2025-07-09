import React from 'react';
// Performance optimization utilities for BetCompare.co.ke

// Lazy loading hook using Intersection Observer
import { useEffect, useRef, useState, MutableRefObject } from 'react';

export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
): { targetRef: MutableRefObject<HTMLDivElement | null>; isIntersecting: boolean } => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [options]);

  return { targetRef, isIntersecting };
};

// Lazy loading component wrapper
type LazySectionProps = {
  children: React.ReactNode;
  className?: string;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
};

export function LazySection({
  children,
  className = '',
  placeholder = null,
  threshold = 0.1,
  rootMargin = '100px',
}: LazySectionProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  return (
    <div ref={targetRef} className={className}>
      {isIntersecting ? children : placeholder}
    </div>
  );
}

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontPreloads = [
      '/fonts/Montserrat-Bold.woff2',
      '/fonts/OpenSans-Regular.woff2',
    ];

    fontPreloads.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload critical images
    const imagePreloads = [
      '/images/hero-banner.jpg',
      '/logo.png',
    ];

    imagePreloads.forEach(image => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = image;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }
};

// Core Web Vitals tracking
export const trackWebVitals = (metric: any) => {
  const body = JSON.stringify(metric);
  const url = '/api/analytics/web-vitals';

  // Use sendBeacon if available, fallback to fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true }).catch(console.error);
  }
};

// Performance observer for measuring performance
export const observePerformance = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Observe Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        console.log('LCP:', lastEntry.startTime);
        // Send to analytics
        trackWebVitals({
          name: 'LCP',
          value: lastEntry.startTime,
          id: 'LCP',
        });
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Observe First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
        trackWebVitals({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          id: 'FID',
        });
      });
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Observe Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      console.log('CLS:', clsValue);
      trackWebVitals({
        name: 'CLS',
        value: clsValue,
        id: 'CLS',
      });
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // Clean up observers when page unloads
    window.addEventListener('beforeunload', () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    });
  }
};

// Optimize images for different screen sizes
export const getOptimizedImageSrc = (
  src: string,
  width: number,
  quality: number = 75
): string => {
  if (!src || src.startsWith('data:')) return src;
  
  // For Next.js Image component optimization
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString(),
  });
  
  return `/_next/image?${params.toString()}`;
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  
  return (...args: Parameters<T>) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Critical CSS inlining helper
export const inlineCriticalCSS = (css: string) => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
};

// Resource hints helper
export const addResourceHint = (
  href: string,
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch',
  as?: string,
  crossOrigin?: string
) => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    
    if (as) link.setAttribute('as', as);
    if (crossOrigin) link.crossOrigin = crossOrigin;
    
    document.head.appendChild(link);
  }
}; 