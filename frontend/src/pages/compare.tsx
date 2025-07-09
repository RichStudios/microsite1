import React, { useState, useEffect, lazy, Suspense } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { FiStar, FiCheck, FiX, FiSearch, FiFilter, FiArrowUp, FiExternalLink } from 'react-icons/fi';

// Components - Regular imports for critical components
import Layout from '../components/layout/Layout';

// Dynamic imports for heavy components
const SwipeableTable = dynamic(
  () => import('../components/ui/SwipeableTable'),
  {
    loading: () => <div className="w-full h-32 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false
  }
);

const BookmakerCard = dynamic(
  () => import('../components/ui/BookmakerCard'),
  {
    loading: () => <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: true
  }
);

// Utils
import { trackButtonClick, trackAffiliateClick } from '../utils/analytics';
import { handleImageError } from '../utils/imageUtils';

interface Bookmaker {
  id: number;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  established: string;
  license: string;
  bonus: {
    amount: string;
    type: string;
    wagering: string;
  };
  features: {
    mpesa: boolean;
    liveStreaming: boolean;
    mobileApp: boolean;
    cashOut: boolean;
    liveChat: boolean;
  };
  paymentMethods: string[];
  minDeposit: string;
  withdrawalTime: string;
  odds: {
    football: number;
    basketball: number;
    tennis: number;
  };
  affiliateLink: string;
  slug: string;
}

// Loading component for table rows
const TableRowSkeleton = () => (
  <tr className="border-b border-gray-200">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
    ))}
  </tr>
);

