import React from 'react';
import BookmakerCard from '../ui/BookmakerCard';

const mockBookmakers = [
  {
    id: '1',
    name: 'Betway',
    logo: '/images/logos/betway-logo.png',
    rating: 4.5,
    bonus: 'KES 1,000 Free Bet',
    features: ['Live Streaming', 'Cash Out'],
    pros: ['Fast M-Pesa deposits', 'Excellent mobile app', 'Live betting options'],
    minDeposit: 'KES 50',
    withdrawalTime: '24 hours',
    mobileApp: true,
    mpesaSupport: true,
    slug: 'betway',
    affiliateUrl: 'https://betway.com'
  },
  {
    id: '2',
    name: 'MelBet',
    logo: '/images/logos/melbet-logo.png',
    rating: 4.3,
    bonus: '100% up to KES 20,000',
    features: ['High Odds', '40+ Sports'],
    pros: ['Huge welcome bonus', 'Wide sports coverage', 'Multiple payment methods'],
    minDeposit: 'KES 20',
    withdrawalTime: '12-24 hours',
    mobileApp: true,
    mpesaSupport: true,
    slug: 'melbet',
    affiliateUrl: 'https://melbet.com'
  },
  {
    id: '3',
    name: '1xBet',
    logo: '/images/logos/1xbet-logo.png',
    rating: 4.2,
    bonus: '200% up to KES 15,000',
    features: ['Pre-match', 'Live'],
    pros: ['Competitive odds', 'Extensive markets', 'Quick withdrawals'],
    minDeposit: 'KES 100',
    withdrawalTime: '15 minutes',
    mobileApp: true,
    mpesaSupport: true,
    slug: '1xbet',
    affiliateUrl: 'https://1xbet.com'
  }
];

const FeaturedBookmakers: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Rated Bookmakers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare Kenya's most trusted betting sites with the best odds, bonuses, and customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockBookmakers.map((bookmaker, index) => (
            <BookmakerCard
              key={bookmaker.id}
              bookmaker={bookmaker}
              priority={index === 0}
            />
          ))}
        </div>

        <div className="text-center">
          <a
            href="/compare"
            className="inline-flex items-center px-6 py-3 border border-orange-300 rounded-lg text-orange-700 bg-white hover:bg-orange-50 font-medium transition-colors duration-200"
          >
            View All Bookmakers
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBookmakers;