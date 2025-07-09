const express = require('express');
const router = express.Router();
const { Bookmaker } = require('../models');
const { validateBookmaker, validateId, validatePagination } = require('../middleware/validation');

/**
 * @swagger
 * /api/bookmakers:
 *   get:
 *     summary: Get all bookmakers
 *     tags: [Bookmakers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of bookmakers per page
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured bookmakers
 *     responses:
 *       200:
 *         description: List of bookmakers
 */
router.get('/', validatePagination, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const featured = req.query.featured === 'true';
    const search = req.query.search || '';
    const features = req.query.features ? req.query.features.split(',') : [];
    const minRating = parseFloat(req.query.minRating) || 0;
    const sortBy = req.query.sortBy || 'priority';
    const sortOrder = req.query.sortOrder || 'desc';

    let bookmakers;
    let total;

    if (featured) {
      bookmakers = await Bookmaker.getFeatured(limit);
      total = bookmakers.length;
    } else if (search || features.length > 0 || minRating > 0) {
      bookmakers = await Bookmaker.search(search, {
        page,
        limit,
        sortBy,
        sortOrder,
        features,
        minRating
      });
      total = await Bookmaker.countDocuments({
        status: 'active',
        ...(search && { $text: { $search: search } }),
        ...(features.length > 0 && { features: { $in: features } }),
        ...(minRating > 0 && { 'rating.overall': { $gte: minRating } })
      });
    } else {
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      bookmakers = await Bookmaker.find({ status: 'active' })
        .sort(sortOptions)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('bonuses', 'type title amount');

      total = await Bookmaker.countDocuments({ status: 'active' });
    }

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        bookmakers,
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

/**
 * @swagger
 * /api/bookmakers/featured:
 *   get:
 *     summary: Get featured bookmakers
 *     tags: [Bookmakers]
 *     responses:
 *       200:
 *         description: List of featured bookmakers
 */
router.get('/featured', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const bookmakers = await Bookmaker.getFeatured(limit);

    res.json({
      success: true,
      data: bookmakers
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bookmakers/top-rated:
 *   get:
 *     summary: Get top rated bookmakers
 *     tags: [Bookmakers]
 *     responses:
 *       200:
 *         description: List of top rated bookmakers
 */
router.get('/top-rated', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const bookmakers = await Bookmaker.getTopRated(limit);

    res.json({
      success: true,
      data: bookmakers
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bookmakers/{id}:
 *   get:
 *     summary: Get bookmaker by ID
 *     tags: [Bookmakers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bookmaker ID
 *     responses:
 *       200:
 *         description: Bookmaker details
 *       404:
 *         description: Bookmaker not found
 */
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const bookmaker = await Bookmaker.findById(req.params.id)
      .populate('bonuses')
      .populate('reviews');

    if (!bookmaker) {
      return res.status(404).json({
        success: false,
        message: 'Bookmaker not found'
      });
    }

    res.json({
      success: true,
      data: bookmaker
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bookmakers/slug/{slug}:
 *   get:
 *     summary: Get bookmaker by slug
 *     tags: [Bookmakers]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Bookmaker slug
 *     responses:
 *       200:
 *         description: Bookmaker details
 *       404:
 *         description: Bookmaker not found
 */
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const bookmaker = await Bookmaker.findOne({ 
      slug: req.params.slug,
      status: 'active'
    })
      .populate('bonuses')
      .populate('reviews');

    if (!bookmaker) {
      return res.status(404).json({
        success: false,
        message: 'Bookmaker not found'
      });
    }

    res.json({
      success: true,
      data: bookmaker
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bookmakers:
 *   post:
 *     summary: Create a new bookmaker
 *     tags: [Bookmakers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logo:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *               affiliateLink:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bookmaker created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateBookmaker, async (req, res, next) => {
  try {
    const bookmaker = new Bookmaker(req.body);
    await bookmaker.save();

    res.status(201).json({
      success: true,
      data: bookmaker
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bookmakers/{id}:
 *   put:
 *     summary: Update bookmaker
 *     tags: [Bookmakers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bookmaker ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Bookmaker updated successfully
 *       404:
 *         description: Bookmaker not found
 */
router.put('/:id', [validateId, validateBookmaker], async (req, res, next) => {
  try {
    const bookmaker = await Bookmaker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bookmaker) {
      return res.status(404).json({
        success: false,
        message: 'Bookmaker not found'
      });
    }

    res.json({
      success: true,
      data: bookmaker
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bookmakers/{id}:
 *   delete:
 *     summary: Delete bookmaker
 *     tags: [Bookmakers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bookmaker ID
 *     responses:
 *       200:
 *         description: Bookmaker deleted successfully
 *       404:
 *         description: Bookmaker not found
 */
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const bookmaker = await Bookmaker.findByIdAndDelete(req.params.id);

    if (!bookmaker) {
      return res.status(404).json({
        success: false,
        message: 'Bookmaker not found'
      });
    }

    res.json({
      success: true,
      message: 'Bookmaker deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 