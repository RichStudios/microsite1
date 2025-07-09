const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog post content is required'],
    minlength: [100, 'Content must be at least 100 characters']
  },
  htmlContent: {
    type: String // Processed HTML content
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['comparison', 'guide', 'news', 'review', 'bonus-spotlight', 'tips', 'analysis'],
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  gallery: [{
    url: String,
    alt: String,
    caption: String
  }],
  author: {
    name: {
      type: String,
      required: true,
      default: 'BetCompare Team'
    },
    bio: String,
    avatar: String,
    socialLinks: {
      twitter: String,
      linkedin: String,
      facebook: String
    }
  },
  relatedBookmakers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookmaker'
  }],
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost'
  }],
  comparisonData: {
    bookmaker1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookmaker'
    },
    bookmaker2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookmaker'
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookmaker'
    },
    comparisonPoints: [{
      category: String,
      bookmaker1Score: Number,
      bookmaker2Score: Number,
      winner: String,
      explanation: String
    }]
  },
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String,
    focusKeyword: String,
    readabilityScore: Number,
    seoScore: Number
  },
  socialMedia: {
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image'
    },
    ogImage: String,
    ogDescription: String
  },
  metrics: {
    readingTime: {
      type: Number,
      default: 0 // in minutes
    },
    wordCount: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    bounceRate: {
      type: Number,
      default: 0
    },
    avgTimeOnPage: {
      type: Number,
      default: 0
    }
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  scheduledFor: Date,
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft'
  },
  priority: {
    type: Number,
    default: 0
  },
  tableOfContents: [{
    level: Number,
    title: String,
    anchor: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  callToAction: {
    enabled: {
      type: Boolean,
      default: true
    },
    text: String,
    buttonText: String,
    buttonUrl: String,
    bookmaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookmaker'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ category: 1, publishedAt: -1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ status: 1, isPublished: 1 });
BlogPostSchema.index({ isFeatured: -1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Virtual for URL
BlogPostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Virtual for formatted publish date
BlogPostSchema.virtual('formattedDate').get(function() {
  return this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware
BlogPostSchema.pre('save', function(next) {
  // Generate slug from title
  if (!this.slug || this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  
  // Calculate word count and reading time
  if (this.isModified('content')) {
    // Strip HTML tags for word count
    const textContent = this.content.replace(/<[^>]*>/g, '');
    this.metrics.wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    this.metrics.readingTime = Math.ceil(this.metrics.wordCount / 200); // 200 words per minute
  }
  
  // Set SEO defaults
  if (!this.seoData.metaTitle) {
    this.seoData.metaTitle = this.title + ' | BetCompare.co.ke';
  }
  
  if (!this.seoData.metaDescription && this.excerpt) {
    this.seoData.metaDescription = this.excerpt;
  } else if (!this.seoData.metaDescription && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.seoData.metaDescription = plainText.substring(0, 160) + '...';
  }
  
  // Generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 300) + '...';
  }
  
  // Generate table of contents
  if (this.isModified('content')) {
    this.tableOfContents = this.generateTableOfContents();
  }
  
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Method to generate table of contents
BlogPostSchema.methods.generateTableOfContents = function() {
  const headingRegex = /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/gi;
  const toc = [];
  let match;
  
  while ((match = headingRegex.exec(this.content)) !== null) {
    const level = parseInt(match[1]);
    const title = match[2].trim();
    const anchor = slugify(title, { lower: true, strict: true });
    
    toc.push({
      level,
      title,
      anchor
    });
  }
  
  return toc;
};

// Method to increment views
BlogPostSchema.methods.incrementViews = function() {
  this.metrics.views += 1;
  return this.save();
};

// Method to increment shares
BlogPostSchema.methods.incrementShares = function() {
  this.metrics.shares += 1;
  return this.save();
};

// Method to increment likes
BlogPostSchema.methods.incrementLikes = function() {
  this.metrics.likes += 1;
  return this.save();
};

// Method to check if post is published
BlogPostSchema.methods.isPublishedPost = function() {
  return this.status === 'published' && this.isPublished;
};

// Method to get related posts
BlogPostSchema.methods.getRelatedPosts = function(limit = 3) {
  const tags = this.tags;
  const category = this.category;
  
  return this.constructor.find({
    _id: { $ne: this._id },
    status: 'published',
    isPublished: true,
    $or: [
      { tags: { $in: tags } },
      { category: category }
    ]
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select('title slug excerpt featuredImage publishedAt category')
    .exec();
};

// Static method to get published posts
BlogPostSchema.statics.getPublished = function(options = {}) {
  const {
    page = 1,
    limit = 10,
    category = null,
    tag = null,
    sortBy = 'publishedAt',
    sortOrder = 'desc'
  } = options;

  const filters = {
    status: 'published',
    isPublished: true
  };
  
  if (category) {
    filters.category = category;
  }
  
  if (tag) {
    filters.tags = { $in: [tag] };
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(filters)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('relatedBookmakers', 'name slug logo rating')
    .exec();
};

// Static method to get featured posts
BlogPostSchema.statics.getFeatured = function(limit = 5) {
  return this.find({
    status: 'published',
    isPublished: true,
    isFeatured: true
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('relatedBookmakers', 'name slug logo rating')
    .exec();
};

// Static method to get posts by category
BlogPostSchema.statics.getByCategory = function(category, options = {}) {
  const { page = 1, limit = 10 } = options;
  
  return this.find({
    category: category,
    status: 'published',
    isPublished: true
  })
    .sort({ publishedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('relatedBookmakers', 'name slug logo rating')
    .exec();
};

// Static method for search
BlogPostSchema.statics.search = function(query, options = {}) {
  const {
    page = 1,
    limit = 10,
    category = null
  } = options;

  const filters = {
    status: 'published',
    isPublished: true
  };
  
  if (query) {
    filters.$text = { $search: query };
  }
  
  if (category) {
    filters.category = category;
  }

  return this.find(filters)
    .sort({ publishedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('relatedBookmakers', 'name slug logo rating')
    .exec();
};

// Static method to get comparison posts
BlogPostSchema.statics.getComparisons = function(limit = 10) {
  return this.find({
    category: 'comparison',
    status: 'published',
    isPublished: true,
    'comparisonData.bookmaker1': { $exists: true },
    'comparisonData.bookmaker2': { $exists: true }
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('comparisonData.bookmaker1', 'name slug logo rating')
    .populate('comparisonData.bookmaker2', 'name slug logo rating')
    .populate('comparisonData.winner', 'name slug logo rating')
    .exec();
};

module.exports = mongoose.model('BlogPost', BlogPostSchema); 