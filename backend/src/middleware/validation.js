const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Bookmaker validation rules
const validateBookmaker = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Slug must be a valid URL slug'),
  
  body('logo')
    .notEmpty()
    .withMessage('Logo URL is required')
    .isURL()
    .withMessage('Logo must be a valid URL'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('rating.overall')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Overall rating must be between 1 and 5'),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('affiliateLink')
    .notEmpty()
    .withMessage('Affiliate link is required')
    .isURL()
    .withMessage('Affiliate link must be a valid URL'),
  
  handleValidationErrors
];

// Review validation rules
const validateReview = [
  body('bookmaker')
    .notEmpty()
    .withMessage('Bookmaker ID is required')
    .isMongoId()
    .withMessage('Bookmaker ID must be a valid MongoDB ObjectId'),
  
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  
  body('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Slug must be a valid URL slug'),
  
  body('summary.verdict')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Verdict must be less than 1000 characters'),
  
  body('sections.overview')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Overview must be less than 5000 characters'),
  
  handleValidationErrors
];

// Bonus validation rules
const validateBonus = [
  body('bookmaker')
    .notEmpty()
    .withMessage('Bookmaker ID is required')
    .isMongoId()
    .withMessage('Bookmaker ID must be a valid MongoDB ObjectId'),
  
  body('type')
    .notEmpty()
    .withMessage('Bonus type is required')
    .isIn(['welcome', 'no-deposit', 'reload', 'cashback', 'free-bet'])
    .withMessage('Invalid bonus type'),
  
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('amount.value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount value must be a positive number'),
  
  body('requirements.wageringRequirement')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Wagering requirement must be a positive number'),
  
  handleValidationErrors
];

// Blog post validation rules
const validateBlogPost = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  
  body('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Slug must be a valid URL slug'),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['comparison', 'guide', 'news', 'review', 'bonus-spotlight'])
    .withMessage('Invalid category'),
  
  body('excerpt')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Excerpt must be less than 300 characters'),
  
  handleValidationErrors
];

// Common validation rules
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

const validateSlug = [
  param('slug')
    .isSlug()
    .withMessage('Invalid slug format'),
  handleValidationErrors
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  validateBookmaker,
  validateReview,
  validateBonus,
  validateBlogPost,
  validateId,
  validateSlug,
  validatePagination,
  handleValidationErrors
}; 