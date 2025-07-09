import React from 'react';
import Link from 'next/link';
import { FiCheck, FiX, FiArrowRight, FiStar } from 'react-icons/fi';

// Components
import SwipeableTable from '../ui/SwipeableTable';

// Utils
import { trackButtonClick } from '../../utils/analytics';
import { handleImageError } from '../../utils/imageUtils';

const ComparisonPreview: React.FC = () => {
  const sampleBookmakers = [
    {
      id: 1,
      name: 'Betway',
      logo: '/images/logos/betway-logo.png',
      rating: 4.5,
      odds: 4.2,
      bonus: 'Up to KES 1,000',
      bonusType: 'Welcome Bonus',
      mpesa: true,
      liveStreaming: true,
      mobileApp: true,
      affiliateLink: 'https://betway.com?ref=betcompare',
      slug: 'betway'
    },
    {
      id: 2,
      name: 'MelBet',
      logo: '/images/logos/melbet-logo.png',
      rating: 4.3,
      odds: 4.0,
      bonus: 'Up to KES 20,000',
      bonusType: '100% Match',
      mpesa: true,
      liveStreaming: false,
      mobileApp: true,
      affiliateLink: 'https://melbet.com?ref=betcompare',
      slug: 'melbet'
    },
    {
      id: 3,
      name: '1xBet',
      logo: '/images/logos/1xbet-logo.png',
      rating: 4.1,
      odds: 3.8,
      bonus: 'Up to KES 15,000',
      bonusType: 'First Deposit',
      mpesa: true,
      liveStreaming: true,
      mobileApp: false,
      affiliateLink: 'https://1xbet.com?ref=betcompare',
      slug: '1xbet'
    },
  ];

  const features = [
    { key: 'odds', label: 'Odds Rating', type: 'rating' },
    { key: 'bonus', label: 'Welcome Bonus', type: 'text' },
    { key: 'mpesa', label: 'M-Pesa', type: 'boolean' },
    { key: 'liveStreaming', label: 'Live Streaming', type: 'boolean' },
    { key: 'mobileApp', label: 'Mobile App', type: 'boolean' },
  ];

  const renderFeatureValue = (bookmaker: any, feature: any) => {
    const value = bookmaker[feature.key];
    
    if (feature.type === 'boolean') {
      return value ? (
        <FiCheck className="h-5 w-5 text-success mx-auto" />
      ) : (
        <FiX className="h-5 w-5 text-error mx-auto" />
      );
    }
    
    if (feature.type === 'rating') {
      return (
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium">{value}/5</span>
        </div>
      );
    }
    
    return <span className="text-sm">{value}</span>;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="h-3 w-3 text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar key="half" className="h-3 w-3 text-warning fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
      );
    }

    return stars;
  };

  const handleAffiliateClick = (bookmaker: any) => {
    trackButtonClick('affiliate_click', 'comparison_preview');
    window.open(bookmaker.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      {/* Mobile Card View */}
      <div className="block md:hidden">
        <SwipeableTable className="p-4">
          <div className="mobile-comparison-cards">
            {sampleBookmakers.map((bookmaker) => (
              <div key={bookmaker.id} className="mobile-comparison-card">
                <div className="mobile-comparison-card-header">
                  <img
                    src={bookmaker.logo}
                    alt={bookmaker.name}
                    className="mobile-comparison-card-logo"
                    onError={(e) => handleImageError(e, bookmaker.name, 'bookmaker')}
                  />
                  <div>
                    <h3 className="mobile-comparison-card-title">{bookmaker.name}</h3>
                    <div className="mobile-comparison-card-rating">
                      <div className="flex items-center space-x-1">
                        {renderStars(bookmaker.rating)}
                        <span className="ml-1">{bookmaker.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mobile-comparison-card-features">
                  <div className="mobile-comparison-feature">
                    <span className="mobile-comparison-feature-label">Bonus</span>
                    <span className="mobile-comparison-feature-value">{bookmaker.bonus}</span>
                  </div>
                  <div className="mobile-comparison-feature">
                    <span className="mobile-comparison-feature-label">Odds Rating</span>
                    <span className="mobile-comparison-feature-value">{bookmaker.odds}/5</span>
                  </div>
                  <div className="mobile-comparison-feature">
                    <span className="mobile-comparison-feature-label">M-Pesa</span>
                    <span className="mobile-comparison-feature-value">
                      {bookmaker.mpesa ? (
                        <FiCheck className="h-4 w-4 text-success" />
                      ) : (
                        <FiX className="h-4 w-4 text-error" />
                      )}
                    </span>
                  </div>
                  <div className="mobile-comparison-feature">
                    <span className="mobile-comparison-feature-label">Live Stream</span>
                    <span className="mobile-comparison-feature-value">
                      {bookmaker.liveStreaming ? (
                        <FiCheck className="h-4 w-4 text-success" />
                      ) : (
                        <FiX className="h-4 w-4 text-error" />
                      )}
                    </span>
                  </div>
                  <div className="mobile-comparison-feature">
                    <span className="mobile-comparison-feature-label">Mobile App</span>
                    <span className="mobile-comparison-feature-value">
                      {bookmaker.mobileApp ? (
                        <FiCheck className="h-4 w-4 text-success" />
                      ) : (
                        <FiX className="h-4 w-4 text-error" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="mobile-comparison-card-actions">
                  <button
                    onClick={() => handleAffiliateClick(bookmaker)}
                    className="mobile-comparison-card-button mobile-comparison-card-button-primary"
                    data-analytics-cta="visit-site"
                    data-analytics-bookmaker={bookmaker.name}
                  >
                    Visit Site
                  </button>
                  <Link
                    href={`/review/${bookmaker.slug}`}
                    onClick={() => trackButtonClick('view_review', 'comparison_preview')}
                    className="mobile-comparison-card-button mobile-comparison-card-button-secondary"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </SwipeableTable>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block p-6">
        <SwipeableTable showArrows={false}>
          <table className="mobile-comparison-table w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Bookmaker</th>
                {features.map((feature) => (
                  <th key={feature.key} className="text-center py-3 px-4 font-semibold">
                    {feature.label}
                  </th>
                ))}
                <th className="text-center py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleBookmakers.map((bookmaker) => (
                <tr key={bookmaker.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={bookmaker.logo}
                        alt={bookmaker.name}
                        className="h-10 w-10 object-contain"
                        onError={(e) => handleImageError(e, bookmaker.name, 'bookmaker')}
                      />
                      <div>
                        <h3 className="font-semibold">{bookmaker.name}</h3>
                        <div className="flex items-center space-x-1">
                          {renderStars(bookmaker.rating)}
                          <span className="text-sm text-gray-600 ml-1">
                            {bookmaker.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {features.map((feature) => (
                    <td key={feature.key} className="py-4 px-4 text-center">
                      {renderFeatureValue(bookmaker, feature)}
                    </td>
                  ))}
                  <td className="py-4 px-4 text-center">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handleAffiliateClick(bookmaker)}
                        className="btn btn-secondary btn-sm touch-target"
                        data-analytics-cta="visit-site"
                        data-analytics-bookmaker={bookmaker.name}
                      >
                        Visit Site
                      </button>
                      <Link
                        href={`/review/${bookmaker.slug}`}
                        onClick={() => trackButtonClick('view_review', 'comparison_preview')}
                        className="btn btn-outline btn-sm touch-target"
                      >
                        Review
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SwipeableTable>
      </div>

      {/* Call to Action */}
      <div className="p-6 bg-gray-50 border-t">
        <div className="text-center">
          <Link
            href="/compare"
            onClick={() => trackButtonClick('full_comparison', 'comparison_preview')}
            className="btn btn-secondary btn-lg inline-flex items-center touch-target"
          >
            Compare All Bookmakers
            <FiArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPreview; 