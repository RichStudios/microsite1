import React, { useMemo } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';

// Components
import BookmakerCard from '../ui/BookmakerCard';
import SwipeableTable from '../ui/SwipeableTable';

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
  useResponsiveGrid
} from '../../utils/responsive';

const FeaturedBookmakers: React.FC = () => {
  const { device, breakpoint, orientation, isTouch } = useResponsiveState();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  // Container query for adaptive layout
  const [containerRef, containerQueries] = useContainerQuery({
    'small': '(max-width: 600px)',
    'medium': '(min-width: 601px) and (max-width: 900px)',
    'large': '(min-width: 901px)',
    'wide': '(min-width: 1200px)'
  });

  // Responsive grid calculations
  const { columns: gridColumns } = useResponsiveGrid(280, 24, 1, 4);

  // Responsive values for layout configuration
  const layoutConfig = useResponsiveValue({
    xs: { cards: 1, showQuickCompare: true, showCompactGrid: true },
    sm: { cards: 1, showQuickCompare: true, showCompactGrid: true },
    md: { cards: 2, showQuickCompare: false, showCompactGrid: false },
    lg: { cards: 3, showQuickCompare: false, showCompactGrid: false },
    xl: { cards: 3, showQuickCompare: false, showCompactGrid: false },
    xxl: { cards: 4, showQuickCompare: false, showCompactGrid: false }
  });

  // Responsive card size
  const cardSize = useResponsiveValue({
    xs: 'sm' as const,
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'md' as const,
    xl: 'md' as const,
    xxl: 'lg' as const
  });

  // Responsive section padding
  const sectionPadding = useResponsiveValue({
    xs: 'py-8',
    sm: 'py-10',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20'
  });

  // Featured bookmakers data
  const featuredBookmakers = [
    {
      id: 1,
      name: 'Betway',
      logo: '/images/logos/betway-logo.png',
      rating: 4.5,
      odds: 4.2,
      bonus: 'Up to KES 1,000 Welcome Bonus',
      bonusType: 'Welcome Bonus',
      mpesa: true,
      liveStreaming: true,
      mobileApp: true,
      features: ['Live Betting', 'Cash Out', 'Virtual Sports'],
      affiliateLink: 'https://betway.com?ref=betcompare',
      slug: 'betway'
    },
    {
      id: 2,
      name: 'MelBet',
      logo: '/images/logos/melbet-logo.png',
      rating: 4.3,
      odds: 4.0,
      bonus: 'Up to KES 20,000 First Deposit',
      bonusType: '100% Match',
      mpesa: true,
      liveStreaming: false,
      mobileApp: true,
      features: ['Multiple Payment Options', 'Live Casino', 'Esports'],
      affiliateLink: 'https://melbet.com?ref=betcompare',
      slug: 'melbet'
    },
    {
      id: 3,
      name: '1xBet',
      logo: '/images/logos/1xbet-logo.png',
      rating: 4.1,
      odds: 3.8,
      bonus: 'Up to KES 15,000 Bonus',
      bonusType: 'First Deposit',
      mpesa: true,
      liveStreaming: true,
      mobileApp: false,
      features: ['Wide Sports Coverage', 'High Odds', 'Toto Games'],
      affiliateLink: 'https://1xbet.com?ref=betcompare',
      slug: '1xbet'
    },
    {
      id: 4,
      name: 'Betwinner',
      logo: '/images/logos/betwinner-logo.png',
      rating: 4.0,
      odds: 3.9,
      bonus: 'Up to KES 12,000 Bonus',
      bonusType: 'Welcome Offer',
      mpesa: true,
      liveStreaming: true,
      mobileApp: true,
      features: ['Quick Withdrawals', 'Live Streaming', 'Multi-Language'],
      affiliateLink: 'https://betwinner.com?ref=betcompare',
      slug: 'betwinner'
    },
    {
      id: 5,
      name: 'SportPesa',
      logo: '/images/logos/sportpesa-logo.png',
      rating: 3.9,
      odds: 3.7,
      bonus: 'Up to KES 5,000 Free Bet',
      bonusType: 'Free Bet',
      mpesa: true,
      liveStreaming: false,
      mobileApp: true,
      features: ['Local Support', 'Jackpot Games', 'Simple Interface'],
      affiliateLink: 'https://sportpesa.com?ref=betcompare',
      slug: 'sportpesa'
    },
    {
      id: 6,
      name: 'Betika',
      logo: '/images/logos/betika-logo.png',
      rating: 3.8,
      odds: 3.6,
      bonus: 'Up to KES 3,000 Bonus',
      bonusType: 'First Bet',
      mpesa: true,
      liveStreaming: false,
      mobileApp: true,
      features: ['SMS Betting', 'Local Market Focus', 'Easy Registration'],
      affiliateLink: 'https://betika.com?ref=betcompare',
      slug: 'betika'
    }
  ];

  // Memoized layout calculations based on responsive state
  const layoutSettings = useMemo(() => {
    if (!layoutConfig) return { cards: 1, showQuickCompare: true, showCompactGrid: true };
    
    // Override with container query results if available
    if (containerQueries.wide) {
      return { cards: 4, showQuickCompare: false, showCompactGrid: false };
    } else if (containerQueries.large) {
      return { cards: 3, showQuickCompare: false, showCompactGrid: false };
    } else if (containerQueries.medium) {
      return { cards: 2, showQuickCompare: false, showCompactGrid: false };
    } else if (containerQueries.small) {
      return { cards: 1, showQuickCompare: true, showCompactGrid: true };
    }
    
    return layoutConfig;
  }, [layoutConfig, containerQueries]);

  // Dynamic grid class generation
  const gridClasses = useMemo(() => {
    const cols = layoutSettings.cards;
    return `grid gap-6 ${
      cols === 1 ? 'grid-cols-1' :
      cols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
      cols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`;
  }, [layoutSettings.cards]);

  return (
    <section 
      ref={containerRef}
      className={`${sectionPadding || 'py-12'} bg-gradient-to-b from-white to-gray-50`}
    >
      <div className="container">
        {/* Section Header with Responsive Typography */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FiTrendingUp className="h-6 w-6 text-primary mr-2" />
            <h2 className={`font-bold text-gray-900 ${
              useResponsiveValue({
                xs: 'text-xl',
                sm: 'text-2xl',
                md: 'text-3xl',
                lg: 'text-3xl',
                xl: 'text-4xl'
              }) || 'text-2xl md:text-3xl'
            }`}>
              Top Rated Bookmakers in Kenya
            </h2>
          </div>
          <p className={`text-gray-600 max-w-2xl mx-auto ${
            useResponsiveValue({
              xs: 'text-sm',
              sm: 'text-base',
              md: 'text-base',
              lg: 'text-lg'
            }) || 'text-base'
          }`}>
            Discover the best betting sites in Kenya, carefully reviewed and ranked 
            based on bonuses, odds, payment options, and user experience.
          </p>
        </div>

        {/* Adaptive Layout Based on Container Queries and Device Type */}
        
        {/* Mobile Swipeable Cards - Show only on touch devices or small containers */}
        {(isTouch && isMobile) || containerQueries.small ? (
          <div className="mb-8">
            <SwipeableTable className="px-2">
              <div className="flex space-x-4 pb-4">
                {featuredBookmakers.map((bookmaker) => (
                  <div key={bookmaker.id} className="flex-shrink-0 w-72">
                    <BookmakerCard
                      {...bookmaker}
                      size={cardSize || 'md'}
                      variant="card"
                      showFeatures={!isMobile}
                      ctaText="Visit Site"
                    />
                  </div>
                ))}
              </div>
            </SwipeableTable>
          </div>
        ) : (
          /* Desktop/Tablet Grid with Dynamic Columns */
          <div className="mb-8">
            <div className={gridClasses}>
              {featuredBookmakers.slice(0, layoutSettings.cards * 2).map((bookmaker) => (
                <BookmakerCard
                  key={bookmaker.id}
                  {...bookmaker}
                  size={cardSize || 'md'}
                  variant="card"
                  showFeatures={!isMobile}
                  ctaText="Visit Site"
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Compare List - Adaptive visibility */}
        {layoutSettings.showQuickCompare && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <FiTrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Quick Compare
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isTouch ? 'Tap to visit or compare' : 'Click to visit or compare'}
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {featuredBookmakers.slice(0, 4).map((bookmaker) => (
                  <BookmakerCard
                    key={`list-${bookmaker.id}`}
                    {...bookmaker}
                    variant="list"
                    size="sm"
                    showFeatures={false}
                    ctaText="Visit"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compact Grid for Touch Devices */}
        {layoutSettings.showCompactGrid && isTouch && (
          <div className="mb-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                All Bookmakers
              </h3>
              <p className="text-sm text-gray-600">
                {orientation === 'portrait' ? 'Tap to visit or swipe to browse' : 'Swipe horizontally to browse all options'}
              </p>
            </div>
            <div className={`grid gap-3 ${
              orientation === 'portrait' ? 'grid-cols-2' : 'grid-cols-4'
            }`}>
              {featuredBookmakers.map((bookmaker) => (
                <BookmakerCard
                  key={`compact-${bookmaker.id}`}
                  {...bookmaker}
                  variant="compact"
                  size="sm"
                  showFeatures={false}
                  ctaText="Visit"
                />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action - Responsive positioning */}
        <div className={`text-center ${
          useResponsiveValue({
            xs: 'mt-8',
            sm: 'mt-10',
            md: 'mt-12',
            lg: 'mt-16'
          }) || 'mt-12'
        }`}>
          <Link
            href="/compare"
            onClick={() => trackButtonClick('view_all_bookmakers', 'home_featured')}
            className={`btn btn-primary inline-flex items-center ${
              useResponsiveValue({
                xs: 'btn-md w-full',
                sm: 'btn-lg w-auto',
                md: 'btn-lg w-auto',
                lg: 'btn-xl w-auto'
              }) || 'btn-lg'
            }`}
          >
            View All Bookmakers
            <FiArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          {/* Additional info for different devices */}
          <p className={`text-gray-600 mt-4 ${
            useResponsiveValue({
              xs: 'text-xs',
              sm: 'text-sm',
              md: 'text-sm'
            }) || 'text-sm'
          }`}>
            {device === 'mobile' && isTouch ? 
              `Compare ${featuredBookmakers.length} bookmakers with detailed reviews` :
              device === 'tablet' ?
              `Discover comprehensive reviews and comparisons of Kenya's top ${featuredBookmakers.length} betting sites` :
              `Access detailed comparisons, expert reviews, and exclusive bonuses from all ${featuredBookmakers.length} featured bookmakers`
            }
          </p>
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p><strong>Responsive Debug:</strong></p>
            <p>Device: {device} | Breakpoint: {breakpoint} | Orientation: {orientation}</p>
            <p>Touch: {isTouch ? 'Yes' : 'No'} | Grid Columns: {gridColumns}</p>
            <p>Container: {Object.entries(containerQueries).filter(([, active]) => active).map(([name]) => name).join(', ') || 'None'}</p>
            <p>Layout: Cards={layoutSettings.cards}, QuickCompare={layoutSettings.showQuickCompare ? 'Yes' : 'No'}, CompactGrid={layoutSettings.showCompactGrid ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBookmakers; 