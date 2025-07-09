import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiSearch, FiCalendar, FiUser, FiClock, FiTag, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { useQuery } from 'react-query';

// Components
import Layout from '../../components/layout/Layout';

// Utils
import { trackButtonClick } from '../../utils/analytics';
import { generateBlogPlaceholder, handleImageError } from '../../utils/imageUtils';

// Types
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  image?: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

const BlogIndexPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Fetch blog posts
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery<BlogPost[]>('blog-posts', async () => {
    const response = await fetch('/api/blog');
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    return response.json();
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>('blog-categories', async () => {
    const response = await fetch('/api/blog/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  });

  // Filter and sort posts
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'publishedAt':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'readTime':
        return a.readTime - b.readTime;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil((filteredPosts?.length || 0) / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts?.slice(startIndex, startIndex + postsPerPage);

  const handlePostClick = (post: BlogPost) => {
    trackButtonClick('read_blog_post', `blog_${post.slug}`);
    router.push(`/blog/${post.slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const featuredPosts = posts?.filter(post => post.featured).slice(0, 3);

  if (postsLoading) return (
    <Layout title="Loading Blog Posts...">
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </Layout>
  );
  
  if (postsError) return (
    <Layout title="Error Loading Blog Posts">
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load blog posts</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout
      title="Betting Guides & News - BetCompare.co.ke"
      description="Expert betting guides, tips, and latest news from Kenya's betting industry. Learn strategies, understand odds, and stay updated with betting trends."
      keywords="betting guides Kenya, betting tips, sports betting strategies, betting news Kenya, how to bet, betting tutorials"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Betting Guides & News
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
              Expert insights, betting strategies, and the latest news from Kenya's betting industry. 
              Improve your betting skills with our comprehensive guides.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-4">
                Featured Articles
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our most popular and insightful articles to help you become a better bettor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img
                      src={post.image || generateBlogPlaceholder(post.title)}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => handleImageError(e, generateBlogPlaceholder(post.title))}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="ml-3 text-sm text-gray-500 flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {post.readTime} min read
                      </span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="w-4 h-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <FiCalendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="py-8 bg-neutral-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="publishedAt">Latest First</option>
                <option value="title">Title A-Z</option>
                <option value="readTime">Read Time</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {paginatedPosts?.length || 0} of {filteredPosts?.length || 0} articles
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts?.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={post.image || generateBlogPlaceholder(post.title)}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => handleImageError(e, generateBlogPlaceholder(post.title))}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="ml-3 text-sm text-gray-500 flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      {post.readTime} min read
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        <FiTag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="w-4 h-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <FiCalendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <button className="text-primary hover:text-primary-600 font-medium text-sm inline-flex items-center">
                      Read More
                      <FiArrowRight className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* No Results */}
          {paginatedPosts?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === index + 1
                        ? 'bg-primary text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
            Stay Updated with the Latest
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for weekly betting tips, industry news, and exclusive insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <button
              onClick={() => trackButtonClick('newsletter_signup', 'blog_bottom')}
              className="btn btn-secondary btn-lg"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogIndexPage; 