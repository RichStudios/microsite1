import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useResponsiveState, useContainerQuery, useResponsiveGrid } from '../../utils/responsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  minItemWidth?: number;
  maxItemWidth?: number;
  gap?: number | { mobile?: number; tablet?: number; desktop?: number };
  minColumns?: number;
  maxColumns?: number;
  aspectRatio?: string;
  autoFit?: boolean;
  autoFill?: boolean;
  equalHeight?: boolean;
  containerQuery?: boolean;
  adaptiveSpacing?: boolean;
  mobileStack?: boolean;
  // Performance optimizations
  virtualized?: boolean;
  itemHeight?: number;
  overscan?: number;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  minItemWidth = 280,
  maxItemWidth = 400,
  gap = { mobile: 16, tablet: 20, desktop: 24 },
  minColumns = 1,
  maxColumns = 12,
  aspectRatio,
  autoFit = true,
  autoFill = false,
  equalHeight = false,
  containerQuery = false,
  adaptiveSpacing = true,
  mobileStack = true,
  virtualized = false,
  itemHeight = 300,
  overscan = 5,
}) => {
  const { device, breakpoint, width } = useResponsiveState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  
  // Container query support
  const [containerQueryRef, containerMatches] = useContainerQuery<HTMLDivElement>({
    'small': `(max-width: ${minItemWidth * 2}px)`,
    'medium': `(max-width: ${minItemWidth * 3}px)`,
    'large': `(min-width: ${minItemWidth * 4}px)`
  });

  // Custom hook to combine refs properly
  const useCombinedRefs = (...refs: React.Ref<HTMLDivElement>[]): React.RefCallback<HTMLDivElement> => {
    return useCallback((element: HTMLDivElement | null) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref && typeof ref === 'object') {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
        }
      });
    }, refs);
  };

  // Get the combined ref
  const combinedRef = useCombinedRefs(
    containerRef,
    containerQuery ? containerQueryRef : null
  );

  // Get responsive grid calculations
  const { columns, itemsPerRow } = useResponsiveGrid(
    minItemWidth,
    typeof gap === 'number' ? gap : gap[device] || gap.mobile || 16,
    minColumns,
    maxColumns
  );

  // Calculate responsive gap
  const responsiveGap = useMemo(() => {
    if (typeof gap === 'number') return gap;
    
    switch (device) {
      case 'desktop': return gap.desktop || gap.tablet || gap.mobile || 24;
      case 'tablet': return gap.tablet || gap.mobile || 20;
      case 'mobile': return gap.mobile || 16;
      default: return 16;
    }
  }, [gap, device]);

  // Handle mobile stacking
  const shouldStack = mobileStack && device === 'mobile' && width < minItemWidth * 1.5;
  const effectiveColumns = shouldStack ? 1 : columns;

  // Virtualization for performance
  useEffect(() => {
    if (!virtualized || !containerRef.current) return;

    const container = containerRef.current;
    const itemsArray = React.Children.toArray(children);
    const totalItems = itemsArray.length;
    
    const updateVisibleRange = () => {
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const rowHeight = itemHeight + responsiveGap;
      
      const startRow = Math.floor(scrollTop / rowHeight);
      const endRow = Math.ceil((scrollTop + containerHeight) / rowHeight);
      
      const startIndex = Math.max(0, startRow * effectiveColumns - overscan);
      const endIndex = Math.min(totalItems, endRow * effectiveColumns + overscan);
      
      setVisibleRange({ start: startIndex, end: endIndex });
    };

    updateVisibleRange();
    container.addEventListener('scroll', updateVisibleRange, { passive: true });
    
    return () => container.removeEventListener('scroll', updateVisibleRange);
  }, [virtualized, children, effectiveColumns, itemHeight, responsiveGap, overscan]);

  // Grid style computation
  const gridStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      display: 'grid',
      gap: `${responsiveGap}px`,
      width: '100%',
    };

    if (shouldStack) {
      return {
        ...baseStyle,
        gridTemplateColumns: '1fr',
      };
    }

    if (autoFit) {
      return {
        ...baseStyle,
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, ${maxItemWidth}px))`,
      };
    }

    if (autoFill) {
      return {
        ...baseStyle,
        gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
      };
    }

    return {
      ...baseStyle,
      gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)`,
    };
  }, [shouldStack, autoFit, autoFill, effectiveColumns, minItemWidth, maxItemWidth, responsiveGap]);

  // Add aspect ratio and equal height styles
  const itemStyle = useMemo(() => {
    const style: React.CSSProperties = {};
    
    if (aspectRatio) {
      style.aspectRatio = aspectRatio;
    }
    
    if (equalHeight) {
      style.height = '100%';
    }
    
    return style;
  }, [aspectRatio, equalHeight]);



  // Render children (with virtualization if enabled)
  const renderChildren = () => {
    const childrenArray = React.Children.toArray(children);
    
    if (virtualized) {
      const visibleChildren = childrenArray.slice(visibleRange.start, visibleRange.end);
      return visibleChildren.map((child, index) => (
        <div
          key={visibleRange.start + index}
          style={itemStyle}
          className="responsive-grid-item"
        >
          {child}
        </div>
      ));
    }

    return childrenArray.map((child, index) => (
      <div
        key={index}
        style={itemStyle}
        className="responsive-grid-item"
      >
        {child}
      </div>
    ));
  };

  const containerClasses = [
    'responsive-grid',
    className,
    shouldStack && 'responsive-grid--stacked',
    adaptiveSpacing && 'responsive-grid--adaptive',
    containerQuery && 'responsive-grid--container-query',
    virtualized && 'responsive-grid--virtualized',
    equalHeight && 'responsive-grid--equal-height',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={combinedRef}
      className={containerClasses}
      style={gridStyle}
      data-device={device}
      data-breakpoint={breakpoint}
      data-columns={effectiveColumns}
      data-container-small={containerQuery && containerMatches.small}
      data-container-medium={containerQuery && containerMatches.medium}
      data-container-large={containerQuery && containerMatches.large}
    >
      {renderChildren()}
    </div>
  );
};

// Preset grid configurations
export const BookmakerGrid: React.FC<Omit<ResponsiveGridProps, 'minItemWidth' | 'maxItemWidth'>> = (props) => (
  <ResponsiveGrid
    minItemWidth={300}
    maxItemWidth={400}
    gap={{ mobile: 16, tablet: 20, desktop: 24 }}
    equalHeight={true}
    aspectRatio="4/3"
    {...props}
  />
);

export const BlogGrid: React.FC<Omit<ResponsiveGridProps, 'minItemWidth' | 'maxItemWidth'>> = (props) => (
  <ResponsiveGrid
    minItemWidth={280}
    maxItemWidth={380}
    gap={{ mobile: 16, tablet: 24, desktop: 32 }}
    aspectRatio="16/10"
    {...props}
  />
);

export const CompactGrid: React.FC<Omit<ResponsiveGridProps, 'minItemWidth' | 'maxItemWidth'>> = (props) => (
  <ResponsiveGrid
    minItemWidth={200}
    maxItemWidth={280}
    gap={{ mobile: 12, tablet: 16, desktop: 20 }}
    autoFit={true}
    mobileStack={false}
    {...props}
  />
);

export const MasonryGrid: React.FC<ResponsiveGridProps> = (props) => (
  <ResponsiveGrid
    equalHeight={false}
    autoFit={true}
    adaptiveSpacing={true}
    {...props}
  />
);

export default ResponsiveGrid; 