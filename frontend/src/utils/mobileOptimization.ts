// Mobile optimization utilities for performance and UX

/**
 * Detects if the user is on a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Detects if the user is on a touch device
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Gets the current viewport dimensions
 */
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
};

/**
 * Checks if the current viewport is mobile-sized
 */
export const isMobileViewport = (): boolean => {
  const { width } = getViewportDimensions();
  return width <= 768;
};

/**
 * Optimizes scroll performance with passive listeners
 */
export const addOptimizedScrollListener = (
  element: Element | Window,
  handler: () => void,
  options: { throttle?: number; passive?: boolean } = {}
): (() => void) => {
  const { throttle = 16, passive = true } = options;
  
  let ticking = false;
  
  const throttledHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handler();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  element.addEventListener('scroll', throttledHandler, { passive });
  
  return () => {
    element.removeEventListener('scroll', throttledHandler);
  };
};

/**
 * Handles safe area insets for devices with notches
 */
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };
  
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0')
  };
};

/**
 * Optimizes touch interactions by preventing unwanted behaviors
 */
export const optimizeTouchInteraction = (element: HTMLElement) => {
  // Prevent zoom on double tap for buttons and interactive elements
  element.style.touchAction = 'manipulation';
  
  // Add active state handling
  const addActiveClass = () => element.classList.add('active');
  const removeActiveClass = () => element.classList.remove('active');
  
  element.addEventListener('touchstart', addActiveClass, { passive: true });
  element.addEventListener('touchend', removeActiveClass, { passive: true });
  element.addEventListener('touchcancel', removeActiveClass, { passive: true });
  
  return () => {
    element.removeEventListener('touchstart', addActiveClass);
    element.removeEventListener('touchend', removeActiveClass);
    element.removeEventListener('touchcancel', removeActiveClass);
  };
};

/**
 * Implements pull-to-refresh functionality
 */
export const setupPullToRefresh = (
  container: HTMLElement,
  onRefresh: () => Promise<void>,
  options: { threshold?: number; resistance?: number } = {}
) => {
  const { threshold = 80, resistance = 0.5 } = options;
  
  let startY = 0;
  let currentY = 0;
  let isRefreshing = false;
  let pullDistance = 0;
  
  const handleTouchStart = (e: TouchEvent) => {
    if (container.scrollTop === 0 && !isRefreshing) {
      startY = e.touches[0].clientY;
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (startY === 0 || isRefreshing) return;
    
    currentY = e.touches[0].clientY;
    pullDistance = Math.max(0, (currentY - startY) * resistance);
    
    if (pullDistance > 0) {
      e.preventDefault();
      container.style.transform = `translateY(${pullDistance}px)`;
      
      if (pullDistance >= threshold) {
        container.classList.add('pull-refresh-ready');
      } else {
        container.classList.remove('pull-refresh-ready');
      }
    }
  };
  
  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      isRefreshing = true;
      container.classList.add('pull-refreshing');
      
      try {
        await onRefresh();
      } finally {
        isRefreshing = false;
        container.classList.remove('pull-refreshing', 'pull-refresh-ready');
      }
    }
    
    container.style.transform = '';
    startY = 0;
    pullDistance = 0;
  };
  
  container.addEventListener('touchstart', handleTouchStart, { passive: false });
  container.addEventListener('touchmove', handleTouchMove, { passive: false });
  container.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  return () => {
    container.removeEventListener('touchstart', handleTouchStart);
    container.removeEventListener('touchmove', handleTouchMove);
    container.removeEventListener('touchend', handleTouchEnd);
  };
};

/**
 * Implements smooth momentum scrolling
 */
export const enableMomentumScrolling = (element: HTMLElement) => {
  // Use bracket notation to avoid TypeScript errors with webkit-specific properties
  (element.style as any)['-webkit-overflow-scrolling'] = 'touch';
  (element.style as any)['overflow-scrolling'] = 'touch';
};

/**
 * Optimizes images for mobile viewing
 */
export const optimizeImageForMobile = (img: HTMLImageElement) => {
  const { width } = getViewportDimensions();
  
  // Set appropriate sizes based on viewport
  if (width <= 480) {
    img.sizes = '100vw';
  } else if (width <= 768) {
    img.sizes = '50vw';
  } else {
    img.sizes = '33vw';
  }
  
  // Enable lazy loading
  img.loading = 'lazy';
  
  // Optimize decoding
  img.decoding = 'async';
};

/**
 * Detects network connection quality
 */
export const getNetworkQuality = (): 'slow' | 'fast' | 'unknown' => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }
  
  const connection = (navigator as any).connection;
  
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    return 'slow';
  }
  
  return 'fast';
};

/**
 * Reduces animations on slow devices
 */
export const shouldReduceAnimations = (): boolean => {
  // Check user preference
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return true;
  }
  
  // Check network quality
  const networkQuality = getNetworkQuality();
  if (networkQuality === 'slow') return true;
  
  // Check device performance (basic heuristic)
  if (typeof navigator !== 'undefined') {
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    if (hardwareConcurrency <= 2) return true;
  }
  
  return false;
};

/**
 * Implements virtual keyboard handling
 */
export const handleVirtualKeyboard = () => {
  if (typeof window === 'undefined') return;
  
  const initialViewportHeight = window.innerHeight;
  
  const handleResize = () => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;
    
    // Virtual keyboard is likely open if height decreased significantly
    if (heightDifference > 150) {
      document.body.classList.add('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-height', `${heightDifference}px`);
    } else {
      document.body.classList.remove('keyboard-open');
      document.documentElement.style.removeProperty('--keyboard-height');
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

/**
 * Optimizes button interactions for mobile
 */
export const optimizeButtonForMobile = (button: HTMLButtonElement) => {
  // Ensure minimum touch target size
  const computedStyle = getComputedStyle(button);
  const width = parseInt(computedStyle.width);
  const height = parseInt(computedStyle.height);
  
  if (width < 44 || height < 44) {
    button.style.minWidth = '44px';
    button.style.minHeight = '44px';
  }
  
  // Optimize touch behavior
  optimizeTouchInteraction(button);
  
  // Prevent double-tap zoom
  button.style.touchAction = 'manipulation';
  
  // Add haptic feedback if supported
  if ('vibrate' in navigator) {
    button.addEventListener('click', () => {
      navigator.vibrate(10);
    });
  }
};

/**
 * Creates a mobile-optimized intersection observer
 */
export const createMobileIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: isMobileDevice() ? 0.1 : 0.25,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Preloads critical resources for mobile
 */
export const preloadCriticalResources = () => {
  const resources = [
    { href: '/icons/icon-192x192.png', as: 'image' },
    { href: '/icons/icon-512x512.png', as: 'image' },
    { href: '/api/bookmakers', as: 'fetch' }
  ];
  
  resources.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (as === 'fetch') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};

/**
 * Mobile-specific error boundary handling
 */
export const handleMobileErrors = () => {
  window.addEventListener('error', (event) => {
    // Log mobile-specific errors
    console.error('Mobile Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      userAgent: navigator.userAgent,
      viewport: getViewportDimensions(),
      networkQuality: getNetworkQuality()
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Mobile Promise Rejection:', {
      reason: event.reason,
      userAgent: navigator.userAgent,
      viewport: getViewportDimensions()
    });
  });
}; 