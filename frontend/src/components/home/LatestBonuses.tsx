
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Bonus {
  id: string;
  bookmaker: string;
  logo: string;
  title: string;
  amount: string;
  type: string;
  wagering: string;
  minDeposit: string;
  expiryDays: number;
  terms: string[];
  featured: boolean;
}

const BonusCard: React.FC<{ bonus: Bonus }> = ({ bonus }) => {
  return (
    <div className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow ${
      bonus.featured ? 'border-primary-orange shadow-md' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden">
            <Image
              src={bonus.logo}
              alt={`${bonus.bookmaker} logo`}
              fill
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = '/images/logos/placeholder-logo.svg';
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{bonus.bookmaker}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              bonus.type === 'Welcome Bonus' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {bonus.type}
            </span>
          </div>
        </div>
        {bonus.featured && (
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
            Hot Deal
          </span>
        )}
      </div>

      {/* Bonus Amount */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="text-sm font-medium text-gray-700 mb-1">{bonus.title}</div>
        <div className="text-2xl font-bold text-gray-900">{bonus.amount}</div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Min Deposit:</span>
          <span className="font-medium text-gray-900 ml-1">{bonus.minDeposit}</span>
        </div>
        <div>
          <span className="text-gray-600">Wagering:</span>
          <span className="font-medium text-gray-900 ml-1">{bonus.wagering}</span>
        </div>
      </div>

      {/* Expiry Notice */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-yellow-800">Valid for {bonus.expiryDays} days</span>
      </div>

      {/* Action Button */}
      <a
        href="#"
        className="w-full bg-primary-orange hover:bg-primary-orange/90 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors block"
      >
        Claim Bonus
      </a>
    </div>
  );
};

const LatestBonuses: React.FC = () => {
  const bonuses: Bonus[] = [
    {
      id: '1',
      bookmaker: 'Betway',
      logo: '/images/logos/placeholder-logo.svg',
      title: 'Welcome Sports Bonus',
      amount: 'Up to KSh 10,000',
      type: 'Welcome Bonus',
      wagering: '3x odds 1.75+',
      minDeposit: 'KSh 50',
      expiryDays: 30,
      terms: ['Valid for 30 days', 'Min odds 1.75', '3x wagering requirement'],
      featured: true
    },
    {
      id: '2',
      bookmaker: '1XBet',
      logo: '/images/logos/placeholder-logo.svg',
      title: 'First Deposit Bonus',
      amount: 'Up to KSh 15,000',
      type: 'Welcome Bonus',
      wagering: '5x accumulator',
      minDeposit: 'KSh 100',
      expiryDays: 30,
      terms: ['30 day validity', 'Accumulator bets only', '5x rollover'],
      featured: false
    },
    {
      id: '3',
      bookmaker: 'MelBet',
      logo: '/images/logos/placeholder-logo.svg',
      title: 'Sports Welcome Package',
      amount: 'Up to KSh 8,000',
      type: 'Welcome Bonus',
      wagering: '5x combo bets',
      minDeposit: 'KSh 40',
      expiryDays: 7,
      terms: ['7 day validity', 'Combo bets required', 'Min 3 selections'],
      featured: false
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Betting Bonuses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Grab the best welcome bonuses and free bets from top Kenyan bookmakers
          </p>
        </div>

        {/* Bonuses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {bonuses.map((bonus) => (
            <BonusCard key={bonus.id} bonus={bonus} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/bonuses"
            className="inline-flex items-center gap-2 bg-primary-navy hover:bg-primary-navy/90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            View All Bonuses
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBonuses;
