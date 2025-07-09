import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  FiStar, 
  FiCheck, 
  FiX, 
  FiExternalLink, 
  FiShield, 
  FiSmartphone, 
  FiCreditCard, 
  FiClock, 
  FiTrendingUp,
  FiAward,
  FiMessageCircle,
  FiPlayCircle,
  FiDollarSign
} from 'react-icons/fi';

// Components
import Layout from '../../components/layout/Layout';

// Utils
import { trackButtonClick, trackAffiliateClick } from '../../utils/analytics';
import { handleImageError } from '../../utils/imageUtils';

interface BookmakerReview {
  id: number;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  established: string;
  license: string;
  headquarters: string;
  bonus: {
    amount: string;
    type: string;
    wagering: string;
    minDeposit: string;
    timeLimit: string;
  };
  features: {
    mpesa: boolean;
    liveStreaming: boolean;
    mobileApp: boolean;
    cashOut: boolean;
    liveChat: boolean;
    multipleLanguages: boolean;
  };
  paymentMethods: string[];
  minDeposit: string;
  withdrawalTime: string;
  odds: {
    football: number;
    basketball: number;
    tennis: number;
    average: number;
  };
  sportsMarkets: string[];
  pros: string[];
  cons: string[];
  overview: string;
  affiliateLink: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  lastUpdated: string;
}

const BookmakerReviewPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [bookmaker, setBookmaker] = useState<BookmakerReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const mockBookmakers: Record<string, BookmakerReview> = {
    'betway': {
      id: 1,
      name: 'Betway',
      logo: '/images/logos/betway-logo.svg',
      rating: 4.5,
      reviewCount: 1250,
      established: '2006',
      license: 'Malta Gaming Authority',
      headquarters: 'Malta',
      bonus: {
        amount: 'Up to KES 1,000',
        type: 'Free Bet',
        wagering: '5x',
        minDeposit: 'KES 100',
        timeLimit: '7 days'
      },
      features: {
        mpesa: true,
        liveStreaming: true,
        mobileApp: true,
        cashOut: true,
        liveChat: true,
        multipleLanguages: true,
      },
      paymentMethods: ['M-Pesa', 'Credit Card', 'Bank Transfer', 'Airtel Money'],
      minDeposit: 'KES 100',
      withdrawalTime: '24-48 hours',
      odds: {
        football: 4.2,
        basketball: 3.8,
        tennis: 4.1,
        average: 4.0
      },
      sportsMarkets: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Rugby', 'Horse Racing', 'Virtual Sports'],
      pros: [
        'Excellent mobile app experience',
        'Live streaming for major events',
        'Fast M-Pesa withdrawals',
        'Competitive odds on football',
        'Strong customer support',
        'Licensed and regulated'
      ],
      cons: [
        'Limited promotions for existing customers',
        'High minimum odds for bonus',
        'Withdrawal fees on some methods'
      ],
      overview: 'Betway is one of the most trusted names in online betting, offering a comprehensive platform for Kenyan bettors. With over 15 years of experience, they provide excellent odds, a user-friendly mobile app, and reliable customer service.',
      affiliateLink: '#',
      slug: 'betway',
      seoTitle: 'Betway Review 2024 - Is It Kenya\'s Best Betting Site?',
      seoDescription: 'Complete Betway review for Kenyan bettors. Discover bonuses, odds, M-Pesa payments, and more in our expert analysis.',
      lastUpdated: '2024-01-15'
    },
    'melbet': {
      id: 2,
      name: 'MelBet',
      logo: '/images/logos/melbet-logo.svg',
      rating: 4.3,
      reviewCount: 980,
      established: '2012',
      license: 'Curacao Gaming License',
      headquarters: 'Cyprus',
      bonus: {
        amount: 'Up to KES 20,000',
        type: '100% Match Bonus',
        wagering: '5x',
        minDeposit: 'KES 200',
        timeLimit: '30 days'
      },
      features: {
        mpesa: true,
        liveStreaming: false,
        mobileApp: true,
        cashOut: true,
        liveChat: true,
        multipleLanguages: true,
      },
      paymentMethods: ['M-Pesa', 'Credit Card', 'Airtel Money', 'Bank Transfer'],
      minDeposit: 'KES 200',
      withdrawalTime: '12-24 hours',
      odds: {
        football: 4.0,
        basketball: 3.9,
        tennis: 3.8,
        average: 3.9
      },
      sportsMarkets: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Rugby', 'Boxing', 'MMA', 'Esports'],
      pros: [
        'High welcome bonus up to KES 20,000',
        'Very fast withdrawals',
        'Extensive sports coverage',
        'Good mobile app',
        'Multiple payment options',
        'Esports betting available'
      ],
      cons: [
        'No live streaming',
        'Complex bonus terms',
        'Limited customer support hours'
      ],
      overview: 'MelBet offers one of the highest welcome bonuses in Kenya with extensive sports coverage. Their fast withdrawal times and comprehensive mobile app make them a popular choice for serious bettors.',
      affiliateLink: '#',
      slug: 'melbet',
      seoTitle: 'MelBet Review 2024 - KES 20,000 Bonus & Fast Withdrawals',
      seoDescription: 'Comprehensive MelBet review covering bonuses, odds, payments, and more. See if MelBet is right for your betting needs.',
      lastUpdated: '2024-01-15'
    },
    '1xbet': {
      id: 3,
      name: '1xBet',
      logo: '/images/logos/1xbet-logo.svg',
      rating: 4.1,
      reviewCount: 2100,
      established: '2007',
      license: 'Curacao Gaming License',
      headquarters: 'Cyprus',
      bonus: {
        amount: 'Up to KES 15,000',
        type: '100% Match Bonus',
        wagering: '5x',
        minDeposit: 'KES 100',
        timeLimit: '30 days'
      },
      features: {
        mpesa: true,
        liveStreaming: true,
        mobileApp: false,
        cashOut: false,
        liveChat: true,
        multipleLanguages: true,
      },
      paymentMethods: ['M-Pesa', 'Credit Card', 'Bank Transfer', 'Airtel Money', 'Bitcoin'],
      minDeposit: 'KES 100',
      withdrawalTime: '24-72 hours',
      odds: {
        football: 3.8,
        basketball: 4.1,
        tennis: 4.0,
        average: 4.0
      },
      sportsMarkets: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Rugby', 'Boxing', 'MMA', 'Esports', 'Virtual Sports'],
      pros: [
        'Huge selection of betting markets',
        'Competitive odds',
        'Live streaming available',
        'Cryptocurrency payments',
        'Extensive esports coverage',
        'Good promotional offers'
      ],
      cons: [
        'No mobile app',
        'No cash out feature',
        'Complex website navigation',
        'Slower withdrawal times'
      ],
      overview: '1xBet is known for its extensive betting markets and competitive odds. While they offer a wide range of sports and payment options, their platform can be overwhelming for beginners.',
      affiliateLink: '#',
      slug: '1xbet',
      seoTitle: '1xBet Review 2024 - Extensive Markets & Competitive Odds',
      seoDescription: 'Complete 1xBet review for Kenyan bettors. Explore their massive betting markets, odds, and payment options.',
      lastUpdated: '2024-01-15'
    },
  };

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      const bookmakerData = mockBookmakers[slug];
      if (bookmakerData) {
        setBookmaker(bookmakerData);
      }
      setLoading(false);
    }
  }, [slug]);

  const handleAffiliateClick = (bookmakerName: string, affiliateLink: string) => {
    trackAffiliateClick(bookmakerName, 'review_page', 'claim_bonus');
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar key={i} className="h-5 w-5 text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar key="half" className="h-5 w-5 text-warning fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FiStar key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading review...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!bookmaker) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              Review Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The bookmaker review you're looking for doesn't exist.
            </p>
            <a
              href="/compare"
              className="btn btn-primary"
            >
              View All Bookmakers
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{bookmaker.seoTitle}</title>
        <meta name="description" content={bookmaker.seoDescription} />
        <meta name="keywords" content={`${bookmaker.name}, ${bookmaker.name} review, ${bookmaker.name} Kenya, betting, bookmaker review`} />
        <meta property="og:title" content={bookmaker.seoTitle} />
        <meta property="og:description" content={bookmaker.seoDescription} />
        <meta property="og:image" content={bookmaker.logo} />
        <meta property="og:type" content="article" />
        <meta name="article:published_time" content={bookmaker.lastUpdated} />
        <meta name="article:author" content="BetCompare.co.ke" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">
                  {bookmaker.name} Review
                </h1>
                <p className="text-xl text-primary-100 mb-6">
                  {bookmaker.overview}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {renderStars(bookmaker.rating)}
                  </div>
                  <span className="text-2xl font-bold">{bookmaker.rating}/5</span>
                  <span className="text-primary-200">({bookmaker.reviewCount} reviews)</span>
                </div>
                <button
                  onClick={() => handleAffiliateClick(bookmaker.name, bookmaker.affiliateLink)}
                  className="btn btn-secondary btn-lg"
                >
                  <FiExternalLink className="mr-2" />
                  Claim Bonus
                </button>
              </div>
              <div className="text-center lg:text-right">
                <img
                  src={bookmaker.logo}
                  alt={bookmaker.name}
                  className="h-24 w-auto mx-auto lg:mx-0"
                  onError={(e) => handleImageError(e, bookmaker.name, 'bookmaker')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{bookmaker.bonus.amount}</div>
                <div className="text-sm text-gray-600">Welcome Bonus</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{bookmaker.minDeposit}</div>
                <div className="text-sm text-gray-600">Min Deposit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{bookmaker.withdrawalTime}</div>
                <div className="text-sm text-gray-600">Withdrawal Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{bookmaker.established}</div>
                <div className="text-sm text-gray-600">Established</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-soft mb-8">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Overview', icon: FiAward },
                      { id: 'bonus', label: 'Bonus', icon: FiDollarSign },
                      { id: 'features', label: 'Features', icon: FiSmartphone },
                      { id: 'payments', label: 'Payments', icon: FiCreditCard },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-heading font-semibold mb-4">About {bookmaker.name}</h3>
                        <p className="text-gray-600 mb-4">{bookmaker.overview}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Company Details</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>Established: {bookmaker.established}</li>
                              <li>License: {bookmaker.license}</li>
                              <li>Headquarters: {bookmaker.headquarters}</li>
                            </ul>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Odds Rating</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>Football: {bookmaker.odds.football}/5</li>
                              <li>Basketball: {bookmaker.odds.basketball}/5</li>
                              <li>Tennis: {bookmaker.odds.tennis}/5</li>
                              <li>Average: {bookmaker.odds.average}/5</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-heading font-semibold mb-4">Sports Markets</h3>
                        <div className="flex flex-wrap gap-2">
                          {bookmaker.sportsMarkets.map(sport => (
                            <span
                              key={sport}
                              className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'bonus' && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-secondary to-secondary-dark text-white p-6 rounded-lg">
                        <h3 className="text-xl font-heading font-semibold mb-2">Welcome Bonus</h3>
                        <p className="text-2xl font-bold mb-4">{bookmaker.bonus.amount}</p>
                        <p className="text-secondary-100">{bookmaker.bonus.type}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Bonus Terms</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Wagering: {bookmaker.bonus.wagering}</li>
                            <li>Min Deposit: {bookmaker.bonus.minDeposit}</li>
                            <li>Time Limit: {bookmaker.bonus.timeLimit}</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">How to Claim</h4>
                          <ol className="space-y-1 text-sm text-gray-600 list-decimal list-inside">
                            <li>Click "Claim Bonus" button</li>
                            <li>Register a new account</li>
                            <li>Make your first deposit</li>
                            <li>Bonus credited automatically</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { key: 'mpesa', label: 'M-Pesa Support', icon: FiCreditCard },
                          { key: 'liveStreaming', label: 'Live Streaming', icon: FiPlayCircle },
                          { key: 'mobileApp', label: 'Mobile App', icon: FiSmartphone },
                          { key: 'cashOut', label: 'Cash Out', icon: FiDollarSign },
                          { key: 'liveChat', label: 'Live Chat', icon: FiMessageCircle },
                          { key: 'multipleLanguages', label: 'Multiple Languages', icon: FiAward },
                        ].map(feature => (
                          <div key={feature.key} className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${bookmaker.features[feature.key as keyof typeof bookmaker.features] ? 'bg-success-100 text-success-600' : 'bg-gray-100 text-gray-400'}`}>
                              <feature.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{feature.label}</div>
                              <div className={`text-sm ${bookmaker.features[feature.key as keyof typeof bookmaker.features] ? 'text-success-600' : 'text-gray-500'}`}>
                                {bookmaker.features[feature.key as keyof typeof bookmaker.features] ? 'Available' : 'Not Available'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'payments' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-heading font-semibold mb-4">Payment Methods</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {bookmaker.paymentMethods.map(method => (
                            <div key={method} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                              <FiCreditCard className="h-5 w-5 text-primary" />
                              <span className="text-sm font-medium">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Deposits</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Minimum: {bookmaker.minDeposit}</li>
                            <li>Processing: Instant</li>
                            <li>Fees: Usually free</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Withdrawals</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Processing: {bookmaker.withdrawalTime}</li>
                            <li>Methods: Same as deposits</li>
                            <li>Fees: Varies by method</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Pros & Cons */}
              <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
                <h3 className="text-lg font-heading font-semibold mb-4">Pros & Cons</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-success-600 mb-2 flex items-center">
                      <FiCheck className="h-4 w-4 mr-2" />
                      Pros
                    </h4>
                    <ul className="space-y-1">
                      {bookmaker.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <FiCheck className="h-3 w-3 text-success-500 mr-2 mt-1 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-error-600 mb-2 flex items-center">
                      <FiX className="h-4 w-4 mr-2" />
                      Cons
                    </h4>
                    <ul className="space-y-1">
                      {bookmaker.cons.map((con, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <FiX className="h-3 w-3 text-error-500 mr-2 mt-1 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-6 mb-8">
                <h3 className="text-xl font-heading font-semibold mb-2">Ready to Start?</h3>
                <p className="text-primary-100 mb-4">
                  Claim your {bookmaker.bonus.amount} welcome bonus today!
                </p>
                <button
                  onClick={() => handleAffiliateClick(bookmaker.name, bookmaker.affiliateLink)}
                  className="btn btn-secondary btn-lg w-full"
                >
                  <FiExternalLink className="mr-2" />
                  Join {bookmaker.name}
                </button>
                <p className="text-xs text-primary-200 mt-2 text-center">
                  18+ | Terms & Conditions Apply
                </p>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h3 className="text-lg font-heading font-semibold mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FiShield className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-gray-900">License</div>
                      <div className="text-sm text-gray-600">{bookmaker.license}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiClock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-gray-900">Established</div>
                      <div className="text-sm text-gray-600">{bookmaker.established}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiTrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-gray-900">Rating</div>
                      <div className="text-sm text-gray-600">{bookmaker.rating}/5 ({bookmaker.reviewCount} reviews)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Reviews */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Compare Other Bookmakers
            </h2>
            <div className="text-center">
              <a
                href="/compare"
                className="btn btn-outline btn-lg"
                onClick={() => trackButtonClick('compare_others', 'review_page')}
              >
                View All Comparisons
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookmakerReviewPage; 