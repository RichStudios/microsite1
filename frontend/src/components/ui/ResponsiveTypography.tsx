import React, { useMemo } from 'react';
import { useResponsiveState, responsiveTypography } from '../../utils/responsive';

interface ResponsiveTypographyProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
  className?: string;
  children: React.ReactNode;
  fluid?: boolean;
  gradient?: boolean;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  maxLines?: number;
  responsive?: {
    xs?: Partial<TypographyStyle>;
    sm?: Partial<TypographyStyle>;
    md?: Partial<TypographyStyle>;
    lg?: Partial<TypographyStyle>;
    xl?: Partial<TypographyStyle>;
  };
}

interface TypographyStyle {
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight?: string;
  textAlign?: string;
  color?: string;
}

// Fluid typography calculation using clamp()
const calculateFluidSize = (minSize: number, maxSize: number, minVw: number = 320, maxVw: number = 1280): string => {
  const slope = (maxSize - minSize) / (maxVw - minVw);
  const intersection = minSize - slope * minVw;
  return `clamp(${minSize}rem, ${intersection.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${maxSize}rem)`;
};

// Enhanced typography scale with fluid sizing
const fluidTypography = {
  h1: {
    fontSize: calculateFluidSize(1.5, 3.75),  // 24px to 60px
    lineHeight: '1.1',
    letterSpacing: '-0.03em',
    fontWeight: '700',
  },
  h2: {
    fontSize: calculateFluidSize(1.25, 3),    // 20px to 48px
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    fontWeight: '600',
  },
  h3: {
    fontSize: calculateFluidSize(1.125, 2.25), // 18px to 36px
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    fontWeight: '600',
  },
  body: {
    fontSize: calculateFluidSize(0.875, 1.125), // 14px to 18px
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: '400',
  },
  small: {
    fontSize: calculateFluidSize(0.75, 1),     // 12px to 16px
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: '400',
  },
  caption: {
    fontSize: calculateFluidSize(0.688, 0.875), // 11px to 14px
    lineHeight: '1.4',
    letterSpacing: '0.025em',
    fontWeight: '500',
  },
} as const;

// Font weight mapping
const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const ResponsiveTypography: React.FC<ResponsiveTypographyProps> = ({
  as: Component = 'p',
  variant = 'body',
  className = '',
  children,
  fluid = true,
  gradient = false,
  weight,
  align,
  color,
  maxLines,
  responsive,
}) => {
  const { breakpoint, device } = useResponsiveState();

  // Get base typography styles
  const baseStyle = useMemo(() => {
    if (fluid) {
      return fluidTypography[variant];
    }
    
    // Use responsive typography from utils if not fluid
    const responsiveStyles = responsiveTypography[variant];
    return responsiveStyles?.[breakpoint] || responsiveStyles?.xs || {};
  }, [variant, fluid, breakpoint]);

  // Apply responsive overrides
  const responsiveStyle = useMemo(() => {
    if (!responsive) return {};
    
    // Get the appropriate responsive style
    return responsive[breakpoint] || responsive.xs || {};
  }, [responsive, breakpoint]);

  // Combine all styles
  const computedStyle = useMemo(() => {
    const style: React.CSSProperties = {
      fontSize: baseStyle.fontSize,
      lineHeight: baseStyle.lineHeight,
      letterSpacing: baseStyle.letterSpacing,
      fontWeight: weight ? fontWeights[weight] : baseStyle.fontWeight,
      textAlign: align,
      color: color,
      margin: 0, // Reset default margins
      ...responsiveStyle,
    };

    // Add gradient text effect
    if (gradient) {
      style.background = 'linear-gradient(135deg, var(--primary-color), #2d8a30)';
      style.WebkitBackgroundClip = 'text';
      style.WebkitTextFillColor = 'transparent';
      style.backgroundClip = 'text';
    }

    // Add line clamping
    if (maxLines) {
      style.display = '-webkit-box';
      style.WebkitLineClamp = maxLines;
      style.WebkitBoxOrient = 'vertical';
      style.overflow = 'hidden';
    }

    return style;
  }, [baseStyle, responsiveStyle, weight, align, color, gradient, maxLines]);

  // Build CSS classes
  const classes = useMemo(() => {
    return [
      'responsive-typography',
      `typography-${variant}`,
      `typography-${device}`,
      fluid && 'typography-fluid',
      gradient && 'typography-gradient',
      weight && `typography-${weight}`,
      align && `typography-${align}`,
      maxLines && 'typography-clamped',
      className,
    ].filter(Boolean).join(' ');
  }, [variant, device, fluid, gradient, weight, align, maxLines, className]);

  return (
    <Component
      className={classes}
      style={computedStyle}
      data-variant={variant}
      data-device={device}
      data-breakpoint={breakpoint}
    >
      {children}
    </Component>
  );
};

// Preset typography components
export const ResponsiveHeading1: React.FC<Omit<ResponsiveTypographyProps, 'variant' | 'as'>> = (props) => (
  <ResponsiveTypography as="h1" variant="h1" {...props} />
);

export const ResponsiveHeading2: React.FC<Omit<ResponsiveTypographyProps, 'variant' | 'as'>> = (props) => (
  <ResponsiveTypography as="h2" variant="h2" {...props} />
);

export const ResponsiveHeading3: React.FC<Omit<ResponsiveTypographyProps, 'variant' | 'as'>> = (props) => (
  <ResponsiveTypography as="h3" variant="h3" {...props} />
);

export const ResponsiveBody: React.FC<Omit<ResponsiveTypographyProps, 'variant'>> = (props) => (
  <ResponsiveTypography variant="body" {...props} />
);

export const ResponsiveSmall: React.FC<Omit<ResponsiveTypographyProps, 'variant'>> = (props) => (
  <ResponsiveTypography variant="small" {...props} />
);

export const ResponsiveCaption: React.FC<Omit<ResponsiveTypographyProps, 'variant'>> = (props) => (
  <ResponsiveTypography variant="caption" {...props} />
);

// Hook for accessing typography utilities
export const useResponsiveTypography = () => {
  const { breakpoint, device } = useResponsiveState();
  
  return {
    breakpoint,
    device,
    getTypographyStyle: (variant: keyof typeof responsiveTypography) => {
      return responsiveTypography[variant]?.[breakpoint] || responsiveTypography[variant]?.xs;
    },
    getFluidStyle: (variant: keyof typeof fluidTypography) => {
      return fluidTypography[variant];
    },
    calculateFluidSize,
    fontWeights,
  };
};

export default ResponsiveTypography; 