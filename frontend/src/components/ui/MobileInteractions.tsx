import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useResponsiveState, useIsTouch, usePrefersReducedMotion } from '../../utils/responsive';

interface TouchPosition {
  x: number;
  y: number;
}

interface GestureState {
  isActive: boolean;
  startPos: TouchPosition;
  currentPos: TouchPosition;
  deltaX: number;
  deltaY: number;
  velocity: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  duration: number;
}

interface SwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  velocityThreshold?: number;
  className?: string;
  disabled?: boolean;
}

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  className?: string;
  disabled?: boolean;
}

interface LongPressProps {
  children: React.ReactNode;
  onLongPress: () => void;
  delay?: number;
  className?: string;
  disabled?: boolean;
}

interface TapProps {
  children: React.ReactNode;
  onTap?: () => void;
  onDoubleTap?: () => void;
  doubleTapDelay?: number;
  className?: string;
  disabled?: boolean;
}

// Swipe Gesture Component
export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocityThreshold = 0.5,
  className = '',
  disabled = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
    direction: null,
    distance: 0,
    duration: 0,
  });

  const { device } = useResponsiveState();
  const isTouch = useIsTouch();
  const prefersReducedMotion = usePrefersReducedMotion();

  const startTimeRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || !isTouch) return;

    const touch = e.touches[0];
    const startPos = { x: touch.clientX, y: touch.clientY };
    startTimeRef.current = Date.now();

    setGestureState(prev => ({
      ...prev,
      isActive: true,
      startPos,
      currentPos: startPos,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      direction: null,
      distance: 0,
      duration: 0,
    }));
  }, [disabled, isTouch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !gestureState.isActive) return;

    const touch = e.touches[0];
    const currentPos = { x: touch.clientX, y: touch.clientY };
    const deltaX = currentPos.x - gestureState.startPos.x;
    const deltaY = currentPos.y - gestureState.startPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - startTimeRef.current;

    setGestureState(prev => ({
      ...prev,
      currentPos,
      deltaX,
      deltaY,
      distance,
      duration,
    }));
  }, [disabled, gestureState.isActive, gestureState.startPos]);

  const handleTouchEnd = useCallback(() => {
    if (disabled || !gestureState.isActive) return;

    const { deltaX, deltaY, distance, duration } = gestureState;
    const velocity = distance / duration;

    // Determine swipe direction and trigger callbacks
    if (distance >= threshold && velocity >= velocityThreshold) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    setGestureState(prev => ({ ...prev, isActive: false }));
  }, [disabled, gestureState, threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <div
      ref={elementRef}
      className={`swipe-gesture ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: disabled ? 'auto' : 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

// Pull to Refresh Component
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshThreshold = 80,
  className = '',
  disabled = false,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const startY = useRef(0);
  const scrollElement = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const scrollTop = scrollElement.current?.scrollTop || 0;
    if (scrollTop > 0) return; // Only work when at top

    startY.current = e.touches[0].clientY;
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing || startY.current === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 0) {
      e.preventDefault(); // Prevent scrolling
      setPullDistance(distance);
      setIsReady(distance >= refreshThreshold);
    }
  }, [disabled, isRefreshing, refreshThreshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !isReady) {
      setPullDistance(0);
      setIsReady(false);
      return;
    }

    setIsRefreshing(true);
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
      setIsReady(false);
      startY.current = 0;
    }
  }, [disabled, isRefreshing, isReady, onRefresh]);

  const pullProgress = Math.min(pullDistance / refreshThreshold, 1);

  return (
    <div className={`pull-to-refresh ${className}`}>
      {/* Pull indicator */}
      <div 
        className="pull-indicator"
        style={{
          transform: `translateY(${pullDistance > 0 ? pullDistance - refreshThreshold : -refreshThreshold}px)`,
          opacity: pullDistance > 0 ? Math.min(pullProgress, 1) : 0,
          transition: pullDistance === 0 ? 'transform 0.3s ease, opacity 0.3s ease' : 'none',
        }}
      >
        <div className={`pull-icon ${isReady ? 'ready' : ''} ${isRefreshing ? 'refreshing' : ''}`}>
          {isRefreshing ? '🔄' : isReady ? '🚀' : '⬇️'}
        </div>
        <span className="pull-text">
          {isRefreshing ? 'Refreshing...' : isReady ? 'Release to refresh' : 'Pull to refresh'}
        </span>
      </div>

      {/* Content */}
      <div
        ref={scrollElement}
        className="pull-content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s ease' : 'none',
          touchAction: 'pan-y',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Long Press Component
export const LongPress: React.FC<LongPressProps> = ({
  children,
  onLongPress,
  delay = 500,
  className = '',
  disabled = false,
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const startLongPress = useCallback(() => {
    if (disabled) return;

    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, delay);
  }, [disabled, onLongPress, delay]);

  const endLongPress = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPressed(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`long-press ${className} ${isPressed ? 'pressed' : ''}`}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
      onTouchCancel={endLongPress}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onMouseLeave={endLongPress}
      style={{
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

// Tap Component
export const Tap: React.FC<TapProps> = ({
  children,
  onTap,
  onDoubleTap,
  doubleTapDelay = 300,
  className = '',
  disabled = false,
}) => {
  const lastTapRef = useRef<number>(0);
  const tapCountRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    if (disabled) return;

    const now = Date.now();
    tapCountRef.current += 1;

    if (tapCountRef.current === 1) {
      // First tap
      lastTapRef.current = now;
      
      timeoutRef.current = setTimeout(() => {
        if (tapCountRef.current === 1 && onTap) {
          onTap();
        }
        tapCountRef.current = 0;
      }, doubleTapDelay);
    } else if (tapCountRef.current === 2) {
      // Double tap
      if (now - lastTapRef.current <= doubleTapDelay && onDoubleTap) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        onDoubleTap();
        tapCountRef.current = 0;
      }
    }
  }, [disabled, onTap, onDoubleTap, doubleTapDelay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`tap-gesture ${className}`}
      onTouchEnd={handleTap}
      onClick={handleTap}
      style={{
        touchAction: 'manipulation',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {children}
    </div>
  );
};

// Touch Feedback Component
interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  haptic?: boolean;
  visual?: boolean;
  audio?: boolean;
}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  className = '',
  haptic = true,
  visual = true,
  audio = false,
}) => {
  const [isActive, setIsActive] = useState(false);
  const { isTouch } = useResponsiveState();

  const provideFeedback = useCallback(() => {
    if (!isTouch) return;

    // Visual feedback
    if (visual) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 150);
    }

    // Haptic feedback
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Audio feedback (if needed)
    if (audio) {
      // Could play a subtle sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBSuU2/PKcSIELYTQ894OLY...');
      audio.volume = 0.1;
      audio.play().catch(() => {}); // Ignore errors
    }
  }, [isTouch, visual, haptic, audio]);

  return (
    <div
      className={`touch-feedback ${className} ${isActive ? 'active' : ''}`}
      onTouchStart={provideFeedback}
      style={{
        transition: 'all 0.15s ease',
        transform: isActive ? 'scale(0.95)' : 'scale(1)',
        opacity: isActive ? 0.8 : 1,
      }}
    >
      {children}
    </div>
  );
};

// Hook for gesture detection
export const useGestures = () => {
  const { device, isTouch } = useResponsiveState();
  
  return {
    isTouch,
    isMobile: device === 'mobile',
    isGestureSupported: isTouch && 'ontouchstart' in window,
    supportsHaptic: 'vibrate' in navigator,
    supportsPointerEvents: 'PointerEvent' in window,
  };
};

export default {
  SwipeGesture,
  PullToRefresh,
  LongPress,
  Tap,
  TouchFeedback,
  useGestures,
}; 