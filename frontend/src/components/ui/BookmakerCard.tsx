import React from 'react';
import Link from 'next/link';

interface BookmakerCardProps {
  bookmaker: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    bonus: string;
    features: string[];
    mpesa: boolean;
    slug: string;
  };
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`text-sm ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    );
  }
  return <div className="flex items-center gap-1">{stars}</div>;
};

const BookmakerCard: React.FC<BookmakerCardProps> = ({ bookmaker }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={bookmaker.logo} 
            alt={`${bookmaker.name} logo`} 
            className="w-12 h-12 rounded-lg object-contain"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{bookmaker.name}</h3>
            <div className="flex items-center gap-2">
              <StarRating rating={bookmaker.rating} />
              <span className="text-sm text-gray-600">({bookmaker.rating})</span>
            </div>
          </div>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
          Top Rated
        </span>
      </div>

      {/* Bonus */}
      <div className="mb-4">
        <p className="text-primary-orange font-semibold text-lg mb-2">{bookmaker.bonus}</p>
        <div className="flex flex-wrap gap-2">
          {bookmaker.features.slice(0, 3).map((feature, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
          {bookmaker.mpesa && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              M-Pesa Ready
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href={`/bookmaker/${bookmaker.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-primary-orange text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 text-center"
        >
          Visit Site
        </a>
        <Link
          href={`/review/${bookmaker.slug}`}
          className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-center"
        >
          Review
        </Link>
      </div>
    </div>
  );
};

export default BookmakerCard;