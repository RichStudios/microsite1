const mongoose = require('mongoose');
const slugify = require('slugify');

const BookmakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bookmaker name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  logo: {
    type: String,
    required: [true, 'Logo URL is required']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  rating: {
    overall: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    odds: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    bonuses: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    mobile: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    support: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    payout: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  features: [{
    type: String,
    enum: [
      'M-Pesa Ready',
      'High Odds',
      'Live Betting',
      'Mobile App',
      'Fast Payouts',
      'Live Streaming',
      'Cash Out',
      'Multi-Language',
      'Customer Support',
      'Secure Banking'
    ]
  }],
  paymentMethods: [{
    name: {
      type: String,
      required: true
    },
    logo: String,
    processingTime: String,
    minDeposit: Number,
    maxDeposit: Number,
    fees: String
  }],
  bettingMarkets: [{
    name: String,
    available: {
      type: Boolean,
      default: true
    },
    margin: Number
  }],
  licenseInfo: {
    authority: String,
    licenseNumber: String,
    validUntil: Date
  },
  contactInfo: {
    email: String,
    phone: String,
    liveChatAvailable: {
      type: Boolean,
      default: false
    },
    supportHours: String
  },
  websiteUrl: {
    type: String,
    required: true
  },
  affiliateLink: {
    type: String,
    required: [true, 'Affiliate link is required']
  },
  trackingPixel: String,
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  },
  establishedYear: Number,
  headquarters: String,
  parentCompany: String,
  statistics: {
    totalBets: {
      type: Number,
      default: 0
    },
    totalWinnings: {
      type: Number,
      default: 0
    },
    averageOdds: {
      type: Number,
      default: 0
    },
    payoutPercentage: {
      type: Number,
      default: 0
    }
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
    telegram: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
BookmakerSchema.index({ slug: 1 });
BookmakerSchema.index({ featured: -1, priority: -1 });
BookmakerSchema.index({ status: 1 });
BookmakerSchema.index({ 'rating.overall': -1 });
BookmakerSchema.index({ name: 'text', description: 'text' });

// Virtual populate for bonuses
BookmakerSchema.virtual('bonuses', {
  ref: 'Bonus',
  localField: '_id',
  foreignField: 'bookmaker'
});

// Virtual populate for reviews
BookmakerSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookmaker'
});

// Pre-save middleware to generate slug
BookmakerSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Method to calculate average rating
BookmakerSchema.methods.calculateAverageRating = function() {
  const ratings = this.rating;
  const validRatings = Object.values(ratings).filter(r => r && r > 0);
  
  if (validRatings.length === 0) return 0;
  
  const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
  return Math.round((sum / validRatings.length) * 10) / 10;
};

// Method to check if bookmaker is active
BookmakerSchema.methods.isActive = function() {
  return this.status === 'active';
};

// Method to get display features
BookmakerSchema.methods.getDisplayFeatures = function(limit = 3) {
  return this.features.slice(0, limit);
};

// Static method to get featured bookmakers
BookmakerSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ featured: true, status: 'active' })
    .sort({ priority: -1, 'rating.overall': -1 })
    .limit(limit)
    .populate('bonuses', 'type title amount')
    .exec();
};

// Static method to get top rated bookmakers
BookmakerSchema.statics.getTopRated = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ 'rating.overall': -1, priority: -1 })
    .limit(limit)
    .populate('bonuses', 'type title amount')
    .exec();
};

// Static method for search
BookmakerSchema.statics.search = function(query, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'priority',
    sortOrder = 'desc',
    features = [],
    minRating = 0
  } = options;

  const filters = { status: 'active' };
  
  if (query) {
    filters.$text = { $search: query };
  }
  
  if (features.length > 0) {
    filters.features = { $in: features };
  }
  
  if (minRating > 0) {
    filters['rating.overall'] = { $gte: minRating };
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(filters)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('bonuses', 'type title amount')
    .exec();
};

module.exports = mongoose.model('Bookmaker', BookmakerSchema); 