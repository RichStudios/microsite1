import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiStar, FiSearch, FiFilter, FiArrowRight, FiCalendar, FiUsers } from 'react-icons/fi';

// Components
import Layout from '../../components/layout/Layout';

// Utils
import { trackButtonClick } from '../../utils/analytics';
import { handleImageError } from '../../utils/imageUtils';

interface ReviewSummary {
  id: number;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  established: string;
  bonus: {
    amount: string;
    type: string;
  };
  features: {
    mpesa: boolean;
    liveStreaming: boolean;
    mobileApp: boolean;
    cashOut: boolean;
  };
  slug: string;
  excerpt: string;
  lastUpdated: string;
}

const ReviewsIndexPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    minRating: 0,
    mpesa: false,
    liveStreaming: false,
    mobileApp: false,
    cashOut: false,
  });

  // Mock data - in real app, this would come from API
  const mockReviews: ReviewSummary[] = [
    {
      id: 1,
      name: 'Betway',
      logo: '/images/logos/betway-logo.svg',
      rating: 4.5,
      reviewCount: 1250,
      established: '2006',
      bonus: {
        amount: 'Up to KES 1,000',
        type: 'Free Bet'
      },
      features: {
        mpesa: true,
        liveStreaming: true,
        mobileApp: true,
        cashOut: true,
      },
      slug: 'betway',
      excerpt: 'Betway is one of the most trusted names in online betting, offering excellent odds, a user-friendly mobile app, and reliable customer service for Kenyan bettors.',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'MelBet',
      logo: '/images/logos/melbet-logo.svg',
      rating: 4.3,
      reviewCount: 980,
      established: '2012',
      bonus: {
        amount: 'Up to KES 20,000',
        type: '100% Match'
      },
      features: {
        mpesa: true,
        liveStreaming: false,
        mobileApp: true,
        cashOut: true,
      },
      slug: 'melbet',
      excerpt: 'MelBet offers one of the highest welcome bonuses in Kenya with extensive sports coverage and fast withdrawal times for serious bettors.',
      lastUpdated: '2024-01-15'
    },
    {
      id: 3,
      name: '1xBet',
      logo: '/images/logos/1xbet-logo.svg',
      rating: 4.1,
      reviewCount: 2100,
      established: '2007',
      bonus: {
        amount: 'Up to KES 15,000',
        type: '100% Match'
      },
      features: {
        mpesa: true,
        liveStreaming: true,
        mobileApp: false,
        cashOut: false,
      },
      slug: '1xbet',
      excerpt: '1xBet is known for its extensive betting markets and competitive odds, offering a wide range of sports and payment options for experienced bettors.',
      lastUpdated: '2024-01-15'
    },
    {
      id: 4,
      name: 'Odibets',
      logo: '/images/logos/odibets-logo.svg',
      rating: 4.2,
      reviewCount: 1500,
      established: '2018',
      bonus: {
        amount: 'Up to KES 5,000',
        type: '50% Match'
      },
      features: {
        mpesa: true,
        liveStreaming: false,
        mobileApp: true,
        cashOut: true,
      },
      slug: 'odibets',
      excerpt: 'Odibets is a Kenyan-licensed bookmaker offering fast M-Pesa withdrawals and competitive odds on local and international sports.',
      lastUpdated: '2024-01-15'
    },
    {
      id: 5,
      name: 'Betika',
      logo: '/images/logos/betika-logo.svg',
      rating: 4.0,
      reviewCount: 1800,
      established: '2016',
      bonus: {
        amount: 'Up to KES 2,500',
        type: 'Risk-Free Bet'
      },
      features: {
        mpesa: true,
        liveStreaming: false,
        mobileApp: true,
        cashOut: false,
      },
      slug: 'betika',
      excerpt: 'Betika is a popular Kenyan bookmaker with a focus on local sports and extremely fast M-Pesa transactions with low minimum deposits.',
      lastUpdated: '2024-01-15'
    },
    {
      id: 6,
      name: 'SportPesa',
      logo: '/images/logos/sportpesa-logo.svg',
      rating: 3.8,
      reviewCount: 2200,
      established: '2014',
      bonus: {
        amount: 'Up to KES 1,500',
        type: 'Free Bet'
      },
      features: {
        mpesa: true,
        liveStreaming: false,
        mobileApp: true,
        cashOut: false,
      },
      slug: 'sportpesa',
      excerpt: 'SportPesa is a well-known Kenyan brand offering good odds on football and other sports with reliable M-Pesa integration.',
      lastUpdated: '2024-01-15'
    },
  ];

  useEffect(() => {
    setReviews(mockReviews);
    setFilteredReviews(mockReviews);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = reviews.filter(review => {
      const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = review.rating >= filters.minRating;
      const matchesFeatures = (
        (!filters.mpesa || review.features.mpesa) &&
        (!filters.liveStreaming || review.features.liveStreaming) &&
        (!filters.mobileApp || review.features.mobileApp) &&
        (!filters.cashOut || review.features.cashOut)
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
        case 'reviewCount':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
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

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, sortBy, sortOrder, filters]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <Head>
        <title>Bookmaker Reviews - Expert Analysis of Kenya's Top Betting Sites</title>
        <meta name="description" content="Read expert reviews of Kenya's top bookmakers. Compare bonuses, odds, features, and payment methods to find the best betting site for you." />
        <meta name="keywords" content="bookmaker reviews, betting site reviews, Kenya bookmakers, betting reviews" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-primary mb-4">
              Bookmaker Reviews
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert reviews of Kenya's top bookmakers. Compare bonuses, odds, features, and payment methods to find the best betting site for you.
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
                    placeholder="Search reviews..."
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
                  <option value="reviewCount">Review Count</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {sortOrder === 'desc' ? '↓' : '↑'}
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4 mb-4">
                <FiFilter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

                {Object.entries(filters).filter(([key, value]) => typeof value === 'boolean').map(([key, value]) => (
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

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={review.logo}
                      alt={review.name}
                      className="h-12 w-12 object-contain"
                      onError={(e) => handleImageError(e, review.name, 'bookmaker')}
                    />
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-gray-900">
                        {review.name}
                      </h3>
                      <p className="text-sm text-gray-600">Est. {review.established}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{review.rating}</span>
                    <span className="text-sm text-gray-500">({review.reviewCount} reviews)</span>
                  </div>

                  {/* Bonus */}
                  <div className="bg-secondary-100 p-3 rounded-lg mb-4">
                    <div className="text-sm text-secondary-800 font-medium mb-1">Welcome Bonus</div>
                    <div className="text-lg font-bold text-secondary-900">{review.bonus.amount}</div>
                    <div className="text-xs text-secondary-700">{review.bonus.type}</div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.entries(review.features).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${value ? 'bg-success-500' : 'bg-gray-300'}`}></div>
                        <span className="text-xs text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {review.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="h-3 w-3" />
                      <span>Updated {formatDate(review.lastUpdated)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiUsers className="h-3 w-3" />
                      <span>{review.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Link href={`/review/${review.slug}`}>
                    <button
                      className="btn btn-primary w-full"
                      onClick={() => trackButtonClick('read_review', 'reviews_index')}
                    >
                      Read Full Review
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiSearch className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">
                Can't Decide Which Bookmaker to Choose?
              </h2>
              <p className="text-primary-100 mb-6">
                Use our comparison tool to see bookmakers side by side and find the perfect match for your betting needs.
              </p>
              <Link href="/compare">
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => trackButtonClick('compare_bookmakers', 'reviews_index')}
                >
                  Compare Bookmakers
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewsIndexPage; 