const mongoose = require('mongoose');
const slugify = require('slugify');

const ReviewSchema = new mongoose.Schema({
  bookmaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookmaker',
    required: [true, 'Bookmaker reference is required']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  summary: {
    pros: [{
      type: String,
      maxlength: [200, 'Pro point cannot exceed 200 characters']
    }],
    cons: [{
      type: String,
      maxlength: [200, 'Con point cannot exceed 200 characters']
    }],
    verdict: {
      type: String,
      maxlength: [1000, 'Verdict cannot exceed 1000 characters']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },
  sections: {
    overview: {
      type: String,
      maxlength: [5000, 'Overview cannot exceed 5000 characters']
    },
    oddsAndMarkets: {
      type: String,
      maxlength: [3000, 'Odds and Markets section cannot exceed 3000 characters']
    },
    bonusesAndPromotions: {
      type: String,
      maxlength: [3000, 'Bonuses section cannot exceed 3000 characters']
    },
    mobileExperience: {
      type: String,
      maxlength: [2000, 'Mobile Experience section cannot exceed 2000 characters']
    },
    depositsWithdrawals: {
      type: String,
      maxlength: [3000, 'Deposits/Withdrawals section cannot exceed 3000 characters']
    },
    customerSupport: {
      type: String,
      maxlength: [2000, 'Customer Support section cannot exceed 2000 characters']
    },
    securityAndLicensing: {
      type: String,
      maxlength: [2000, 'Security section cannot exceed 2000 characters']
    },
    finalVerdict: {
      type: String,
      maxlength: [1500, 'Final Verdict cannot exceed 1500 characters']
    }
  },
  ratings: {
    odds: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    bonuses: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    mobile: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    support: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    payout: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    overall: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  highlights: [{
    icon: String,
    title: String,
    description: String
  }],
  author: {
    name: {
      type: String,
      required: true,
      default: 'BetCompare Team'
    },
    bio: String,
    avatar: String,
    expertise: [String]
  },
  featuredImage: String,
  gallery: [String],
  tags: [String],
  relatedBookmakers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookmaker'
  }],
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String,
    focusKeyword: String
  },
  readingTime: {
    type: Number,
    default: 0 // in minutes
  },
  wordCount: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
ReviewSchema.index({ slug: 1 });
ReviewSchema.index({ bookmaker: 1 });
ReviewSchema.index({ publishedAt: -1 });
ReviewSchema.index({ status: 1, isPublished: 1 });
ReviewSchema.index({ 'summary.rating': -1 });
ReviewSchema.index({ title: 'text', 'sections.overview': 'text' });

// Virtual for URL
ReviewSchema.virtual('url').get(function() {
  return `/review/${this.slug}`;
});

// Pre-save middleware to generate slug and calculate metrics
ReviewSchema.pre('save', function(next) {
  // Generate slug from title
  if (!this.slug || this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  
  // Calculate overall rating
  if (this.isModified('ratings')) {
    const ratings = this.ratings;
    const ratingValues = [ratings.odds, ratings.bonuses, ratings.mobile, ratings.support, ratings.payout];
    const average = ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length;
    this.ratings.overall = Math.round(average * 10) / 10;
    this.summary.rating = this.ratings.overall;
  }
  
  // Calculate word count and reading time
  if (this.isModified('sections')) {
    const allText = Object.values(this.sections).join(' ');
    this.wordCount = allText.split(/\s+/).filter(word => word.length > 0).length;
    this.readingTime = Math.ceil(this.wordCount / 200); // Average reading speed: 200 words per minute
  }
  
  // Set SEO defaults
  if (!this.seoData.metaTitle) {
    this.seoData.metaTitle = this.title + ' | BetCompare.co.ke';
  }
  
  if (!this.seoData.metaDescription && this.sections.overview) {
    this.seoData.metaDescription = this.sections.overview.substring(0, 160) + '...';
  }
  
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Method to increment views
ReviewSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment shares
ReviewSchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save();
};

// Method to check if review is published
ReviewSchema.methods.isPublishedReview = function() {
  return this.status === 'published' && this.isPublished;
};

// Method to get excerpt
ReviewSchema.methods.getExcerpt = function(length = 150) {
  if (this.sections.overview) {
    return this.sections.overview.length > length 
      ? this.sections.overview.substring(0, length) + '...'
      : this.sections.overview;
  }
  return '';
};

// Static method to get published reviews
ReviewSchema.statics.getPublished = function(options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'publishedAt',
    sortOrder = 'desc',
    bookmaker = null
  } = options;

  const filters = {
    status: 'published',
    isPublished: true
  };
  
  if (bookmaker) {
    filters.bookmaker = bookmaker;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(filters)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('bookmaker', 'name slug logo rating')
    .populate('relatedBookmakers', 'name slug logo rating')
    .exec();
};

// Static method to get featured reviews
ReviewSchema.statics.getFeatured = function(limit = 5) {
  return this.find({
    status: 'published',
    isPublished: true,
    isFeatured: true
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('bookmaker', 'name slug logo rating')
    .exec();
};

// Static method for search
ReviewSchema.statics.search = function(query, options = {}) {
  const {
    page = 1,
    limit = 10,
    minRating = 0
  } = options;

  const filters = {
    status: 'published',
    isPublished: true
  };
  
  if (query) {
    filters.$text = { $search: query };
  }
  
  if (minRating > 0) {
    filters['summary.rating'] = { $gte: minRating };
  }

  return this.find(filters)
    .sort({ publishedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('bookmaker', 'name slug logo rating')
    .exec();
};

module.exports = mongoose.model('Review', ReviewSchema); 