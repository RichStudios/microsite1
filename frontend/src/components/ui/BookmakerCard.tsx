import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiCheck, FiX, FiExternalLink, FiInfo, FiGift, FiSmartphone } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';
import { handleImageError } from '../../utils/imageUtils';

interface BookmakerCardProps {
  id: number;
  name: string;
  logo: string;
  rating: number;
  odds?: number;
  bonus: string;
  bonusType?: string;
  mpesa: boolean;
  liveStreaming?: boolean;
  mobileApp?: boolean;
  features?: string[];
  affiliateLink: string;
  slug: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'list' | 'compact';
  showFeatures?: boolean;
  ctaText?: string;
}

const BookmakerCard: React.FC<BookmakerCardProps> = ({
  id,
  name,
  logo,
  rating,
  odds,
  bonus,
  bonusType,
  mpesa,
  liveStreaming,
  mobileApp,
  features = [],
  affiliateLink,
  slug,
  className = '',
  size = 'md',
  variant = 'card',
  showFeatures = true,
  ctaText = 'Visit Site'
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const handleAffiliateClick = () => {
    trackButtonClick('affiliate_click', 'bookmaker_card');
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const handleCardPress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageErrorEvent = (e: any) => {
    setImageError(true);
    handleImageError(e, name, 'bookmaker');
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  const getLogoSize = () => {
    switch (size) {
      case 'sm':
        return { width: 32, height: 32, className: 'h-8 w-8' };
      case 'lg':
        return { width: 64, height: 64, className: 'h-16 w-16' };
      default:
        return { width: 48, height: 48, className: 'h-12 w-12' };
    }
  };

  const logoSize = getLogoSize();

  const renderOptimizedImage = (additionalClasses = '') => {
    return (
      <div className={`${logoSize.className} relative flex-shrink-0 ${additionalClasses}`}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-100 rounded animate-pulse" />
        )}
        {!imageError ? (
          <Image
            src={logo}
            alt={name}
            width={logoSize.width}
            height={logoSize.height}
            className={`${logoSize.className} object-contain rounded transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageErrorEvent}
            loading="lazy"
            sizes={`${logoSize.width}px`}
            quality={85}
          />
        ) : (
          <div className={`${logoSize.className} bg-primary/10 rounded flex items-center justify-center`}>
            <span className="text-primary font-bold text-sm">
              {name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <div 
        className={`
          bg-white border border-gray-200 rounded-lg transition-all duration-200 touch-target
          ${isPressed ? 'transform scale-95 shadow-sm' : 'hover:shadow-md hover:border-primary/20'}
          ${className}
        `}
        onTouchStart={handleCardPress}
        onMouseDown={handleCardPress}
      >
        <div className={`${getSizeClasses()} flex items-center justify-between`}>
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {renderOptimizedImage()}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              <div className="flex items-center space-x-1 mb-1">
                {renderStars(rating)}
                <span className="text-sm text-gray-600 ml-1">
                  {rating}/5
                </span>
              </div>
              {bonus && (
                <p className="text-sm text-primary font-medium truncate">
                  {bonus}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-3">
            <Link
              href={`/review/${slug}`}
              onClick={() => trackButtonClick('view_review', 'bookmaker_card')}
              className="btn btn-outline btn-sm touch-target"
            >
              <FiInfo className="h-4 w-4" />
            </Link>
            <button
              onClick={handleAffiliateClick}
              className="btn btn-primary btn-sm touch-target"
              data-analytics-cta="visit-site"
              data-analytics-bookmaker={name}
            >
              {ctaText}
              <FiExternalLink className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className={`
          bg-white border border-gray-200 rounded-lg transition-all duration-200 touch-target
          ${isPressed ? 'transform scale-95 shadow-sm' : 'hover:shadow-md hover:border-primary/20'}
          ${className}
        `}
        onTouchStart={handleCardPress}
        onMouseDown={handleCardPress}
      >
        <div className="p-3 text-center">
          {renderOptimizedImage('mb-2 mx-auto')}
          <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">{name}</h3>
          <div className="flex items-center justify-center space-x-1 mb-2">
            {renderStars(rating)}
          </div>
          <button
            onClick={handleAffiliateClick}
            className="btn btn-primary btn-xs w-full touch-target"
            data-analytics-cta="visit-site"
            data-analytics-bookmaker={name}
          >
            {ctaText}
          </button>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div 
      className={`
        bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 touch-target
        ${isPressed ? 'transform scale-95 shadow-sm' : 'hover:shadow-md hover:border-primary/20'}
        ${className}
      `}
      onTouchStart={handleCardPress}
      onMouseDown={handleCardPress}
    >
      <div className={getSizeClasses()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {renderOptimizedImage()}
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <div className="flex items-center space-x-1">
                {renderStars(rating)}
                <span className="text-sm text-gray-600 ml-1">
                  {rating}/5
                </span>
              </div>
            </div>
          </div>
          
          {bonusType && (
            <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              <FiGift className="inline h-3 w-3 mr-1" />
              {bonusType}
            </div>
          )}
        </div>

        {/* Bonus */}
        {bonus && (
          <div className="mb-4 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-lg">
            <p className="text-primary font-semibold text-center">
              {bonus}
            </p>
          </div>
        )}

        {/* Features */}
        {showFeatures && (
          <div className="mb-4 space-y-2">
            {odds && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Odds Rating</span>
                <span className="font-medium">{odds}/5</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">M-Pesa Support</span>
              {mpesa ? (
                <FiCheck className="h-4 w-4 text-success" />
              ) : (
                <FiX className="h-4 w-4 text-error" />
              )}
            </div>
            
            {liveStreaming !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Live Streaming</span>
                {liveStreaming ? (
                  <FiCheck className="h-4 w-4 text-success" />
                ) : (
                  <FiX className="h-4 w-4 text-error" />
                )}
              </div>
            )}
            
            {mobileApp !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Mobile App</span>
                {mobileApp ? (
                  <div className="flex items-center text-success">
                    <FiSmartphone className="h-4 w-4 mr-1" />
                    <FiCheck className="h-4 w-4" />
                  </div>
                ) : (
                  <FiX className="h-4 w-4 text-error" />
                )}
              </div>
            )}
            
            {features.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {features.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            href={`/review/${slug}`}
            onClick={() => trackButtonClick('view_review', 'bookmaker_card')}
            className="btn btn-outline flex-1 touch-target"
          >
            <FiInfo className="h-4 w-4 mr-2" />
            Review
          </Link>
          <button
            onClick={handleAffiliateClick}
            className="btn btn-primary flex-1 touch-target"
            data-analytics-cta="visit-site"
            data-analytics-bookmaker={name}
          >
            {ctaText}
            <FiExternalLink className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmakerCard; 