const ComparePage: React.FC = () => {
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([]);
  const [filteredBookmakers, setFilteredBookmakers] = useState<Bookmaker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBookmakers, setSelectedBookmakers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    minRating: 0,
    mpesa: false,
    liveStreaming: false,
    mobileApp: false,
    cashOut: false,
    liveChat: false,
  });

  // Mock data - in real app, this would come from API
  const mockBookmakers: Bookmaker[] = [
    {
      id: 1,
      name: 'Betway',
      logo: '/images/logos/betway-logo.svg',
      rating: 4.5,
      reviewCount: 1250,
      established: '2006',
      license: 'Malta Gaming Authority',
      bonus: {
        amount: 'Up to KES 1,000',
        type: 'Free Bet',
        wagering: '5x'
      },
      features: {
        mpesa: true,
        liveStreaming: true,
        mobileApp: true,
        cashOut: true,
        liveChat: true,
      },
      paymentMethods: ['M-Pesa', 'Credit Card', 'Bank Transfer'],
      minDeposit: 'KES 100',
      withdrawalTime: '24-48 hours',
      odds: {
        football: 4.2,
        basketball: 3.8,
        tennis: 4.1,
      },
      affiliateLink: '#',
      slug: 'betway'
    },
    {
      id: 2,
      name: 'MelBet',
      logo: '/images/logos/melbet-logo.svg',
      rating: 4.3,
      reviewCount: 980,
      established: '2012',
      license: 'Curacao Gaming License',
      bonus: {
        amount: 'Up to KES 20,000',
        type: '100% Match',
        wagering: '5x'
      },
      features: {
        mpesa: true,
        liveStreaming: false,
        mobileApp: true,
        cashOut: true,
        liveChat: true,
      },
      paymentMethods: ['M-Pesa', 'Credit Card', 'Airtel Money'],
      minDeposit: 'KES 200',
      withdrawalTime: '12-24 hours',
      odds: {
        football: 4.0,
        basketball: 3.9,
        tennis: 3.8,
      },
      affiliateLink: '#',
      slug: 'melbet'
    },
    {
      id: 3,
      name: '1xBet',
      logo: '/images/logos/1xbet-logo.svg',
      rating: 4.1,
      reviewCount: 2100,
      established: '2007',
      license: 'Curacao Gaming License',
      bonus: {
        amount: 'Up to KES 15,000',
        type: '100% Match',
        wagering: '5x'
      },
      features: {
        mpesa: true,
        liveStreaming: true,
        mobileApp: false,
        cashOut: false,
        liveChat: true,
      },
      paymentMethods: ['M-Pesa', 'Credit Card', 'Bank Transfer', 'Airtel Money'],
      minDeposit: 'KES 100',
      withdrawalTime: '24-72 hours',
      odds: {
        football: 3.8,
        basketball: 4.1,
        tennis: 4.0,
      },
      affiliateLink: '#',
      slug: '1xbet'
    },
    {
      id: 4,
      name: 'Odibets',
      logo: '/images/logos/odibets-logo.svg',
      rating: 4.2,
      reviewCount: 1500,
      established: '2018',
      license: 'BCLB Kenya',
      bonus: {
        amount: 'Up to KES 5,000',
        type: '50% Match',
        wagering: '6x'
      },
      features: {
        mpesa: true,
        liveStreaming: false,
        mobileApp: true,
        cashOut: true,
        liveChat: false,
      },
      paymentMethods: ['M-Pesa', 'Airtel Money'],
      minDeposit: 'KES 50',
      withdrawalTime: '1-24 hours',
      odds: {
        football: 3.9,
        basketball: 3.7,
        tennis: 3.9,
      },
      affiliateLink: '#',
      slug: 'odibets'
    },
    {
      id: 5,
      name: 'Betika',
      logo: '/images/logos/betika-logo.svg',
      rating: 4.0,
      reviewCount: 1800,
      established: '2016',
      license: 'BCLB Kenya',
      bonus: {
        amount: 'Up to KES 2,500',
        type: 'Risk-Free Bet',
        wagering: '1x'
      },
      features: {
        mpesa: true,
        liveStreaming: false,
        mobileApp: true,
        cashOut: false,
        liveChat: true,
      },
      paymentMethods: ['M-Pesa', 'Airtel Money'],
      minDeposit: 'KES 10',
      withdrawalTime: '1-6 hours',
      odds: {
        football: 3.7,
        basketball: 3.6,
        tennis: 3.8,
      },
      affiliateLink: '#',
      slug: 'betika'
    },
  ];

  useEffect(() => {
    // Initialize bookmakers
    setBookmakers(mockBookmakers);
    setFilteredBookmakers(mockBookmakers);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = bookmakers.filter(bookmaker => {
      const matchesSearch = bookmaker.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = bookmaker.rating >= filters.minRating;
      const matchesFeatures = (
        (!filters.mpesa || bookmaker.features.mpesa) &&
        (!filters.liveStreaming || bookmaker.features.liveStreaming) &&
        (!filters.mobileApp || bookmaker.features.mobileApp) &&
        (!filters.cashOut || bookmaker.features.cashOut) &&
        (!filters.liveChat || bookmaker.features.liveChat)
      );
      
      return matchesSearch && matchesRating && matchesFeatures;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'established':
          aValue = parseInt(a.established);
          bValue = parseInt(b.established);
          break;
        case 'minDeposit':
          aValue = parseInt(a.minDeposit.replace(/[^\d]/g, ''));
          bValue = parseInt(b.minDeposit.replace(/[^\d]/g, ''));
          break;
        default:
          aValue = a.rating;
          bValue = b.rating;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBookmakers(filtered);
  }, [bookmakers, searchTerm, sortBy, sortOrder, filters]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelect = (bookmaker: Bookmaker) => {
    if (selectedBookmakers.includes(bookmaker.id)) {
      setSelectedBookmakers(selectedBookmakers.filter(id => id !== bookmaker.id));
    } else {
      setSelectedBookmakers([...selectedBookmakers, bookmaker.id]);
    }
  };

  const handleAffiliateClick = (bookmakerName: string, affiliateLink: string) => {
    trackAffiliateClick(bookmakerName, 'compare_page', 'join_now');
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="h-4 w-4 text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar key="half" className="h-4 w-4 text-warning fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  const renderFeature = (hasFeature: boolean) => {
    return hasFeature ? (
      <FiCheck className="h-5 w-5 text-success mx-auto" />
    ) : (
      <FiX className="h-5 w-5 text-error mx-auto" />
    );
  };

  return (
    <Layout>
      <Head>
        <title>Compare Bookmakers - BetCompare.co.ke</title>
        <meta name="description" content="Compare Kenya's top bookmakers side by side. Find the best odds, bonuses, and features for your betting needs." />
        <meta name="keywords" content="bookmaker comparison, betting odds, Kenya betting sites, compare bookies" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-primary mb-4">
              Compare Bookmakers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare Kenya's top bookmakers side by side. Find the best odds, bonuses, and features for your betting needs.
            </p>
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
                    placeholder="Search bookmakers..."
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
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                  <option value="established">Established</option>
                  <option value="minDeposit">Min Deposit</option>
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  >
                    <option value="0">Any</option>
                    <option value="3">3+ stars</option>
                    <option value="4">4+ stars</option>
                    <option value="4.5">4.5+ stars</option>
                  </select>
                </div>

                {Object.entries(filters).filter(([key]) => typeof filters[key as keyof typeof filters] === 'boolean').map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value as boolean}
                      onChange={(e) => setFilters({...filters, [key]: e.target.checked})}
                      className="mr-2 h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                    />
                    <label htmlFor={key} className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredBookmakers.length} of {bookmakers.length} bookmakers
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Bookmaker
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('rating')}>
                      Rating
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Bonus
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      M-Pesa
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Live Streaming
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Mobile App
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Cash Out
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('minDeposit')}>
                      Min Deposit
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookmakers.map((bookmaker, index) => (
                    <tr key={bookmaker.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              src={bookmaker.logo}
                              alt={bookmaker.name}
                              className="h-12 w-12 object-contain"
                              onError={(e) => handleImageError(e, bookmaker.name, 'bookmaker')}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{bookmaker.name}</div>
                            <div className="text-sm text-gray-500">Est. {bookmaker.established}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {renderStars(bookmaker.rating)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {bookmaker.rating}/5 ({bookmaker.reviewCount})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">{bookmaker.bonus.amount}</div>
                        <div className="text-sm text-gray-500">{bookmaker.bonus.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {renderFeature(bookmaker.features.mpesa)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {renderFeature(bookmaker.features.liveStreaming)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {renderFeature(bookmaker.features.mobileApp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {renderFeature(bookmaker.features.cashOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">{bookmaker.minDeposit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="space-y-2">
                          <button
                            onClick={() => handleAffiliateClick(bookmaker.name, bookmaker.affiliateLink)}
                            className="btn btn-primary btn-sm w-full"
                          >
                            Join Now
                          </button>
                          <a
                            href={`/review/${bookmaker.slug}`}
                            className="btn btn-outline btn-sm w-full"
                            onClick={() => trackButtonClick('view_review', 'compare_page')}
                          >
                            Review
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-primary text-white rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">
                Need Help Choosing?
              </h2>
              <p className="text-primary-100 mb-6">
                Our betting experts have reviewed each bookmaker to help you make the best choice for your betting needs.
              </p>
              <a
                href="/blog"
                className="btn btn-secondary btn-lg"
                onClick={() => trackButtonClick('read_guides', 'compare_page')}
              >
                Read Our Guides
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComparePage; 