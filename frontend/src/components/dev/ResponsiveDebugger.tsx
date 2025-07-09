import React, { useState, useEffect } from 'react';
import { FiMonitor, FiTablet, FiSmartphone, FiEye, FiEyeOff, FiInfo } from 'react-icons/fi';
import { useResponsiveState, BREAKPOINTS } from '../../utils/responsive';

interface ResponsiveDebuggerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  initialCollapsed?: boolean;
  showGridOverlay?: boolean;
}

const ResponsiveDebugger: React.FC<ResponsiveDebuggerProps> = ({
  position = 'bottom-right',
  initialCollapsed = false,
  showGridOverlay = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [showOverlay, setShowOverlay] = useState(showGridOverlay);
  const [isPinned, setIsPinned] = useState(false);
  
  const {
    width,
    height,
    breakpoint,
    device,
    orientation,
    isTouch,
    prefersReducedMotion,
    prefersDarkMode,
    pixelRatio
  } = useResponsiveState();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-[9999]';
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'bottom-right':
      default:
        return `${baseClasses} bottom-4 right-4`;
    }
  };

  const getDeviceIcon = () => {
    switch (device) {
      case 'mobile':
        return <FiSmartphone className="h-4 w-4" />;
      case 'tablet':
        return <FiTablet className="h-4 w-4" />;
      case 'desktop':
        return <FiMonitor className="h-4 w-4" />;
      default:
        return <FiMonitor className="h-4 w-4" />;
    }
  };

  const getBreakpointColor = () => {
    switch (breakpoint) {
      case 'xs':
        return 'bg-red-500';
      case 'sm':
        return 'bg-orange-500';
      case 'md':
        return 'bg-yellow-500';
      case 'lg':
        return 'bg-green-500';
      case 'xl':
        return 'bg-blue-500';
      case 'xxl':
        return 'bg-indigo-500';
      case '3xl':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const getPerformanceInfo = () => {
    if (typeof navigator === 'undefined') return null;
    
    return {
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      memory: (performance as any).memory ? {
        used: formatBytes((performance as any).memory.usedJSHeapSize),
        total: formatBytes((performance as any).memory.totalJSHeapSize),
        limit: formatBytes((performance as any).memory.jsHeapSizeLimit)
      } : null
    };
  };

  const performanceInfo = getPerformanceInfo();

  return (
    <>
      {/* Grid Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
          <div className="h-full max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-12 gap-4 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-blue-500/10 border border-blue-500/20 border-dashed"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Debugger Panel */}
      <div className={getPositionClasses()}>
        <div className="bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-xl border border-white/10 font-mono text-xs">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              {getDeviceIcon()}
              <span className="font-semibold">Responsive Debugger</span>
              <div className={`w-2 h-2 rounded-full ${getBreakpointColor()}`} />
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`p-1 rounded hover:bg-white/10 transition-colors ${
                  showOverlay ? 'text-blue-400' : 'text-white/60'
                }`}
                title="Toggle Grid Overlay"
              >
                {showOverlay ? <FiEye className="h-3 w-3" /> : <FiEyeOff className="h-3 w-3" />}
              </button>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <FiInfo className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Content */}
          {!isCollapsed && (
            <div className="p-3 space-y-3">
              {/* Viewport Info */}
              <div>
                <div className="text-white/60 mb-1">Viewport</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="text-blue-300">{width} × {height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakpoint:</span>
                    <span className={`px-2 py-0.5 rounded text-black font-medium ${getBreakpointColor()}`}>
                      {breakpoint.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Device:</span>
                    <span className="text-green-300 capitalize">{device}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orientation:</span>
                    <span className="text-yellow-300 capitalize">{orientation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pixel Ratio:</span>
                    <span className="text-purple-300">{pixelRatio}x</span>
                  </div>
                </div>
              </div>

              {/* Breakpoint Ranges */}
              <div>
                <div className="text-white/60 mb-1">Breakpoints</div>
                <div className="space-y-1 text-xs">
                  {Object.entries(BREAKPOINTS).map(([bp, value]) => (
                    <div
                      key={bp}
                      className={`flex justify-between ${
                        bp === breakpoint ? 'text-blue-300 font-medium' : 'text-white/40'
                      }`}
                    >
                      <span>{bp}:</span>
                      <span>{value}px+</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Features */}
              <div>
                <div className="text-white/60 mb-1">Features</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Touch:</span>
                    <span className={isTouch ? 'text-green-300' : 'text-red-300'}>
                      {isTouch ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dark Mode:</span>
                    <span className={prefersDarkMode ? 'text-green-300' : 'text-red-300'}>
                      {prefersDarkMode ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reduced Motion:</span>
                    <span className={prefersReducedMotion ? 'text-green-300' : 'text-red-300'}>
                      {prefersReducedMotion ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Info */}
              {performanceInfo && (
                <div>
                  <div className="text-white/60 mb-1">Performance</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Connection:</span>
                      <span className="text-orange-300 uppercase">{performanceInfo.connection}</span>
                    </div>
                    {performanceInfo.memory && (
                      <>
                        <div className="flex justify-between">
                          <span>Memory Used:</span>
                          <span className="text-red-300">{performanceInfo.memory.used}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory Total:</span>
                          <span className="text-blue-300">{performanceInfo.memory.total}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-white/60 mb-2">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.location.href = '/test-responsive'}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
                  >
                    Test Page
                  </button>
                  <button
                    onClick={() => {
                      const info = {
                        viewport: { width, height },
                        breakpoint,
                        device,
                        orientation,
                        features: { isTouch, prefersReducedMotion, prefersDarkMode },
                        performance: performanceInfo
                      };
                      navigator.clipboard.writeText(JSON.stringify(info, null, 2));
                    }}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
                  >
                    Copy Info
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResponsiveDebugger; 