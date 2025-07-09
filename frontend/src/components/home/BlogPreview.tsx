import React from 'react';
import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowRight, FiClock } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';
import { handleImageError } from '../../utils/imageUtils';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
}

const BlogPreview: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'MelBet vs Betway: Which Offers Better Odds for Kenyan Bettors?',
      excerpt: 'A comprehensive comparison of two popular bookmakers in Kenya, analyzing their odds, bonuses, and features.',
      slug: 'melbet-vs-betway-odds-comparison',
      author: 'David Kimani',
      publishedAt: '2024-01-15',
      readTime: '5 min read',
      category: 'Comparison',
      image: '/images/blog/melbet-vs-betway.jpg',
      featured: true,
    },
    {
      id: 2,
      title: 'How to Use M-Pesa for Betting: Complete Guide 2024',
      excerpt: 'Learn how to deposit and withdraw using M-Pesa across different betting platforms in Kenya.',
      slug: 'mpesa-betting-guide-2024',
      author: 'Sarah Wanjiku',
      publishedAt: '2024-01-12',
      readTime: '7 min read',
      category: 'Guide',
      image: '/images/blog/mpesa-betting-guide.jpg',
      featured: false,
    },
    {
      id: 3,
      title: 'Top 5 Betting Mistakes Every Kenyan Bettor Should Avoid',
      excerpt: 'Common betting mistakes that can cost you money and how to avoid them for better results.',
      slug: 'betting-mistakes-to-avoid',
      author: 'Michael Ochieng',
      publishedAt: '2024-01-10',
      readTime: '4 min read',
      category: 'Tips',
      image: '/images/blog/betting-mistakes.jpg',
      featured: false,
    },
    {
      id: 4,
      title: 'Understanding Betting Odds: A Beginner\'s Guide',
      excerpt: 'Everything you need to know about betting odds, how they work, and how to read them effectively.',
      slug: 'understanding-betting-odds-guide',
      author: 'Grace Muthoni',
      publishedAt: '2024-01-08',
      readTime: '6 min read',
      category: 'Education',
      image: '/images/blog/betting-odds-guide.jpg',
      featured: false,
    },
  ];

  const handleReadMore = (slug: string, title: string) => {
    trackButtonClick('read_blog_post', 'blog_preview');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {blogPosts.map((post) => (
        <div
          key={post.id}
          className={`card hover:shadow-medium transition-all duration-300 group overflow-hidden ${
            post.featured ? 'md:col-span-2' : ''
          }`}
        >
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg mb-4">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => handleImageError(e, post.title, 'blog')}
            />
            {post.featured && (
              <div className="absolute top-3 left-3">
                <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-heading font-semibold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
              {post.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <FiUser className="h-3 w-3 mr-1" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="h-3 w-3 mr-1" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>
              <div className="flex items-center">
                <FiClock className="h-3 w-3 mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Read More Button */}
            <Link
              href={`/blog/${post.slug}`}
              onClick={() => handleReadMore(post.slug, post.title)}
              className="btn btn-outline btn-sm inline-flex items-center justify-center group-hover:btn-primary transition-all"
            >
              Read More
              <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogPreview; 