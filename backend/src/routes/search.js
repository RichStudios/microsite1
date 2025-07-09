const express = require('express');
const router = express.Router();
const { Bookmaker, Review, BlogPost, Bonus } = require('../models');

// Universal search
router.get('/', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || 'all'; // all, bookmakers, reviews, blog, bonuses

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchResults = {
      bookmakers: [],
      reviews: [],
      blogPosts: [],
      bonuses: []
    };

    // Search bookmakers
    if (type === 'all' || type === 'bookmakers') {
      searchResults.bookmakers = await Bookmaker.search(query, {
        page: 1,
        limit: type === 'bookmakers' ? limit : 3
      });
    }

    // Search reviews
    if (type === 'all' || type === 'reviews') {
      searchResults.reviews = await Review.search(query, {
        page: 1,
        limit: type === 'reviews' ? limit : 3
      });
    }

    // Search blog posts
    if (type === 'all' || type === 'blog') {
      searchResults.blogPosts = await BlogPost.search(query, {
        page: 1,
        limit: type === 'blog' ? limit : 3
      });
    }

    // Search bonuses
    if (type === 'all' || type === 'bonuses') {
      const bonuses = await Bonus.find({
        isActive: true,
        $text: { $search: query }
      })
        .limit(type === 'bonuses' ? limit : 3)
        .populate('bookmaker', 'name slug logo rating');
      
      searchResults.bonuses = bonuses;
    }

    res.json({
      success: true,
      data: {
        query,
        results: searchResults,
        totalResults: Object.values(searchResults).flat().length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Search suggestions
router.get('/suggestions', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const suggestions = await Bookmaker.find({
      status: 'active',
      name: { $regex: query, $options: 'i' }
    })
      .limit(5)
      .select('name slug logo');

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 