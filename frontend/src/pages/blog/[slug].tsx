import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { 
  FiCalendar, 
  FiUser, 
  FiClock, 
  FiShare2,
  FiBookmark,
  FiThumbsUp,
  FiMessageCircle,
  FiTrendingUp,
  FiArrowLeft,
  FiExternalLink,
  FiChevronRight
} from 'react-icons/fi';

// Components
import Layout from '../../components/layout/Layout';

// Utils
import { trackButtonClick, trackAffiliateClick } from '../../utils/analytics';
import { handleImageError, generateBookmakerPlaceholder } from '../../utils/imageUtils';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  image: string;
  views: number;
  likes: number;
  comments: number;
  relatedPosts: number[];
}

const BlogPostPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle author image error
  const handleAuthorImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, authorName: string) => {
    const target = e.target as HTMLImageElement;
    const initials = authorName.split(' ').map(name => name.charAt(0)).join('');
    target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#e5e7eb"/>
        <text x="32" y="38" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#6b7280">${initials}</text>
      </svg>
    `)}`;
  };

  // Mock data - in real app, this would come from API
  const mockPost: BlogPost = {
    id: 1,
    title: 'MelBet vs Betway: Which Bookmaker is Better for Kenyan Bettors?',
    slug: 'melbet-vs-betway-comparison',
    excerpt: 'Compare MelBet and Betway head-to-head on odds, bonuses, payment methods, and user experience to find the best choice for Kenyan bettors.',
    content: `
      <div class="prose max-w-none">
        <p class="text-lg text-gray-700 mb-6">When it comes to online betting in Kenya, two names consistently stand out: MelBet and Betway. Both platforms have carved out significant market share, but which one truly offers the better experience for Kenyan bettors? In this comprehensive comparison, we'll analyze every aspect that matters to help you make an informed decision.</p>

        <h2 class="text-2xl font-heading font-bold text-gray-900 mt-8 mb-4">Overview: MelBet vs Betway</h2>
        
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">MelBet</h3>
              <ul class="space-y-2 text-gray-600">
                <li>• Licensed by Curacao</li>
                <li>• Over 1,000 betting markets</li>
                <li>• Strong focus on live betting</li>
                <li>• Cryptocurrency accepted</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Betway</h3>
              <ul class="space-y-2 text-gray-600">
                <li>• Licensed by Malta Gaming Authority</li>
                <li>• 900+ betting markets</li>
                <li>• Excellent mobile app</li>
                <li>• Strong brand reputation</li>
                <li>• Responsible gambling focus</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-heading font-bold text-gray-900 mt-8 mb-4">Welcome Bonuses Comparison</h2>
        
        <div class="overflow-x-auto mb-6">
          <table class="w-full border-collapse bg-white rounded-lg shadow-soft">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Aspect</th>
                <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">MelBet</th>
                <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Betway</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-200 px-4 py-3 font-medium text-gray-900">Bonus Type</td>
                <td class="border border-gray-200 px-4 py-3 text-gray-600">100% Match Bonus</td>
                <td class="border border-gray-200 px-4 py-3 text-gray-600">Free Bet</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-gray-200 px-4 py-3 font-medium text-gray-900">Maximum Amount</td>
                <td class="border border-gray-200 px-4 py-3 text-gray-600">KES 20,000</td>
                <td class="border border-gray-200 px-4 py-3 text-gray-600">KES 1,000</td>
              </tr>
              <tr>
                <td class="border border-gray-200 px-4 py-3 font-medium text-gray-900">Minimum Deposit</td>
                <td class="border border-gray-200 px-4 py-3 text-gray-600">KES 200</td>
                <td class="border border-gray-200 px-4 py-3 text-gray-600">KES 100</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-gray-200 px-4 py-3 font-medium text-gray-900">Wagering Requirements</td>
                <td class="border border-gray-200 px-4 py-3 text-gray-600">5x</td>
                <td class="border border-gray-200 px-4 py-3 text-gray-600">5x</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-primary-800 mb-3">💡 Winner: MelBet</h3>
          <p class="text-primary-700">MelBet offers significantly higher bonus value (up to KES 20,000) compared to Betway's KES 1,000 free bet. However, Betway's lower minimum deposit makes it more accessible for beginners.</p>
        </div>

        <h2 class="text-2xl font-heading font-bold text-gray-900 mt-8 mb-4">Payment Methods & M-Pesa Support</h2>
        
        <p class="text-gray-700 mb-4">For Kenyan bettors, M-Pesa support is crucial. Both platforms recognize this and offer comprehensive mobile money integration:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow-soft p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">MelBet Payment Options</h3>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> M-Pesa (Instant)</li>
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> Airtel Money</li>
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> Bank Transfer</li>
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> Cryptocurrency</li>
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> Skrill/Neteller</li>
            </ul>
          </div>
          <div class="bg-white rounded-lg shadow-soft p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Betway Payment Options</h3>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> M-Pesa (Instant)</li>
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> Airtel Money</li>
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> Bank Transfer</li>
              <li class="flex items-center"><span class="text-error-500 mr-2">✗</span> Cryptocurrency</li>
              <li class="flex items-center"><span class="text-success-500 mr-2">✓</span> Skrill/Neteller</li>
            </ul>
          </div>
        </div>

        <h2 class="text-2xl font-heading font-bold text-gray-900 mt-8 mb-4">Odds Comparison</h2>
        
        <p class="text-gray-700 mb-4">We analyzed odds across 100+ football matches over a month to determine which platform offers better value:</p>
        
        <div class="bg-white rounded-lg shadow-soft p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div class="text-3xl font-bold text-primary mb-2">94.5%</div>
              <div class="text-gray-600">MelBet Average Payout</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-secondary mb-2">95.2%</div>
              <div class="text-gray-600">Betway Average Payout</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-success mb-2">+0.7%</div>
              <div class="text-gray-600">Betway Advantage</div>
            </div>
          </div>
        </div>

        <div class="bg-secondary-50 border border-secondary-200 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-secondary-800 mb-3">💡 Winner: Betway</h3>
          <p class="text-secondary-700">Betway consistently offers better odds across most markets, with an average payout rate that's 0.7% higher than MelBet. This might seem small, but it adds up over time for regular bettors.</p>
        </div>

        <h2 class="text-2xl font-heading font-bold text-gray-900 mt-8 mb-4">Mobile Experience</h2>
        
        <p class="text-gray-700 mb-4">Both platforms offer mobile apps and mobile-optimized websites. Here's how they compare:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow-soft p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">MelBet Mobile</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">App Store Rating</span>
                <span class="font-semibold text-gray-900">4.2/5</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Loading Speed</span>
                <span class="font-semibold text-gray-900">Good</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Live Betting</span>
                <span class="font-semibold text-success-600">Excellent</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">User Interface</span>
                <span class="font-semibold text-gray-900">Good</span>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-soft p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Betway Mobile</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">App Store Rating</span>
                <span class="font-semibold text-gray-900">4.6/5</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Loading Speed</span>
                <span class="font-semibold text-success-600">Excellent</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Live Betting</span>
                <span class="font-semibold text-gray-900">Good</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">User Interface</span>
                <span class="font-semibold text-success-600">Excellent</span>
              </div>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-heading font-bold text-gray-900 mt-8 mb-4">Final Verdict</h2>
        
        <div class="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8 mb-6">
          <h3 class="text-2xl font-heading font-bold mb-4">The Winner: It Depends on Your Needs</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-lg font-semibold mb-3">Choose MelBet if you:</h4>
              <ul class="space-y-2 text-primary-100">
                <li>• Want a higher welcome bonus</li>
                <li>• Love live betting</li>
                <li>• Use cryptocurrency</li>
                <li>• Prefer more betting markets</li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold mb-3">Choose Betway if you:</h4>
              <ul class="space-y-2 text-primary-100">
                <li>• Want better odds</li>
                <li>• Prefer a premium mobile app</li>
                <li>• Value brand reputation</li>
                <li>• Are a beginner bettor</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-warning-800 mb-3">⚠️ Important Reminder</h3>
          <p class="text-warning-700">Remember to always bet responsibly. Set limits, never chase losses, and only bet what you can afford to lose. Both platforms offer responsible gambling tools to help you stay in control.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a href="#" class="btn btn-primary btn-lg" onclick="trackAffiliateClick('MelBet', 'blog_post', 'cta_button')">
            Try MelBet
          </a>
          <a href="#" class="btn btn-secondary btn-lg" onclick="trackAffiliateClick('Betway', 'blog_post', 'cta_button')">
            Try Betway
          </a>
        </div>
      </div>
    `,
    author: {
      name: 'David Wanjiku',
      avatar: '/images/authors/david-wanjiku.jpg',
      bio: 'David is a sports betting expert with over 8 years of experience in the Kenyan betting market. He specializes in football betting strategies and bookmaker analysis.'
    },
    category: 'comparison',
    tags: ['MelBet', 'Betway', 'Comparison', 'Kenya', 'Review'],
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readTime: 8,
    image: '/images/blog/melbet-vs-betway.jpg',
    views: 1250,
    likes: 89,
    comments: 23,
    relatedPosts: [2, 3, 4]
  };

  const mockRelatedPosts: BlogPost[] = [
    {
      id: 2,
      title: 'Complete Guide to M-Pesa Betting in Kenya',
      slug: 'mpesa-betting-guide-kenya',
      excerpt: 'Everything you need to know about using M-Pesa for betting: how to deposit, withdraw, fees, and the best M-Pesa betting sites in Kenya.',
      content: '',
      author: {
        name: 'Sarah Mwangi',
        avatar: '/images/authors/sarah-mwangi.jpg',
        bio: 'Sarah is a fintech expert specializing in mobile payments and betting transactions.'
      },
      category: 'guides',
      tags: ['M-Pesa', 'Payments', 'Guide'],
      publishedAt: '2024-01-12',
      updatedAt: '2024-01-12',
      readTime: 12,
      image: '/images/blog/mpesa-betting-guide.jpg',
      views: 2100,
      likes: 65,
      comments: 18,
      relatedPosts: [1, 3, 4]
    },
    {
      id: 3,
      title: '10 Common Betting Mistakes to Avoid as a Beginner',
      slug: 'betting-mistakes-beginners-avoid',
      excerpt: 'Learn about the most common betting mistakes that beginners make and how to avoid them. Improve your betting strategy with these expert tips.',
      content: '',
      author: {
        name: 'James Kiprotich',
        avatar: '/images/authors/james-kiprotich.jpg',
        bio: 'James is a professional betting analyst with extensive experience in risk management.'
      },
      category: 'tips',
      tags: ['Beginners', 'Tips', 'Strategy'],
      publishedAt: '2024-01-10',
      updatedAt: '2024-01-10',
      readTime: 6,
      image: '/images/blog/betting-mistakes.jpg',
      views: 890,
      likes: 43,
      comments: 12,
      relatedPosts: [1, 2, 4]
    },
    {
      id: 4,
      title: 'Understanding Betting Odds: A Complete Guide for Kenyan Bettors',
      slug: 'betting-odds-guide-kenya',
      excerpt: 'Master the art of reading betting odds with our comprehensive guide. Learn about decimal odds, probability, and how to calculate potential winnings.',
      content: '',
      author: {
        name: 'Michael Ochieng',
        avatar: '/images/authors/michael-ochieng.jpg',
        bio: 'Michael is a mathematics professor turned betting consultant with deep expertise in probability theory.'
      },
      category: 'guides',
      tags: ['Odds', 'Guide', 'Education'],
      publishedAt: '2024-01-08',
      updatedAt: '2024-01-08',
      readTime: 10,
      image: '/images/blog/betting-odds-guide.jpg',
      views: 1560,
      likes: 78,
      comments: 25,
      relatedPosts: [1, 2, 3]
    }
  ];

  useEffect(() => {
    if (slug) {
      // Simulate API call
      setTimeout(() => {
        setPost(mockPost);
        setRelatedPosts(mockRelatedPosts);
        setLoading(false);
      }, 500);
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    trackButtonClick('like_post', 'blog_post');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    trackButtonClick('bookmark_post', 'blog_post');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
    trackButtonClick('share_post', 'blog_post');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Link href="/blog" className="btn btn-primary">
              Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{post.title} | BetCompare.co.ke</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta name="author" content={post.author.name} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-primary">Home</Link>
              <FiChevronRight className="h-4 w-4" />
              <Link href="/blog" className="hover:text-primary">Blog</Link>
              <FiChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-primary hover:text-primary-dark"
              >
                <FiArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </div>

            <div className="mb-6">
              <span className="bg-primary-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => handleAuthorImageError(e, post.author.name)}
                />
                <div>
                  <div className="font-semibold text-gray-900">{post.author.name}</div>
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <FiCalendar className="h-4 w-4 mr-1" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="h-4 w-4 mr-1" />
                      {post.readTime} min read
                    </div>
                    <div className="flex items-center">
                      <FiTrendingUp className="h-4 w-4 mr-1" />
                      {post.views} views
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FiThumbsUp className="h-4 w-4" />
                  <span>{post.likes + (isLiked ? 1 : 0)}</span>
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FiBookmark className="h-4 w-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiShare2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
                onError={(e) => handleImageError(e, post.title, 'blog')}
              />
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full"
                  onError={(e) => handleAuthorImageError(e, post.author.name)}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                    About {post.author.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.author.bio}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiUser className="h-4 w-4 mr-1" />
                      Author
                    </div>
                    <div className="flex items-center">
                      <FiMessageCircle className="h-4 w-4 mr-1" />
                      {post.comments} comments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <article key={relatedPost.id} className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => handleImageError(e, relatedPost.title, 'blog')}
                    />
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="bg-primary-100 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          {relatedPost.category.charAt(0).toUpperCase() + relatedPost.category.slice(1)}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiClock className="h-4 w-4 mr-1" />
                          {relatedPost.readTime} min
                        </div>
                      </div>
                      <h3 className="text-lg font-heading font-bold text-gray-900 mb-3 hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiCalendar className="h-4 w-4 mr-1" />
                          {formatDate(relatedPost.publishedAt)}
                        </div>
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                          onClick={() => trackButtonClick('related_post', 'blog_post')}
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h2 className="text-2xl font-heading font-bold mb-4">
              Ready to Start Betting?
            </h2>
            <p className="text-primary-100 mb-8">
              Use our comparison tools to find the perfect bookmaker for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/compare"
                className="btn btn-secondary btn-lg"
                onClick={() => trackButtonClick('compare_cta', 'blog_post')}
              >
                Compare Bookmakers
              </Link>
              <Link
                href="/bonuses"
                className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary"
                onClick={() => trackButtonClick('bonuses_cta', 'blog_post')}
              >
                View Bonuses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPostPage; 