const express = require('express');
const router = express.Router();
const { Review } = require('../models');
const { validateReview, validateId, validateSlug, validatePagination } = require('../middleware/validation');

// Get all reviews
router.get('/', validatePagination, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const bookmaker = req.query.bookmaker || null;
    const featured = req.query.featured === 'true';
    const sortBy = req.query.sortBy || 'publishedAt';
    const sortOrder = req.query.sortOrder || 'desc';

    let reviews;
    if (featured) {
      reviews = await Review.getFeatured(limit);
    } else {
      reviews = await Review.getPublished({
        page,
        limit,
        bookmaker,
        sortBy,
        sortOrder
      });
    }

    const filters = {
      status: 'published',
      isPublished: true,
      ...(bookmaker && { bookmaker })
    };

    const total = await Review.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get review by ID
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('bookmaker', 'name slug logo rating')
      .populate('relatedBookmakers', 'name slug logo rating');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Increment views
    await review.incrementViews();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// Get review by slug
router.get('/slug/:slug', validateSlug, async (req, res, next) => {
  try {
    const review = await Review.findOne({ 
      slug: req.params.slug,
      status: 'published',
      isPublished: true
    })
      .populate('bookmaker', 'name slug logo rating')
      .populate('relatedBookmakers', 'name slug logo rating');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.incrementViews();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// Create review
router.post('/', validateReview, async (req, res, next) => {
  try {
    const review = new Review(req.body);
    await review.save();

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// Update review
router.put('/:id', [validateId, validateReview], async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 