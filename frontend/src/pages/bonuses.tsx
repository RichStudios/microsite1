import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  FiSearch, 
  FiFilter, 
  FiArrowUp, 
  FiExternalLink, 
  FiCalendar,
  FiPercent,
  FiDollarSign,
  FiClock,
  FiCheck,
  FiX,
  FiInfo
} from 'react-icons/fi';

// Components
import Layout from '../components/layout/Layout';

// Utils
import { trackButtonClick, trackAffiliateClick } from '../utils/analytics';
import { handleImageError } from '../utils/imageUtils';

interface Bonus {
  id: number;
  bookmaker: {
    name: string;
    logo: string;
    slug: string;
    rating: number;
  };
  type: string;
  amount: string;
  percentage: number;
  maxAmount: number;
  minDeposit: number;
  wagering: number;
  timeLimit: number; // in days
  sports: string[];
  features: {
    mpesa: boolean;
    newCustomersOnly: boolean;
    freeBet: boolean;
    noDeposit: boolean;
  };
  terms: string[];
  validUntil: string;
  affiliateLink: string;
  description: string;
  promoCode?: string;
}

const BonusesPage: React.FC = () => {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [filteredBonuses, setFilteredBonuses] = useState<Bonus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    type: '',
    minAmount: 0,
    maxWagering: 0,
    mpesa: false,
    newCustomersOnly: false,
    freeBet: false,
    noDeposit: false,
  });

  // Mock data - in real app, this would come from API
  const mockBonuses: Bonus[] = [
    {
      id: 1,
      bookmaker: {
        name: 'MelBet',
        logo: '/images/logos/melbet-logo.png',
        slug: 'melbet',
        rating: 4.3
      },
      type: '100% Match Bonus',
      amount: 'Up to KES 20,000',
      percentage: 100,
      maxAmount: 20000,
      minDeposit: 200,
      wagering: 5,
      timeLimit: 30,
      sports: ['Football', 'Basketball', 'Tennis', 'All Sports'],
      features: {
        mpesa: true,
        newCustomersOnly: true,
        freeBet: false,
        noDeposit: false,
      },
      terms: [
        'New customers only',
        'Minimum deposit KES 200',
        'Wagering requirement 5x',
        'Valid for 30 days',
        'Available on all sports'
      ],
      validUntil: '2024-12-31',
      affiliateLink: '#',
      description: 'Get 100% match bonus up to KES 20,000 on your first deposit. Perfect for serious bettors looking for maximum value.',
      promoCode: 'WELCOME100'
    },
    {
      id: 2,
      bookmaker: {
        name: '1xBet',
        logo: '/images/logos/1xbet-logo.png',
        slug: '1xbet',
        rating: 4.1
      },
      type: '100% Match Bonus',
      amount: 'Up to KES 15,000',
      percentage: 100,
      maxAmount: 15000,
      minDeposit: 100,
      wagering: 5,
      timeLimit: 30,
      sports: ['Football', 'Basketball', 'Tennis', 'Esports'],
      features: {
        mpesa: true,
        newCustomersOnly: true,
        freeBet: false,
        noDeposit: false,
      },
      terms: [
        'New customers only',
        'Minimum deposit KES 100',
        'Wagering requirement 5x',
        'Valid for 30 days',
        'Includes esports betting'
      ],
      validUntil: '2024-12-31',
      affiliateLink: '#',
      description: 'Double your first deposit with 100% match bonus up to KES 15,000. Great for exploring their extensive betting markets.',
    },
    {
      id: 3,
      bookmaker: {
        name: 'Odibets',
        logo: '/images/logos/odibets-logo.png',
        slug: 'odibets',
        rating: 4.2
      },
      type: '50% Match Bonus',
      amount: 'Up to KES 5,000',
      percentage: 50,
      maxAmount: 5000,
      minDeposit: 50,
      wagering: 6,
      timeLimit: 14,
      sports: ['Football', 'Basketball', 'Virtual Sports'],
      features: {
        mpesa: true,
        newCustomersOnly: true,
        freeBet: false,
        noDeposit: false,
      },
      terms: [
        'New customers only',
        'Minimum deposit KES 50',
        'Wagering requirement 6x',
        'Valid for 14 days',
        'Kenyan license holder'
      ],
      validUntil: '2024-12-31',
      affiliateLink: '#',
      description: 'Get 50% match bonus on your first deposit. Perfect for beginners with low minimum deposit requirement.',
    },
    {
      id: 4,
      bookmaker: {
        name: 'Betika',
        logo: '/images/logos/betika-logo.png',
        slug: 'betika',
        rating: 4.0
      },
      type: 'Risk-Free Bet',
      amount: 'Up to KES 2,500',
      percentage: 0,
      maxAmount: 2500,
      minDeposit: 10,
      wagering: 1,
      timeLimit: 7,
      sports: ['Football', 'Basketball', 'Virtual Sports'],
      features: {
        mpesa: true,
        newCustomersOnly: true,
        freeBet: true,
        noDeposit: false,
      },
      terms: [
        'New customers only',
        'Minimum deposit KES 10',
        'If first bet loses, get refund as free bet',
        'Valid for 7 days',
        'Extremely low minimum deposit'
      ],
      validUntil: '2024-12-31',
      affiliateLink: '#',
      description: 'Risk-free first bet up to KES 2,500. If you lose, get your stake back as a free bet. Perfect for trying out the platform.',
    },
    {
      id: 5,
      bookmaker: {
        name: 'Betway',
        logo: '/images/logos/betway-logo.png',
        slug: 'betway',
        rating: 4.5
      },
      type: 'Free Bet',
      amount: 'Up to KES 1,000',
      percentage: 0,
      maxAmount: 1000,
      minDeposit: 100,
      wagering: 5,
      timeLimit: 7,
      sports: ['Football', 'Basketball', 'Tennis', 'Cricket'],
      features: {
        mpesa: true,
        newCustomersOnly: true,
        freeBet: true,
        noDeposit: false,
      },
      terms: [
        'New customers only',
        'Minimum deposit KES 100',
        'Wagering requirement 5x',
        'Valid for 7 days',
        'Trusted international brand'
      ],
      validUntil: '2024-12-31',
      affiliateLink: '#',
      description: 'Get a free bet up to KES 1,000 from one of the most trusted betting brands globally. Perfect for conservative bettors.',
    },
    {
      id: 6,
      bookmaker: {
        name: 'SportPesa',
        logo: '/images/logos/sportpesa-logo.png',
        slug: 'sportpesa',
        rating: 3.8
      },
      type: 'Free Bet',
      amount: 'Up to KES 1,500',
      percentage: 0,
      maxAmount: 1500,
      minDeposit: 50,
      wagering: 3,
      timeLimit: 10,
      sports: ['Football', 'Basketball', 'Rugby'],
      features: {
        mpesa: true,
        newCustomersOnly: true,
        freeBet: true,
        noDeposit: false,
      },
      terms: [
        'New customers only',
        'Minimum deposit KES 50',
        'Wagering requirement 3x',
        'Valid for 10 days',
        'Focus on local sports'
      ],
      validUntil: '2024-12-31',
      affiliateLink: '#',
      description: 'Free bet up to KES 1,500 from Kenya\'s homegrown betting brand. Great for local sports enthusiasts.',
    },
  ];

  useEffect(() => {
    setBonuses(mockBonuses);
    setFilteredBonuses(mockBonuses);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = bonuses.filter(bonus => {
      const matchesSearch = bonus.bookmaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bonus.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filters.type || bonus.type.includes(filters.type);
      const matchesMinAmount = bonus.maxAmount >= filters.minAmount;
      const matchesMaxWagering = filters.maxWagering === 0 || bonus.wagering <= filters.maxWagering;
      const matchesFeatures = (
        (!filters.mpesa || bonus.features.mpesa) &&
        (!filters.newCustomersOnly || bonus.features.newCustomersOnly) &&
        (!filters.freeBet || bonus.features.freeBet) &&
        (!filters.noDeposit || bonus.features.noDeposit)
      );
      
      return matchesSearch && matchesType && matchesMinAmount && matchesMaxWagering && matchesFeatures;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.maxAmount;
          bValue = b.maxAmount;
          break;
        case 'bookmaker':
          aValue = a.bookmaker.name;
          bValue = b.bookmaker.name;
          break;
        case 'wagering':
          aValue = a.wagering;
          bValue = b.wagering;
          break;
        case 'timeLimit':
          aValue = a.timeLimit;
          bValue = b.timeLimit;
          break;
        case 'rating':
          aValue = a.bookmaker.rating;
          bValue = b.bookmaker.rating;
          break;
        default:
          aValue = a.maxAmount;
          bValue = b.maxAmount;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBonuses(filtered);
  }, [bonuses, searchTerm, sortBy, sortOrder, filters]);

  const handleAffiliateClick = (bookmakerName: string, affiliateLink: string) => {
    trackAffiliateClick(bookmakerName, 'bonuses_page', 'claim_bonus');
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBonusTypeColor = (type: string) => {
    if (type.includes('Match')) return 'bg-primary-100 text-primary-800';
    if (type.includes('Free')) return 'bg-success-100 text-success-800';
    if (type.includes('Risk')) return 'bg-warning-100 text-warning-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getWageringColor = (wagering: number) => {
    if (wagering <= 3) return 'text-success-600';
    if (wagering <= 5) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <Layout>
      <Head>
        <title>Best Betting Bonuses in Kenya - Welcome Offers & Free Bets</title>
        <meta name="description" content="Compare the best betting bonuses in Kenya. Find welcome offers, free bets, and match bonuses from top bookmakers. Updated daily." />
        <meta name="keywords" content="betting bonuses Kenya, welcome bonus, free bets, match bonus, bookmaker offers" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-primary mb-4">
              Best Betting Bonuses in Kenya
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare welcome offers, free bets, and match bonuses from Kenya's top bookmakers. Find the best deal for your betting style.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-soft p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">KES 20,000</div>
              <div className="text-sm text-gray-600">Highest Bonus</div>
            </div>
            <div className="bg-white rounded-lg shadow-soft p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">KES 10</div>
              <div className="text-sm text-gray-600">Lowest Min Deposit</div>
            </div>
            <div className="bg-white rounded-lg shadow-soft p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">1x</div>
              <div className="text-sm text-gray-600">Best Wagering</div>
            </div>
            <div className="bg-white rounded-lg shadow-soft p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{bonuses.length}</div>
              <div className="text-sm text-gray-600">Active Bonuses</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bonuses or bookmakers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="amount">Bonus Amount</option>
                  <option value="bookmaker">Bookmaker</option>
                  <option value="wagering">Wagering</option>
                  <option value="timeLimit">Time Limit</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4 mb-4">
                <FiFilter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bonus Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="Match">Match Bonus</option>
                    <option value="Free">Free Bet</option>
                    <option value="Risk">Risk-Free Bet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={filters.minAmount}
                    onChange={(e) => setFilters({...filters, minAmount: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Wagering
                  </label>
                  <select
                    value={filters.maxWagering}
                    onChange={(e) => setFilters({...filters, maxWagering: parseInt(e.target.value)})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  >
                    <option value="0">Any</option>
                    <option value="3">3x or less</option>
                    <option value="5">5x or less</option>
                    <option value="10">10x or less</option>
                  </select>
                </div>

                <div className="space-y-2">
                  {Object.entries(filters)
                    .filter(([key, value]) => typeof value === 'boolean')
                    .map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value as boolean}
                        onChange={(e) => setFilters({...filters, [key]: e.target.checked})}
                        className="mr-2 h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                      />
                      <label htmlFor={key} className="text-sm text-gray-700">
                        {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredBonuses.length} of {bonuses.length} bonuses
            </p>
          </div>

          {/* Bonuses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBonuses.map((bonus) => (
              <div key={bonus.id} className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={bonus.bookmaker.logo}
                        alt={bonus.bookmaker.name}
                        className="h-12 w-12 object-contain"
                        onError={(e) => handleImageError(e, bonus.bookmaker.name, 'bookmaker')}
                      />
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-gray-900">
                          {bonus.bookmaker.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBonusTypeColor(bonus.type)}`}>
                            {bonus.type}
                          </span>
                          <span className="text-sm text-gray-600">
                            {bonus.bookmaker.rating}/5 rating
                          </span>
                        </div>
                      </div>
                    </div>
                    {bonus.promoCode && (
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Promo Code</div>
                        <div className="font-mono text-sm font-semibold text-primary bg-primary-100 px-2 py-1 rounded">
                          {bonus.promoCode}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bonus Amount */}
                  <div className="bg-gradient-to-r from-secondary to-secondary-dark text-white p-4 rounded-lg mb-4">
                    <div className="text-2xl font-bold mb-1">{bonus.amount}</div>
                    <p className="text-secondary-100 text-sm">{bonus.description}</p>
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <FiDollarSign className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Min Deposit</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatAmount(bonus.minDeposit)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <FiPercent className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Wagering</span>
                      </div>
                      <div className={`text-lg font-semibold ${getWageringColor(bonus.wagering)}`}>
                        {bonus.wagering}x
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <FiClock className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Time Limit</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {bonus.timeLimit} days
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <FiCalendar className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Valid Until</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {new Date(bonus.validUntil).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.entries(bonus.features).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        {value ? (
                          <FiCheck className="h-4 w-4 text-success-500" />
                        ) : (
                          <FiX className="h-4 w-4 text-gray-300" />
                        )}
                        <span className={`text-sm ${value ? 'text-gray-700' : 'text-gray-400'}`}>
                          {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Sports */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Available Sports:</div>
                    <div className="flex flex-wrap gap-2">
                      {bonus.sports.map(sport => (
                        <span
                          key={sport}
                          className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiInfo className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Key Terms:</span>
                    </div>
                    <ul className="space-y-1">
                      {bonus.terms.slice(0, 3).map((term, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAffiliateClick(bonus.bookmaker.name, bonus.affiliateLink)}
                      className="btn btn-primary flex-1"
                    >
                      <FiExternalLink className="mr-2 h-4 w-4" />
                      Claim Bonus
                    </button>
                    <a
                      href={`/review/${bonus.bookmaker.slug}`}
                      className="btn btn-outline px-4"
                      onClick={() => trackButtonClick('view_review', 'bonuses_page')}
                    >
                      Review
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredBonuses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiSearch className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bonuses found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}

          {/* Important Notice */}
          <div className="mt-12 bg-warning-50 border border-warning-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <FiInfo className="h-5 w-5 text-warning-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-warning-800 mb-2">
                  Important Information
                </h3>
                <ul className="text-sm text-warning-700 space-y-1">
                  <li>• All bonuses are subject to terms and conditions</li>
                  <li>• Only bet what you can afford to lose</li>
                  <li>• 18+ only. Gambling can be addictive</li>
                  <li>• Check local laws regarding online betting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">
                Need Help Choosing the Right Bonus?
              </h2>
              <p className="text-primary-100 mb-6">
                Read our comprehensive bookmaker reviews to understand which bonus suits your betting style best.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/review"
                  className="btn btn-secondary btn-lg"
                  onClick={() => trackButtonClick('read_reviews', 'bonuses_page')}
                >
                  Read Reviews
                </a>
                <a
                  href="/compare"
                  className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => trackButtonClick('compare_bookmakers', 'bonuses_page')}
                >
                  Compare Bookmakers
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BonusesPage; 