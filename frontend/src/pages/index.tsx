import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useResponsiveState } from '../utils/responsive';

// Import responsive components
import { BookmakerGrid, BlogGrid, CompactGrid } from '../components/layout/ResponsiveGrid';
import { ResponsiveHeading1, ResponsiveHeading2, ResponsiveHeading3, ResponsiveBody } from '../components/ui/ResponsiveTypography';
import { SwipeGesture, PullToRefresh, TouchFeedback } from '../components/ui/MobileInteractions';
import ResponsivePerformanceMonitor, { useResponsivePerformanceMetrics } from '../components/ui/ResponsivePerformanceMonitor';

// Import existing components
import BookmakerCard from '../components/ui/BookmakerCard';
import Layout from '../components/layout/Layout';

// Sample data
const featuredBookmakers = [
  {
    id: 1,
    name: "Betika",
    logo: "/logos/betika.png",
    rating: 4.5,
    bonus: "200% up to KES 50,000",
    bonusType: "Welcome Bonus",
    mpesa: true,
    liveStreaming: true,
    mobileApp: true,
    features: ["Live Streaming", "Cash Out", "Mobile App"],
    affiliateLink: "https://betika.com",
    slug: "betika-review"
  },
  {
    id: 2,
    name: "SportPesa",
    logo: "/logos/sportpesa.png",
    rating: 4.2,
    bonus: "100% up to KES 30,000",
    bonusType: "Welcome Bonus",
    mpesa: true,
    liveStreaming: false,
    mobileApp: true,
    features: ["Best Odds", "Mobile App"],
    affiliateLink: "https://sportpesa.co.ke",
    slug: "sportpesa-review"
  },
  {
    id: 3,
    name: "Mozzart Bet",
    logo: "/logos/mozzart.png",
    rating: 4.3,
    bonus: "150% up to KES 40,000",
    bonusType: "Welcome Bonus",
    mpesa: true,
    liveStreaming: true,
    mobileApp: true,
    features: ["Live Streaming", "Statistics", "Mobile App"],
    affiliateLink: "https://mozzartbet.co.ke",
    slug: "mozzart-review"
  }
];

const quickLinks = [
  { title: "Compare Bookmakers", href: "/compare", icon: "📊" },
  { title: "Best Bonuses", href: "/bonuses", icon: "🎁" },
  { title: "Expert Reviews", href: "/reviews", icon: "⭐" },
  { title: "Betting Tips", href: "/blog", icon: "💡" }
];

const blogPosts = [
  {
    id: 1,
    title: "Best Bookmakers for Kenyan Bettors in 2024",
    excerpt: "Complete guide to the top betting sites in Kenya...",
    slug: "best-bookmakers-kenya-2024",
    image: "/blog/bookmakers-2024.jpg",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "How to Use M-Pesa for Sports Betting",
    excerpt: "Step-by-step guide to depositing and withdrawing...",
    slug: "mpesa-sports-betting-guide",
    image: "/blog/mpesa-guide.jpg",
    date: "2024-01-10"
  },
  {
    id: 3,
    title: "Understanding Betting Odds in Kenya",
    excerpt: "Learn how to read and calculate betting odds...",
    slug: "betting-odds-kenya-guide",
    image: "/blog/betting-odds.jpg",
    date: "2024-01-05"
  }
];

const HomePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { device, breakpoint } = useResponsiveState();
  const performanceMetrics = useResponsivePerformanceMetrics();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

  const handleSwipeLeft = useCallback(() => {
    // Navigate to next section or page
    console.log('Swiped left - navigate to compare page');
  }, []);

  const handleSwipeRight = useCallback(() => {
    // Navigate to previous section or page
    console.log('Swiped right - navigate to reviews page');
  }, []);

  return (
    <Layout>
      <Head>
        <title>BetCompare Kenya - Best Bookmakers, Odds & Reviews</title>
        <meta name="description" content="Compare the best bookmakers in Kenya. Find the highest odds, best bonuses, and M-Pesa payment options. Expert reviews and betting tips." />
        <meta name="keywords" content="Kenya betting, bookmakers, sports betting, M-Pesa betting, odds comparison" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://betcompare.co.ke" />
        
        {/* Open Graph */}
        <meta property="og:title" content="BetCompare Kenya - Best Bookmakers & Odds" />
        <meta property="og:description" content="Compare the best bookmakers in Kenya. Find the highest odds, best bonuses, and M-Pesa payment options." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://betcompare.co.ke" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BetCompare Kenya - Best Bookmakers & Odds" />
        <meta name="twitter:description" content="Compare the best bookmakers in Kenya. Find the highest odds, best bonuses, and M-Pesa payment options." />
        <meta name="twitter:image" content="/twitter-image.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "BetCompare Kenya",
              url: "https://betcompare.co.ke",
              description: "Compare the best bookmakers in Kenya",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://betcompare.co.ke/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      {/* Performance Monitor */}
      <ResponsivePerformanceMonitor 
        enabled={true}
        showDebugOverlay={process.env.NODE_ENV === 'development'}
        alertThresholds={{ 
          layoutShift: 0.1, 
          imageLoadTime: 1500, 
          touchLatency: 100 
        }}
      />

      {/* Pull to Refresh Wrapper */}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <SwipeGesture 
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            className="hero-section"
          >
            <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 text-white py-16 md:py-24">
              <div className="container mx-auto px-4 text-center">
                <ResponsiveHeading1 className="mb-6 text-white">
                  Find Kenya's Best Bookmakers
                </ResponsiveHeading1>
                <ResponsiveBody className="mb-8 text-gray-200 max-w-2xl mx-auto">
                  Compare odds, bonuses, and features from top betting sites in Kenya. 
                  Find the perfect bookmaker with M-Pesa support and the best odds.
                </ResponsiveBody>
                <TouchFeedback haptic={true}>
                  <Link href="/compare" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                    Start Comparing Now
                  </Link>
                </TouchFeedback>
              </div>
            </section>
          </SwipeGesture>

          {/* Quick Links Section */}
          <div className="container mx-auto px-4 py-8">
            <CompactGrid
              gap={16}
              className="mb-12"
            >
              {quickLinks.map((link, index) => (
                <TouchFeedback key={index} visual={true}>
                  <Link 
                    href={link.href}
                    className="block bg-white rounded-lg shadow-md hover:shadow-lg p-6 text-center transition-all duration-200 transform hover:scale-105 border-2 border-transparent hover:border-orange-500"
                  >
                    <div className="text-3xl mb-2">{link.icon}</div>
                    <ResponsiveHeading3 className="text-gray-800">
                      {link.title}
                    </ResponsiveHeading3>
                  </Link>
                </TouchFeedback>
              ))}
            </CompactGrid>
          </div>

          {/* Featured Bookmakers Section */}
          <section className="container mx-auto px-4 py-12">
            <ResponsiveHeading2 className="text-center mb-8 text-gray-900">
              Top Rated Bookmakers
            </ResponsiveHeading2>
            
            <TouchFeedback visual={true}>
              <BookmakerGrid className="mb-8">
                <BookmakerCard
                  variant="card"
                  showFeatures={true}
                  className="transform hover:scale-105 transition-all duration-200"
                  {...featuredBookmakers[0]}
                />
              </BookmakerGrid>
            </TouchFeedback>

            <div className="text-center">
              <TouchFeedback haptic={true}>
                <Link 
                  href="/compare" 
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  View All Bookmakers
                </Link>
              </TouchFeedback>
            </div>
          </section>

          {/* Top Bonuses Section */}
          <section className="bg-white py-12">
            <div className="container mx-auto px-4">
              <ResponsiveHeading2 className="text-center mb-8 text-gray-900">
                Best Welcome Bonuses
              </ResponsiveHeading2>
              
              <BookmakerGrid>
                {featuredBookmakers.map((bookmaker, index) => (
                  <TouchFeedback key={index} visual={true}>
                    <BookmakerCard
                      variant="card"
                      showFeatures={true}
                      className="transform hover:scale-105 transition-all duration-200"
                      {...bookmaker}
                    />
                  </TouchFeedback>
                ))}
              </BookmakerGrid>
            </div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 py-12">
            <ResponsiveHeading2 className="text-center mb-8 text-gray-900">
              Why Choose BetCompare?
            </ResponsiveHeading2>
            
            <TouchFeedback visual={true}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <ResponsiveHeading3 className="mb-2">Fast Comparison</ResponsiveHeading3>
                  <ResponsiveBody className="text-gray-600">
                    Compare odds and bonuses from multiple bookmakers in seconds
                  </ResponsiveBody>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🔒</div>
                  <ResponsiveHeading3 className="mb-2">Safe & Secure</ResponsiveHeading3>
                  <ResponsiveBody className="text-gray-600">
                    Only licensed and regulated bookmakers with proven track records
                  </ResponsiveBody>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <ResponsiveHeading3 className="mb-2">Mobile First</ResponsiveHeading3>
                  <ResponsiveBody className="text-gray-600">
                    Optimized for mobile betting with M-Pesa integration
                  </ResponsiveBody>
                </div>
              </div>
            </TouchFeedback>
          </section>

          {/* Blog Section */}
          <section className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
              <ResponsiveHeading2 className="text-center mb-8 text-gray-900">
                Latest Betting News & Tips
              </ResponsiveHeading2>
              
              <BlogGrid>
                {blogPosts.map((post, index) => (
                  <TouchFeedback key={index} visual={true}>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="block bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-all duration-200 transform hover:scale-105"
                    >
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">📰</span>
                      </div>
                      <div className="p-6">
                        <ResponsiveHeading3 className="mb-2 text-gray-900">
                          {post.title}
                        </ResponsiveHeading3>
                        <ResponsiveBody className="text-gray-600 mb-4">
                          {post.excerpt}
                        </ResponsiveBody>
                        <div className="text-sm text-gray-500">
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  </TouchFeedback>
                ))}
              </BlogGrid>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <ResponsiveHeading2 className="mb-4 text-white">
                Ready to Start Betting?
              </ResponsiveHeading2>
              <ResponsiveBody className="mb-8 text-orange-100">
                Join thousands of Kenyan bettors who trust BetCompare to find the best odds and bonuses
              </ResponsiveBody>
              <TouchFeedback haptic={true}>
                <Link 
                  href="/compare" 
                  className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  Compare Bookmakers Now
                </Link>
              </TouchFeedback>
            </div>
          </section>
        </div>
      </PullToRefresh>
    </Layout>
  );
};

export default HomePage; 