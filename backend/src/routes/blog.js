const express = require('express');
const router = express.Router();
const { BlogPost } = require('../models');
const { validateBlogPost, validateId, validateSlug, validatePagination } = require('../middleware/validation');

// Get all blog posts
router.get('/', validatePagination, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;
    const tag = req.query.tag || null;
    const featured = req.query.featured === 'true';
    const sortBy = req.query.sortBy || 'publishedAt';
    const sortOrder = req.query.sortOrder || 'desc';

    let posts;
    if (featured) {
      posts = await BlogPost.getFeatured(limit);
    } else {
      posts = await BlogPost.getPublished({
        page,
        limit,
        category,
        tag,
        sortBy,
        sortOrder
      });
    }

    const filters = {
      status: 'published',
      isPublished: true,
      ...(category && { category }),
      ...(tag && { tags: { $in: [tag] } })
    };

    const total = await BlogPost.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        posts,
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

// Get blog post by slug
router.get('/slug/:slug', validateSlug, async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published',
      isPublished: true
    })
      .populate('relatedBookmakers', 'name slug logo rating')
      .populate('comparisonData.bookmaker1', 'name slug logo rating')
      .populate('comparisonData.bookmaker2', 'name slug logo rating');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await post.incrementViews();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
});

// Get comparison posts
router.get('/comparisons', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const posts = await BlogPost.getComparisons(limit);

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
});

// Create blog post
router.post('/', validateBlogPost, async (req, res, next) => {
  try {
    const post = new BlogPost(req.body);
    await post.save();

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 