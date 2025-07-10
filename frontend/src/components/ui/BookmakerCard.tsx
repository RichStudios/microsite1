
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BookmakerCardProps {
  bookmaker: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    bonus: string;
    features: string[];
    pros: string[];
    cons: string[];
    affiliate_link: string;
    slug: string;
    min_deposit?: string;
    payout_speed?: string;
    license?: string;
    established?: string;
  };
  featured?: boolean;
  compact?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const BookmakerCard: React.FC<BookmakerCardProps> = ({ 
  bookmaker, 
  featured = false, 
  compact = false 
}) => {
  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src={bookmaker.logo}
                alt={`${bookmaker.name} logo`}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-base text-gray-900">{bookmaker.name}</h3>
              <div className="flex items-center gap-1">
                <StarRating rating={bookmaker.rating} />
                <span className="text-sm text-gray-600">({bookmaker.rating})</span>
              </div>
            </div>
          </div>
          <a
            href={bookmaker.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-orange hover:bg-primary-orange/90 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Join Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow ${
      featured ? 'ring-2 ring-primary-orange ring-opacity-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <Image
              src={bookmaker.logo}
              alt={`${bookmaker.name} logo`}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{bookmaker.name}</h3>
            <div className="flex items-center gap-1">
              <StarRating rating={bookmaker.rating} />
              <span className="text-sm text-gray-600">({bookmaker.rating})</span>
            </div>
          </div>
        </div>
        {featured && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            Top Choice
          </span>
        )}
      </div>

      {/* Bonus */}
      <div className="mb-4 p-3 bg-gradient-to-r from-primary-orange/10 to-primary-orange/5 rounded-lg border border-primary-orange/20">
        <div className="text-sm font-medium text-primary-orange mb-1">Welcome Bonus</div>
        <div className="font-bold text-gray-900">{bookmaker.bonus}</div>
      </div>

      {/* Key Features */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Key Features</div>
        <div className="flex flex-wrap gap-2">
          {bookmaker.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        {bookmaker.min_deposit && (
          <div>
            <span className="text-gray-600">Min Deposit:</span>
            <span className="font-medium text-gray-900 ml-1">{bookmaker.min_deposit}</span>
          </div>
        )}
        {bookmaker.payout_speed && (
          <div>
            <span className="text-gray-600">Payout:</span>
            <span className="font-medium text-gray-900 ml-1">{bookmaker.payout_speed}</span>
          </div>
        )}
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm font-medium text-green-700 mb-2">Pros</div>
          <ul className="space-y-1">
            {bookmaker.pros.slice(0, 2).map((pro, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-red-700 mb-2">Cons</div>
          <ul className="space-y-1">
            {bookmaker.cons.slice(0, 2).map((con, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <a
          href={bookmaker.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-primary-orange hover:bg-primary-orange/90 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors"
        >
          Join Now
        </a>
        <Link
          href={`/review/${bookmaker.slug}`}
          className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 py-3 px-4 rounded-lg font-medium text-center transition-colors"
        >
          Read Review
        </Link>
      </div>
    </div>
  );
};

export default BookmakerCard;
