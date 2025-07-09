import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiStar, FiFilter, FiSearch, FiTrendingUp, FiShield, FiCreditCard, FiSmartphone, FiArrowRight } from 'react-icons/fi';
import { useQuery } from 'react-query';

// Components
import Layout from '../components/layout/Layout';

// Utils
import { trackButtonClick } from '../utils/analytics';
import { generateBookmakerPlaceholder, handleImageError } from '../utils/imageUtils';

// Types
interface Bookmaker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  welcomeBonus: string;
  minDeposit: string;
  paymentMethods: string[];
  mobileApp: boolean;
  liveStreaming: boolean;
  inPlayBetting: boolean;
  cashOut: boolean;
  established: number;
  license: string;
  shortReview: string;
  pros: string[];
  cons: string[];
  featured: boolean;
}

interface ReviewsPageProps {}

const ReviewsPage: React.FC<ReviewsPageProps> = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterRating, setFilterRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch bookmakers
  const { data: bookmakers, isLoading, error } = useQuery<Bookmaker[]>('bookmakers', async () => {
    const response = await fetch('/api/bookmakers');
    if (!response.ok) throw new Error('Failed to fetch bookmakers');
    return response.json();
  });

  // Filter and sort bookmakers
  const filteredBookmakers = bookmakers?.filter(bookmaker => {
    const matchesSearch = bookmaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmaker.shortReview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === 0 || bookmaker.rating >= filterRating;
    return matchesSearch && matchesRating;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'established':
        return b.established - a.established;
      default:
        return 0;
    }
  });

  const handleBookmakerClick = (bookmaker: Bookmaker) => {
    trackButtonClick('view_bookmaker_details', `reviews_${bookmaker.name.toLowerCase()}`);
    router.push(`/reviews/${bookmaker.id}`);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'mobile':
        return <FiSmartphone className="w-5 h-5 text-primary" />;
      case 'secure':
        return <FiShield className="w-5 h-5 text-green-500" />;
      case 'payment':
        return <FiCreditCard className="w-5 h-5 text-blue-500" />;
      default:
        return <FiTrendingUp className="w-5 h-5 text-secondary" />;
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load reviews</h2><p className="text-gray-600">Please try again later.</p></div></div>;

  return (
    <Layout
      title="Betting Site Reviews - BetCompare.co.ke"
      description="Read detailed reviews of Kenya's top betting sites. Compare features, bonuses, and user experiences to find the perfect bookmaker for you."
      keywords="betting site reviews Kenya, bookmaker reviews, betting platform comparison, online betting reviews Kenya"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Betting Site Reviews
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
              Comprehensive reviews of Kenya's top betting sites. Find the perfect bookmaker with our expert analysis and user feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary btn-lg inline-flex items-center"
              >
                <FiFilter className="mr-2 h-5 w-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-outline btn-lg inline-flex items-center text-white border-white hover:bg-white hover:text-primary"
              >
                <FiArrowRight className="mr-2 h-5 w-5" />
                View Reviews
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookmakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="rating">Rating (High to Low)</option>
                  <option value="name">Name (A to Z)</option>
                  <option value="established">Established (Newest First)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4+ Stars</option>
                  <option value={3}>3+ Stars</option>
                  <option value={2}>2+ Stars</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSortBy('rating');
                    setFilterRating(0);
                  }}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBookmakers?.length || 0} bookmakers
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews-section" className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBookmakers?.map((bookmaker) => (
              <div
                key={bookmaker.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={bookmaker.logo}
                          alt={`${bookmaker.name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => handleImageError(e, generateBookmakerPlaceholder(bookmaker.name))}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-heading font-bold text-gray-900">{bookmaker.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {renderStars(Math.round(bookmaker.rating))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {bookmaker.rating.toFixed(1)} ({bookmaker.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    {bookmaker.featured && (
                      <div className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Welcome Bonus</p>
                      <p className="font-medium text-gray-900">{bookmaker.welcomeBonus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Min Deposit</p>
                      <p className="font-medium text-gray-900">{bookmaker.minDeposit}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookmaker.mobileApp && (
                      <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <FiSmartphone className="w-4 h-4 mr-1" />
                        Mobile App
                      </div>
                    )}
                    {bookmaker.liveStreaming && (
                      <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                        <FiTrendingUp className="w-4 h-4 mr-1" />
                        Live Streaming
                      </div>
                    )}
                    {bookmaker.cashOut && (
                      <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                        <FiCreditCard className="w-4 h-4 mr-1" />
                        Cash Out
                      </div>
                    )}
                  </div>

                  {/* Review Summary */}
                  <p className="text-gray-600 mb-4">{bookmaker.shortReview}</p>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Pros</h4>
                      <ul className="text-sm space-y-1">
                        {bookmaker.pros.slice(0, 3).map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-gray-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Cons</h4>
                      <ul className="text-sm space-y-1">
                        {bookmaker.cons.slice(0, 3).map((con, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-gray-700">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span>Est. {bookmaker.established}</span>
                      <span className="mx-2">•</span>
                      <span>{bookmaker.license}</span>
                    </div>
                    <button
                      onClick={() => handleBookmakerClick(bookmaker)}
                      className="btn btn-primary btn-sm inline-flex items-center"
                    >
                      Read Full Review
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookmakers?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bookmakers found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
            Ready to Start Betting?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Choose from our top-rated bookmakers and start your betting journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                trackButtonClick('compare_bookmakers_cta', 'reviews_bottom');
                router.push('/compare');
              }}
              className="btn btn-secondary btn-lg inline-flex items-center"
            >
              <FiTrendingUp className="mr-2 h-5 w-5" />
              Compare Bookmakers
            </button>
            <button
              onClick={() => {
                trackButtonClick('view_bonuses_cta', 'reviews_bottom');
                router.push('/bonuses');
              }}
              className="btn btn-outline btn-lg inline-flex items-center text-white border-white hover:bg-white hover:text-primary"
            >
              <FiStar className="mr-2 h-5 w-5" />
              View Bonuses
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ReviewsPage; 