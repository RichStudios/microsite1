import React, { useMemo } from 'react';
import Link from 'next/link';
import { FiSearch, FiTrendingUp, FiShield } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';

// Enhanced Responsive Utilities
import { 
  useResponsiveState, 
  useResponsiveValue,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsTouch,
  useContainerQuery,
  usePrefersReducedMotion,
  usePrefersDarkMode
} from '../../utils/responsive';

const HeroSection: React.FC = () => {
  const { device, breakpoint, orientation, isTouch, width, height } = useResponsiveState();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersDarkMode = usePrefersDarkMode();
  
  // Container query for adaptive layout
  const [containerRef, containerQueries] = useContainerQuery({
    'narrow': '(max-width: 500px)',
    'medium': '(min-width: 501px) and (max-width: 900px)',
    'wide': '(min-width: 901px)',
    'ultra-wide': '(min-width: 1400px)'
  });

  // Responsive typography values
  const heroTypography = useResponsiveValue({
    xs: {
      title: 'text-3xl sm:text-4xl',
      subtitle: 'text-lg',
      badge: 'text-xs px-3 py-1.5',
      feature: 'text-sm'
    },
    sm: {
      title: 'text-4xl sm:text-5xl',
      subtitle: 'text-xl',
      badge: 'text-sm px-4 py-2',
      feature: 'text-sm'
    },
    md: {
      title: 'text-5xl lg:text-6xl',
      subtitle: 'text-xl sm:text-2xl',
      badge: 'text-sm px-4 py-2',
      feature: 'text-base'
    },
    lg: {
      title: 'text-6xl xl:text-7xl',
      subtitle: 'text-2xl',
      badge: 'text-sm px-4 py-2',
      feature: 'text-base'
    },
    xl: {
      title: 'text-7xl',
      subtitle: 'text-2xl xl:text-3xl',
      badge: 'text-sm px-4 py-2',
      feature: 'text-lg'
    }
  });

  // Responsive spacing and layout
  const layoutConfig = useResponsiveValue({
    xs: {
      padding: 'px-4 py-16',
      contentSpacing: 'space-y-6',
      buttonLayout: 'flex-col space-y-4',
      featureGrid: 'grid-cols-1 gap-6',
      iconSize: 'h-6 w-6',
      featureIconSize: 'h-6 w-6'
    },
    sm: {
      padding: 'px-6 py-20',
      contentSpacing: 'space-y-8',
      buttonLayout: 'flex-col sm:flex-row gap-4',
      featureGrid: 'grid-cols-1 gap-8',
      iconSize: 'h-5 w-5',
      featureIconSize: 'h-7 w-7'
    },
    md: {
      padding: 'px-6 lg:px-8 py-24',
      contentSpacing: 'space-y-10',
      buttonLayout: 'flex-col sm:flex-row gap-4',
      featureGrid: 'grid-cols-1 md:grid-cols-3 gap-8',
      iconSize: 'h-5 w-5',
      featureIconSize: 'h-8 w-8'
    },
    lg: {
      padding: 'px-8 py-32',
      contentSpacing: 'space-y-12',
      buttonLayout: 'flex-row gap-6',
      featureGrid: 'grid-cols-1 md:grid-cols-3 gap-10',
      iconSize: 'h-5 w-5',
      featureIconSize: 'h-8 w-8'
    },
    xl: {
      padding: 'px-8 py-40',
      contentSpacing: 'space-y-16',
      buttonLayout: 'flex-row gap-8',
      featureGrid: 'grid-cols-1 md:grid-cols-3 gap-12',
      iconSize: 'h-5 w-5',
      featureIconSize: 'h-10 w-10'
    }
  });

  // Responsive minimum height
  const minHeight = useResponsiveValue({
    xs: 'min-h-screen',
    sm: 'min-h-screen',
    md: 'min-h-screen',
    lg: 'min-h-[100dvh]',
    xl: 'min-h-[100dvh]'
  });

  // Responsive content max width
  const contentMaxWidth = useResponsiveValue({
    xs: 'max-w-sm mx-auto',
    sm: 'max-w-lg mx-auto',
    md: 'max-w-2xl mx-auto',
    lg: 'max-w-4xl mx-auto',
    xl: 'max-w-5xl mx-auto'
  });

  // Dynamic animation preferences
  const animationClasses = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        background: '',
        pulse: '',
        bounce: '',
        glow: ''
      };
    }
    
    return {
      background: 'animate-pulse-slow',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      glow: 'shadow-glow'
    };
  }, [prefersReducedMotion]);

  // Responsive background pattern
  const backgroundPattern = useResponsiveValue({
    xs: {
      circles: [
        { size: 'w-48 h-48', position: 'top-0 left-0', delay: '' },
        { size: 'w-48 h-48', position: 'bottom-0 right-0', delay: 'animation-delay-2000' }
      ]
    },
    sm: {
      circles: [
        { size: 'w-64 h-64', position: 'top-0 left-0', delay: '' },
        { size: 'w-64 h-64', position: 'top-0 right-0', delay: 'animation-delay-2000' },
        { size: 'w-48 h-48', position: 'bottom-0 left-1/2 transform -translate-x-1/2', delay: 'animation-delay-4000' }
      ]
    },
    md: {
      circles: [
        { size: 'w-72 h-72', position: 'top-0 left-0', delay: '' },
        { size: 'w-72 h-72', position: 'top-0 right-0', delay: 'animation-delay-2000' },
        { size: 'w-72 h-72', position: 'bottom-0 left-1/2 transform -translate-x-1/2', delay: 'animation-delay-4000' }
      ]
    },
    lg: {
      circles: [
        { size: 'w-80 h-80', position: 'top-0 left-0', delay: '' },
        { size: 'w-80 h-80', position: 'top-0 right-0', delay: 'animation-delay-2000' },
        { size: 'w-80 h-80', position: 'bottom-0 left-1/2 transform -translate-x-1/2', delay: 'animation-delay-4000' }
      ]
    },
    xl: {
      circles: [
        { size: 'w-96 h-96', position: 'top-0 left-0', delay: '' },
        { size: 'w-96 h-96', position: 'top-0 right-0', delay: 'animation-delay-2000' },
        { size: 'w-96 h-96', position: 'bottom-0 left-1/2 transform -translate-x-1/2', delay: 'animation-delay-4000' },
        { size: 'w-64 h-64', position: 'top-1/2 left-0 transform -translate-y-1/2', delay: 'animation-delay-6000' }
      ]
    }
  });

  // Layout calculations based on container queries
  const adaptiveLayout = useMemo(() => {
    if (!layoutConfig) return layoutConfig;
    
    if (containerQueries['ultra-wide']) {
      return {
        ...layoutConfig,
        featureGrid: 'grid-cols-1 md:grid-cols-3 gap-12',
        buttonLayout: 'flex-row gap-8'
      };
    } else if (containerQueries.wide) {
      return {
        ...layoutConfig,
        featureGrid: 'grid-cols-1 md:grid-cols-3 gap-10'
      };
    } else if (containerQueries.medium) {
      return {
        ...layoutConfig,
        featureGrid: 'grid-cols-1 gap-8',
        buttonLayout: 'flex-col sm:flex-row gap-4'
      };
    } else if (containerQueries.narrow) {
      return {
        ...layoutConfig,
        featureGrid: 'grid-cols-1 gap-6',
        buttonLayout: 'flex-col space-y-4',
        contentSpacing: 'space-y-6'
      };
    }
    
    return layoutConfig;
  }, [layoutConfig, containerQueries]);

  return (
    <section 
      ref={containerRef}
      className={`relative ${minHeight} flex items-center justify-center bg-gradient-to-br from-primary via-primary-600 to-secondary overflow-hidden`}
    >
      {/* Responsive Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {backgroundPattern?.circles.map((circle, index) => (
          <div 
            key={index}
            className={`absolute ${circle.position} ${circle.size} bg-white rounded-full mix-blend-multiply filter blur-xl ${animationClasses.background} ${circle.delay}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto ${adaptiveLayout?.padding} text-center`}>
        <div className={contentMaxWidth}>
          <div className={adaptiveLayout?.contentSpacing}>
            {/* Badge */}
            <div className={`inline-flex items-center ${heroTypography?.badge} bg-white/20 backdrop-blur-sm rounded-full text-white font-medium`}>
              <FiShield className={`mr-2 ${adaptiveLayout?.iconSize}`} />
              <span className={isMobile ? 'hidden sm:inline' : 'inline'}>
                Kenya's Most Trusted Betting Comparison Platform
              </span>
              <span className={isMobile ? 'sm:hidden' : 'hidden'}>
                Trusted Betting Comparison
              </span>
            </div>

            {/* Main Heading with Responsive Typography */}
            <h1 className={`${heroTypography?.title} font-heading font-bold text-white leading-tight`}>
              <span className={isMobile ? 'block' : 'inline'}>Compare Kenya's</span>{' '}
              <span className={isMobile ? 'block' : 'inline'}>Best</span>{' '}
              <span className="text-gradient bg-gradient-to-r from-secondary-200 to-warning-200 bg-clip-text text-transparent">
                Betting Sites
              </span>
            </h1>

            {/* Subtitle with Responsive Line Breaks */}
            <p className={`${heroTypography?.subtitle} text-primary-100 max-w-3xl mx-auto leading-relaxed`}>
              <span className="block">Find the perfect bookmaker for you.</span>
              <span className={`${isMobile ? 'block mt-2' : 'inline'} ${isMobile ? '' : 'ml-1'}`}>
                Compare odds, bonuses, payment methods, and more.
              </span>
              <span className={`${isMobile ? 'block mt-2' : 'block mt-1'}`}>
                Make informed betting decisions with our expert reviews.
              </span>
            </p>

            {/* CTA Buttons with Responsive Layout */}
            <div className={`flex ${adaptiveLayout?.buttonLayout} justify-center`}>
              <Link
                href="/compare"
                onClick={() => trackButtonClick('compare_now_hero', 'hero')}
                className={`btn btn-secondary btn-lg inline-flex items-center ${animationClasses.glow} touch-target`}
              >
                <FiTrendingUp className={`mr-2 ${adaptiveLayout?.iconSize}`} />
                Compare Now
              </Link>
              <Link
                href="/reviews"
                onClick={() => trackButtonClick('read_reviews_hero', 'hero')}
                className="btn btn-outline btn-lg inline-flex items-center text-white border-white hover:bg-white hover:text-primary touch-target"
              >
                <FiSearch className={`mr-2 ${adaptiveLayout?.iconSize}`} />
                <span className={isMobile ? 'hidden sm:inline' : 'inline'}>Read Reviews</span>
                <span className={isMobile ? 'sm:hidden' : 'hidden'}>Reviews</span>
              </Link>
            </div>

            {/* Key Features with Responsive Grid */}
            <div className={`grid ${adaptiveLayout?.featureGrid} text-white`}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <FiTrendingUp className={adaptiveLayout?.featureIconSize} />
                </div>
                <h3 className={`${heroTypography?.feature} font-semibold mb-2`}>Best Odds</h3>
                <p className="text-primary-100 text-sm text-center max-w-xs">
                  Compare odds from all major bookmakers to maximize your winnings
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <FiShield className={adaptiveLayout?.featureIconSize} />
                </div>
                <h3 className={`${heroTypography?.feature} font-semibold mb-2`}>Trusted Reviews</h3>
                <p className="text-primary-100 text-sm text-center max-w-xs">
                  Honest, unbiased reviews from our expert team and real users
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <FiSearch className={adaptiveLayout?.featureIconSize} />
                </div>
                <h3 className={`${heroTypography?.feature} font-semibold mb-2`}>Easy Comparison</h3>
                <p className="text-primary-100 text-sm text-center max-w-xs">
                  Side-by-side comparison of features, bonuses, and payment methods
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with Animation Preference */}
      {!isMobile && (
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${animationClasses.bounce}`}>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className={`w-1 h-3 bg-white rounded-full mt-2 ${animationClasses.pulse}`}></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection; 