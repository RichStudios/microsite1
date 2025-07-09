import React from 'react';
import { useIsMobile, useIsTablet, useIsDesktop } from '../../utils/responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  centerContent?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Responsive Container Component
 * Implements mobile-first responsive design with consistent spacing and layout
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  padding = 'md',
  maxWidth = 'xl',
  centerContent = false,
  as: Component = 'div'
}) => {
  // Responsive padding classes (mobile-first)
  const paddingClasses = {
    none: '',
    sm: 'px-4 xs:px-6 sm:px-8',                    // 16px → 24px → 32px
    md: 'px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16', // 16px → 24px → 32px → 48px → 64px
    lg: 'px-6 xs:px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24', // 24px → 32px → 48px → 64px → 80px → 96px
    xl: 'px-8 xs:px-12 sm:px-16 md:px-20 lg:px-24 xl:px-32'  // 32px → 48px → 64px → 80px → 96px → 128px
  };

  // Max width classes
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full'
  };

  // Combine classes
  const combinedClasses = [
    'w-full',
    paddingClasses[padding],
    maxWidthClasses[maxWidth],
    centerContent ? 'mx-auto' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={combinedClasses}>
      {children}
    </Component>
  );
};

/**
 * Responsive Grid Component
 * Mobile-first responsive grid system
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  className = ''
}) => {
  // Gap classes
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  // Generate responsive grid columns
  const getGridCols = () => {
    const classes = ['grid'];
    
    if (columns.xs) classes.push(`grid-cols-${columns.xs}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    if (columns['2xl']) classes.push(`2xl:grid-cols-${columns['2xl']}`);
    
    return classes.join(' ');
  };

  return (
    <div className={`${getGridCols()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Responsive Text Component
 * Mobile-first responsive typography
 */
interface ResponsiveTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  responsive?: boolean;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  className = '',
  responsive = true
}) => {
  // Responsive text size classes (mobile-first)
  const responsiveTextClasses = responsive ? {
    xs: 'text-xs xs:text-sm',
    sm: 'text-sm xs:text-base',
    base: 'text-sm xs:text-base sm:text-lg',
    lg: 'text-base xs:text-lg sm:text-xl',
    xl: 'text-lg xs:text-xl sm:text-2xl',
    '2xl': 'text-xl xs:text-2xl sm:text-3xl',
    '3xl': 'text-2xl xs:text-3xl sm:text-4xl md:text-5xl',
    '4xl': 'text-3xl xs:text-4xl sm:text-5xl md:text-6xl',
    '5xl': 'text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
  } : {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const combinedClasses = [
    responsiveTextClasses[size],
    weightClasses[weight],
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={combinedClasses}>
      {children}
    </Component>
  );
};

/**
 * Responsive Stack Component
 * Mobile-first responsive vertical spacing
 */
interface ResponsiveStackProps {
  children: React.ReactNode;
  spacing?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  spacing = { xs: 4, sm: 6, md: 8, lg: 12 },
  className = ''
}) => {
  // Generate responsive spacing classes
  const getSpacingClasses = () => {
    const classes = ['space-y-4']; // Default mobile spacing
    
    if (spacing.xs) classes[0] = `space-y-${spacing.xs}`;
    if (spacing.sm) classes.push(`sm:space-y-${spacing.sm}`);
    if (spacing.md) classes.push(`md:space-y-${spacing.md}`);
    if (spacing.lg) classes.push(`lg:space-y-${spacing.lg}`);
    if (spacing.xl) classes.push(`xl:space-y-${spacing.xl}`);
    
    return classes.join(' ');
  };

  return (
    <div className={`${getSpacingClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer; 