/**
 * Responsive Performance Monitor for BetCompare.co.ke
 * Monitors and tracks performance metrics related to responsive design and mobile optimization
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useResponsiveState, useMediaQuery, BREAKPOINTS, mediaQueries } from '../../utils/responsive';

// Performance metrics interfaces
interface ViewportMetrics {
  width: number;
  height: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
  timestamp: number;
}

interface LayoutShiftMetrics {
  value: number;
  timestamp: number;
  hadRecentInput: boolean;
  lastInputTime: number;
}

interface ResponsivePerformanceMetrics {
  viewportChanges: ViewportMetrics[];
  layoutShifts: LayoutShiftMetrics[];
  imageLoadingTimes: Record<string, number>;
  componentRenderTimes: Record<string, number>;
  breakpointTransitions: Record<string, number>;
  mobileSpecificMetrics: {
    touchEventLatency: number[];
    scrollPerformance: number[];
    tapTargetMisses: number;
  };
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  metric?: string;
  value?: number;
}

interface ResponsivePerformanceMonitorProps {
  enabled?: boolean;
  showDebugOverlay?: boolean;
  alertThresholds?: {
    layoutShift?: number;
    imageLoadTime?: number;
    touchLatency?: number;
    scrollFps?: number;
  };
  onPerformanceAlert?: (alert: PerformanceAlert) => void;
  onMetricsUpdate?: (metrics: ResponsivePerformanceMetrics) => void;
  logLevel?: 'none' | 'errors' | 'warnings' | 'all';
}

// Default thresholds for performance alerts
const DEFAULT_THRESHOLDS = {
  layoutShift: 0.1, // CLS threshold
  imageLoadTime: 2000, // 2 seconds
  touchLatency: 100, // 100ms
  scrollFps: 50, // 50 FPS minimum
};

export const ResponsivePerformanceMonitor: React.FC<ResponsivePerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  showDebugOverlay = false,
  alertThresholds = DEFAULT_THRESHOLDS,
  onPerformanceAlert,
  onMetricsUpdate,
  logLevel = 'warnings'
}) => {
  const responsiveState = useResponsiveState();
  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTouch = useMediaQuery(mediaQueries.touch);

  // Refs for tracking
  const metricsRef = useRef<ResponsivePerformanceMetrics>({
    viewportChanges: [],
    layoutShifts: [],
    imageLoadingTimes: {},
    componentRenderTimes: {},
    breakpointTransitions: {},
    mobileSpecificMetrics: {
      touchEventLatency: [],
      scrollPerformance: [],
      tapTargetMisses: 0,
    }
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const lastBreakpointRef = useRef<string>(responsiveState.breakpoint);
  const lastViewportRef = useRef<{ width: number; height: number }>({
    width: responsiveState.width,
    height: responsiveState.height
  });

  // Alert handler
  const addAlert = useCallback((alert: PerformanceAlert) => {
    if (logLevel === 'none') return;
    if (logLevel === 'errors' && alert.type !== 'error') return;
    if (logLevel === 'warnings' && alert.type === 'info') return;

    setAlerts(prev => [...prev.slice(-9), alert]); // Keep last 10 alerts
    onPerformanceAlert?.(alert);

    if (logLevel === 'all' || (logLevel === 'warnings' && alert.type !== 'info')) {
      console.log(`[ResponsivePerformanceMonitor] ${alert.type.toUpperCase()}: ${alert.message}`, {
        metric: alert.metric,
        value: alert.value,
        timestamp: alert.timestamp
      });
    }
  }, [logLevel, onPerformanceAlert]);

  // Track viewport changes
  useEffect(() => {
    if (!enabled) return;

    const current = metricsRef.current;
    const newMetrics: ViewportMetrics = {
      width: responsiveState.width,
      height: responsiveState.height,
      devicePixelRatio: responsiveState.pixelRatio,
      orientation: responsiveState.orientation,
      timestamp: Date.now()
    };

    // Check for significant viewport changes
    const lastViewport = lastViewportRef.current;
    const widthChange = Math.abs(responsiveState.width - lastViewport.width);
    const heightChange = Math.abs(responsiveState.height - lastViewport.height);

    if (widthChange > 50 || heightChange > 50) {
      current.viewportChanges.push(newMetrics);
      
      // Limit stored metrics
      if (current.viewportChanges.length > 50) {
        current.viewportChanges = current.viewportChanges.slice(-25);
      }

      addAlert({
        type: 'info',
        message: `Viewport changed: ${responsiveState.width}x${responsiveState.height}`,
        timestamp: Date.now(),
        metric: 'viewport_change'
      });
    }

    lastViewportRef.current = { width: responsiveState.width, height: responsiveState.height };
  }, [enabled, responsiveState.width, responsiveState.height, responsiveState.pixelRatio, responsiveState.orientation, addAlert]);

  // Track breakpoint transitions
  useEffect(() => {
    if (!enabled) return;

    const currentBreakpoint = responsiveState.breakpoint;
    const lastBreakpoint = lastBreakpointRef.current;

    if (currentBreakpoint !== lastBreakpoint) {
      const transitionKey = `${lastBreakpoint}-to-${currentBreakpoint}`;
      const current = metricsRef.current;
      
      current.breakpointTransitions[transitionKey] = Date.now();

      addAlert({
        type: 'info',
        message: `Breakpoint transition: ${lastBreakpoint} → ${currentBreakpoint}`,
        timestamp: Date.now(),
        metric: 'breakpoint_transition'
      });

      lastBreakpointRef.current = currentBreakpoint;
    }
  }, [enabled, responsiveState.breakpoint, addAlert]);

  // Layout Shift monitoring
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let observer: PerformanceObserver | null = null;

    try {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const current = metricsRef.current;

        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift' && 'value' in entry && 'hadRecentInput' in entry) {
            const layoutShift: LayoutShiftMetrics = {
              value: entry.value as number,
              timestamp: entry.startTime,
              hadRecentInput: entry.hadRecentInput as boolean,
              lastInputTime: (entry as any).lastInputTime || 0
            };

            current.layoutShifts.push(layoutShift);

            // Limit stored metrics
            if (current.layoutShifts.length > 100) {
              current.layoutShifts = current.layoutShifts.slice(-50);
            }

            // Alert on high layout shift
            if (layoutShift.value > alertThresholds.layoutShift!) {
              addAlert({
                type: 'warning',
                message: `High layout shift detected: ${layoutShift.value.toFixed(4)}`,
                timestamp: Date.now(),
                metric: 'layout_shift',
                value: layoutShift.value
              });
            }
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('[ResponsivePerformanceMonitor] Layout shift monitoring not supported');
    }

    return () => {
      observer?.disconnect();
    };
  }, [enabled, alertThresholds.layoutShift, addAlert]);

  // Mobile-specific touch event monitoring
  useEffect(() => {
    if (!enabled || !isTouch || typeof window === 'undefined') return;

    let touchStartTime = 0;
    const current = metricsRef.current;

    const handleTouchStart = () => {
      touchStartTime = performance.now();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const latency = performance.now() - touchStartTime;
      current.mobileSpecificMetrics.touchEventLatency.push(latency);

      // Limit stored metrics
      if (current.mobileSpecificMetrics.touchEventLatency.length > 100) {
        current.mobileSpecificMetrics.touchEventLatency = 
          current.mobileSpecificMetrics.touchEventLatency.slice(-50);
      }

      // Alert on high touch latency
      if (latency > alertThresholds.touchLatency!) {
        addAlert({
          type: 'warning',
          message: `High touch latency: ${latency.toFixed(2)}ms`,
          timestamp: Date.now(),
          metric: 'touch_latency',
          value: latency
        });
      }

      // Check for tap target issues (if target is too small)
      const target = event.target as HTMLElement;
      if (target) {
        const rect = target.getBoundingClientRect();
        const targetSize = Math.min(rect.width, rect.height);
        
        if (targetSize < 44) { // Apple's recommended minimum tap target size
          current.mobileSpecificMetrics.tapTargetMisses++;
          
          addAlert({
            type: 'warning',
            message: `Small tap target detected: ${targetSize.toFixed(0)}px`,
            timestamp: Date.now(),
            metric: 'tap_target_size',
            value: targetSize
          });
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, isTouch, alertThresholds.touchLatency, addAlert]);

  // Scroll performance monitoring for mobile
  useEffect(() => {
    if (!enabled || !isMobile || typeof window === 'undefined') return;

    let lastScrollTime = 0;
    let frameCount = 0;
    let totalFrameTime = 0;
    const current = metricsRef.current;

    const handleScroll = () => {
      const now = performance.now();
      
      if (lastScrollTime) {
        frameCount++;
        totalFrameTime += now - lastScrollTime;
        
        // Calculate FPS every 10 frames
        if (frameCount >= 10) {
          const avgFrameTime = totalFrameTime / frameCount;
          const fps = 1000 / avgFrameTime;
          
          current.mobileSpecificMetrics.scrollPerformance.push(fps);
          
          // Limit stored metrics
          if (current.mobileSpecificMetrics.scrollPerformance.length > 50) {
            current.mobileSpecificMetrics.scrollPerformance = 
              current.mobileSpecificMetrics.scrollPerformance.slice(-25);
          }
          
          // Alert on low FPS
          if (fps < alertThresholds.scrollFps!) {
            addAlert({
              type: 'warning',
              message: `Low scroll FPS: ${fps.toFixed(1)}`,
              timestamp: Date.now(),
              metric: 'scroll_fps',
              value: fps
            });
          }
          
          frameCount = 0;
          totalFrameTime = 0;
        }
      }
      
      lastScrollTime = now;
    };

    const throttledScroll = throttle(handleScroll, 16); // ~60fps throttling
    document.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      document.removeEventListener('scroll', throttledScroll);
    };
  }, [enabled, isMobile, alertThresholds.scrollFps, addAlert]);

  // Image loading performance monitoring
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const current = metricsRef.current;
    
    const handleImageLoad = (event: Event) => {
      const img = event.target as HTMLImageElement;
      if (img && img.src) {
        const loadTime = performance.now();
        const imageName = img.src.split('/').pop() || 'unknown';
        
        current.imageLoadingTimes[imageName] = loadTime;
        
        // Alert on slow image loading
        if (loadTime > alertThresholds.imageLoadTime!) {
          addAlert({
            type: 'warning',
            message: `Slow image loading: ${imageName} (${loadTime.toFixed(0)}ms)`,
            timestamp: Date.now(),
            metric: 'image_load_time',
            value: loadTime
          });
        }
      }
    };

    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;
      if (img && img.src) {
        const imageName = img.src.split('/').pop() || 'unknown';
        addAlert({
          type: 'error',
          message: `Image failed to load: ${imageName}`,
          timestamp: Date.now(),
          metric: 'image_load_error'
        });
      }
    };

    // Monitor existing images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('load', handleImageLoad);
      img.addEventListener('error', handleImageError);
    });

    // Monitor dynamically added images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const newImages = element.tagName === 'IMG' 
              ? [element as HTMLImageElement]
              : Array.from(element.querySelectorAll('img'));
            
            newImages.forEach(img => {
              img.addEventListener('load', handleImageLoad);
              img.addEventListener('error', handleImageError);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageError);
      });
      observer.disconnect();
    };
  }, [enabled, alertThresholds.imageLoadTime, addAlert]);

  // Periodic metrics update
  useEffect(() => {
    if (!enabled || !onMetricsUpdate) return;

    const interval = setInterval(() => {
      onMetricsUpdate(metricsRef.current);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [enabled, onMetricsUpdate]);

  // Performance summary calculations
  const performanceSummary = useMemo(() => {
    const current = metricsRef.current;
    
    const avgLayoutShift = current.layoutShifts.length > 0
      ? current.layoutShifts.reduce((sum, shift) => sum + shift.value, 0) / current.layoutShifts.length
      : 0;

    const avgTouchLatency = current.mobileSpecificMetrics.touchEventLatency.length > 0
      ? current.mobileSpecificMetrics.touchEventLatency.reduce((sum, latency) => sum + latency, 0) / 
        current.mobileSpecificMetrics.touchEventLatency.length
      : 0;

    const avgScrollFps = current.mobileSpecificMetrics.scrollPerformance.length > 0
      ? current.mobileSpecificMetrics.scrollPerformance.reduce((sum, fps) => sum + fps, 0) / 
        current.mobileSpecificMetrics.scrollPerformance.length
      : 0;

    const imageLoadCount = Object.keys(current.imageLoadingTimes).length;
    const avgImageLoadTime = imageLoadCount > 0
      ? Object.values(current.imageLoadingTimes).reduce((sum, time) => sum + time, 0) / imageLoadCount
      : 0;

    return {
      avgLayoutShift,
      avgTouchLatency,
      avgScrollFps,
      avgImageLoadTime,
      totalViewportChanges: current.viewportChanges.length,
      totalBreakpointTransitions: Object.keys(current.breakpointTransitions).length,
      tapTargetMisses: current.mobileSpecificMetrics.tapTargetMisses,
      alertCount: alerts.length
    };
  }, [alerts.length]);

  // Throttle function (defined here to avoid import issues)
  function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  // Debug overlay component
  const DebugOverlay = () => {
    if (!showDebugOverlay || !enabled) return null;

    return (
      <div className="fixed top-4 right-4 z-50 bg-black bg-opacity-90 text-white p-4 rounded-lg text-sm max-w-xs">
        <h3 className="font-bold mb-2">Performance Monitor</h3>
        <div className="space-y-1">
          <div>Device: {responsiveState.device}</div>
          <div>Breakpoint: {responsiveState.breakpoint}</div>
          <div>Viewport: {responsiveState.width}×{responsiveState.height}</div>
          <div>Pixel Ratio: {responsiveState.pixelRatio}</div>
          <div>Touch: {isTouch ? 'Yes' : 'No'}</div>
          
          <hr className="my-2 border-gray-600" />
          
          <div>Avg CLS: {performanceSummary.avgLayoutShift.toFixed(4)}</div>
          {isMobile && (
            <>
              <div>Touch Latency: {performanceSummary.avgTouchLatency.toFixed(1)}ms</div>
              <div>Scroll FPS: {performanceSummary.avgScrollFps.toFixed(1)}</div>
              <div>Tap Misses: {performanceSummary.tapTargetMisses}</div>
            </>
          )}
          <div>Img Load: {performanceSummary.avgImageLoadTime.toFixed(0)}ms</div>
          
          {alerts.length > 0 && (
            <>
              <hr className="my-2 border-gray-600" />
              <div className="text-xs">
                <div className="font-semibold">Recent Alerts:</div>
                {alerts.slice(-3).map((alert, index) => (
                  <div key={index} className={`truncate ${
                    alert.type === 'error' ? 'text-red-300' :
                    alert.type === 'warning' ? 'text-yellow-300' :
                    'text-blue-300'
                  }`}>
                    {alert.message}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (!enabled) return null;

  return <DebugOverlay />;
};

// Hook for accessing performance metrics
export const useResponsivePerformanceMetrics = (enabled: boolean = true) => {
  const [metrics, setMetrics] = useState<ResponsivePerformanceMetrics | null>(null);

  const handleMetricsUpdate = useCallback((newMetrics: ResponsivePerformanceMetrics) => {
    setMetrics(newMetrics);
  }, []);

  return {
    metrics,
    handleMetricsUpdate,
    ResponsivePerformanceMonitorComponent: enabled ? (
      <ResponsivePerformanceMonitor
        enabled={enabled}
        onMetricsUpdate={handleMetricsUpdate}
      />
    ) : null
  };
};

// Performance optimization helper for responsive components
export const withResponsivePerformance = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const renderStart = useRef<number>(0);
    
    useEffect(() => {
      renderStart.current = performance.now();
    });

    useEffect(() => {
      const renderTime = performance.now() - renderStart.current;
      if (renderTime > 16) { // More than one frame
        console.warn(`[ResponsivePerformance] ${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    });

    return <Component {...props} />;
  });
};

export default ResponsivePerformanceMonitor; 