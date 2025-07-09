const mongoose = require('mongoose');

const BonusSchema = new mongoose.Schema({
  bookmaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookmaker',
    required: [true, 'Bookmaker reference is required']
  },
  type: {
    type: String,
    required: [true, 'Bonus type is required'],
    enum: ['welcome', 'no-deposit', 'reload', 'cashback', 'free-bet', 'loyalty', 'referral', 'seasonal']
  },
  title: {
    type: String,
    required: [true, 'Bonus title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  amount: {
    value: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'KES'
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    maxAmount: {
      type: Number,
      min: 0
    },
    minAmount: {
      type: Number,
      min: 0
    }
  },
  requirements: {
    minDeposit: {
      type: Number,
      min: 0,
      default: 0
    },
    wageringRequirement: {
      type: Number,
      min: 0,
      default: 1
    },
    timeLimit: {
      type: String,
      default: '30 days'
    },
    timeLimitDays: {
      type: Number,
      default: 30
    },
    gameRestrictions: [String],
    oddsRequirement: {
      type: Number,
      min: 1.0,
      default: 1.0
    },
    maxBetAmount: Number,
    eligibleMarkets: [String],
    excludedMarkets: [String]
  },
  eligibility: {
    newCustomersOnly: {
      type: Boolean,
      default: true
    },
    countryRestrictions: [String],
    ageRestriction: {
      type: Number,
      default: 18
    },
    paymentMethodRestrictions: [String],
    excludedPaymentMethods: [String]
  },
  terms: {
    type: String,
    maxlength: [5000, 'Terms cannot exceed 5000 characters']
  },
  highlights: [{
    type: String,
    maxlength: [100, 'Highlight cannot exceed 100 characters']
  }],
  promoCode: {
    type: String,
    uppercase: true,
    trim: true
  },
  claimInstructions: [{
    step: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true,
      maxlength: [500, 'Instruction cannot exceed 500 characters']
    }
  }],
  displayInfo: {
    badge: {
      type: String,
      enum: ['hot', 'new', 'exclusive', 'limited-time', 'popular']
    },
    badgeColor: {
      type: String,
      default: '#FF6B00'
    },
    priority: {
      type: Number,
      default: 0
    },
    showOnHomepage: {
      type: Boolean,
      default: false
    }
  },
  tracking: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    ctr: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isExclusive: {
    type: Boolean,
    default: false
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
BonusSchema.index({ bookmaker: 1, isActive: 1 });
BonusSchema.index({ type: 1, isActive: 1 });
BonusSchema.index({ validFrom: 1, validUntil: 1 });
BonusSchema.index({ 'displayInfo.priority': -1 });
BonusSchema.index({ isFeatured: -1, isActive: 1 });

// Virtual for checking if bonus is currently valid
BonusSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         this.validFrom <= now && 
         (!this.validUntil || this.validUntil >= now);
});

// Virtual for formatted amount
BonusSchema.virtual('formattedAmount').get(function() {
  if (this.amount.percentage) {
    const maxAmount = this.amount.maxAmount ? ` (Max: ${this.amount.currency} ${this.amount.maxAmount})` : '';
    return `${this.amount.percentage}%${maxAmount}`;
  } else if (this.amount.value) {
    return `${this.amount.currency} ${this.amount.value}`;
  }
  return 'N/A';
});

// Virtual for urgency level
BonusSchema.virtual('urgencyLevel').get(function() {
  if (!this.validUntil) return 'none';
  
  const now = new Date();
  const daysLeft = Math.ceil((this.validUntil - now) / (1000 * 60 * 60 * 24));
  
  if (daysLeft <= 1) return 'critical';
  if (daysLeft <= 7) return 'high';
  if (daysLeft <= 30) return 'medium';
  return 'low';
});

// Pre-save middleware
BonusSchema.pre('save', function(next) {
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  
  // Calculate CTR and conversion rate
  if (this.tracking.impressions > 0) {
    this.tracking.ctr = (this.tracking.clicks / this.tracking.impressions) * 100;
  }
  
  if (this.tracking.clicks > 0) {
    this.tracking.conversionRate = (this.tracking.conversions / this.tracking.clicks) * 100;
  }
  
  next();
});

// Method to check if bonus is expiring soon
BonusSchema.methods.isExpiringSoon = function(days = 7) {
  if (!this.validUntil) return false;
  
  const now = new Date();
  const expiryDate = new Date(this.validUntil);
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  return daysUntilExpiry <= days && daysUntilExpiry > 0;
};

// Method to get bonus value display
BonusSchema.methods.getValueDisplay = function() {
  if (this.amount.percentage) {
    return `${this.amount.percentage}% Bonus`;
  } else if (this.amount.value) {
    return `${this.amount.currency} ${this.amount.value}`;
  }
  return 'Bonus Available';
};

// Method to track impression
BonusSchema.methods.trackImpression = function() {
  this.tracking.impressions += 1;
  return this.save();
};

// Method to track click
BonusSchema.methods.trackClick = function() {
  this.tracking.clicks += 1;
  return this.save();
};

// Method to track conversion
BonusSchema.methods.trackConversion = function() {
  this.tracking.conversions += 1;
  return this.save();
};

// Static method to get active bonuses
BonusSchema.statics.getActive = function(options = {}) {
  const {
    page = 1,
    limit = 10,
    type = null,
    bookmaker = null,
    featuredOnly = false
  } = options;

  const filters = {
    isActive: true,
    validFrom: { $lte: new Date() },
    $or: [
      { validUntil: { $exists: false } },
      { validUntil: { $gte: new Date() } }
    ]
  };
  
  if (type) {
    filters.type = type;
  }
  
  if (bookmaker) {
    filters.bookmaker = bookmaker;
  }
  
  if (featuredOnly) {
    filters.isFeatured = true;
  }

  return this.find(filters)
    .sort({ 'displayInfo.priority': -1, validFrom: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('bookmaker', 'name slug logo rating')
    .exec();
};

// Static method to get featured bonuses
BonusSchema.statics.getFeatured = function(limit = 5) {
  return this.find({
    isActive: true,
    isFeatured: true,
    validFrom: { $lte: new Date() },
    $or: [
      { validUntil: { $exists: false } },
      { validUntil: { $gte: new Date() } }
    ]
  })
    .sort({ 'displayInfo.priority': -1, validFrom: -1 })
    .limit(limit)
    .populate('bookmaker', 'name slug logo rating')
    .exec();
};

// Static method to get bonuses by type
BonusSchema.statics.getByType = function(type, limit = 10) {
  return this.find({
    type: type,
    isActive: true,
    validFrom: { $lte: new Date() },
    $or: [
      { validUntil: { $exists: false } },
      { validUntil: { $gte: new Date() } }
    ]
  })
    .sort({ 'displayInfo.priority': -1, validFrom: -1 })
    .limit(limit)
    .populate('bookmaker', 'name slug logo rating')
    .exec();
};

// Static method to get expiring bonuses
BonusSchema.statics.getExpiring = function(days = 7) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.find({
    isActive: true,
    validUntil: {
      $gte: now,
      $lte: futureDate
    }
  })
    .sort({ validUntil: 1 })
    .populate('bookmaker', 'name slug logo rating')
    .exec();
};

module.exports = mongoose.model('Bonus', BonusSchema); 