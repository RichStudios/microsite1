
import React from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

interface BookmakerCardProps {
  bookmaker: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    bonus: string;
    features: string[];
    pros: string[];
    minDeposit: string;
    withdrawalTime: string;
    mobileApp: boolean;
    mpesaSupport: boolean;
    slug: string;
    affiliateUrl?: string;
  };
  priority?: boolean;
  className?: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const FeatureBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
    {children}
  </span>
);

const BookmakerCard: React.FC<BookmakerCardProps> = ({ bookmaker, priority = false, className = '' }) => {
  const handleAffiliateClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        event_category: 'Bookmaker',
        event_label: bookmaker.name,
        value: 1
      });
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <OptimizedImage
                src={bookmaker.logo}
                alt={`${bookmaker.name} logo`}
                width={48}
                height={48}
                className="object-contain"
                priority={priority}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{bookmaker.name}</h3>
              <div className="flex items-center gap-2">
                <StarRating rating={bookmaker.rating} />
                <span className="text-sm text-gray-600 font-medium">({bookmaker.rating})</span>
              </div>
            </div>
          </div>
          {priority && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
              Top Rated
            </span>
          )}
        </div>

        {/* Bonus Highlight */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <p className="text-orange-800 font-semibold text-sm mb-1">Welcome Bonus</p>
          <p className="text-orange-700 font-bold text-lg">{bookmaker.bonus}</p>
        </div>

        {/* Key Features */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Min Deposit:</span>
            <span className="font-semibold text-gray-900">{bookmaker.minDeposit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Withdrawal:</span>
            <span className="font-semibold text-gray-900">{bookmaker.withdrawalTime}</span>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {bookmaker.mpesaSupport && (
            <FeatureBadge>M-Pesa</FeatureBadge>
          )}
          {bookmaker.mobileApp && (
            <FeatureBadge>Mobile App</FeatureBadge>
          )}
          {bookmaker.features.slice(0, 2).map((feature, index) => (
            <FeatureBadge key={index}>{feature}</FeatureBadge>
          ))}
        </div>

        {/* Top Pros */}
        <div className="space-y-2 mb-6">
          {bookmaker.pros.slice(0, 3).map((pro, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{pro}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 pt-0 space-y-3">
        {bookmaker.affiliateUrl && (
          <a
            href={bookmaker.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAffiliateClick}
            className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
          >
            Visit Site
          </a>
        )}
        <Link
          href={`/review/${bookmaker.slug}`}
          className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          Read Review
        </Link>
      </div>
    </div>
  );
};

export default BookmakerCard;
