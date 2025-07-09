const express = require('express');
const router = express.Router();
const { Bonus } = require('../models');
const { validateBonus, validateId, validatePagination } = require('../middleware/validation');

/**
 * @swagger
 * /api/bonuses:
 *   get:
 *     summary: Get all bonuses
 *     tags: [Bonuses]
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
 *         description: Number of bonuses per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by bonus type
 *       - in: query
 *         name: bookmaker
 *         schema:
 *           type: string
 *         description: Filter by bookmaker ID
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured bonuses
 *     responses:
 *       200:
 *         description: List of bonuses
 */
router.get('/', validatePagination, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || null;
    const bookmaker = req.query.bookmaker || null;
    const featured = req.query.featured === 'true';

    const bonuses = await Bonus.getActive({
      page,
      limit,
      type,
      bookmaker,
      featuredOnly: featured
    });

    // Get total count for pagination
    const filters = {
      isActive: true,
      validFrom: { $lte: new Date() },
      $or: [
        { validUntil: { $exists: false } },
        { validUntil: { $gte: new Date() } }
      ]
    };

    if (type) filters.type = type;
    if (bookmaker) filters.bookmaker = bookmaker;
    if (featured) filters.isFeatured = true;

    const total = await Bonus.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        bonuses,
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
 * /api/bonuses/featured:
 *   get:
 *     summary: Get featured bonuses
 *     tags: [Bonuses]
 *     responses:
 *       200:
 *         description: List of featured bonuses
 */
router.get('/featured', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const bonuses = await Bonus.getFeatured(limit);

    res.json({
      success: true,
      data: bonuses
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bonuses/type/{type}:
 *   get:
 *     summary: Get bonuses by type
 *     tags: [Bonuses]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Bonus type
 *     responses:
 *       200:
 *         description: List of bonuses by type
 */
router.get('/type/:type', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const bonuses = await Bonus.getByType(req.params.type, limit);

    res.json({
      success: true,
      data: bonuses
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bonuses/expiring:
 *   get:
 *     summary: Get expiring bonuses
 *     tags: [Bonuses]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days until expiration
 *     responses:
 *       200:
 *         description: List of expiring bonuses
 */
router.get('/expiring', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const bonuses = await Bonus.getExpiring(days);

    res.json({
      success: true,
      data: bonuses
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bonuses/{id}:
 *   get:
 *     summary: Get bonus by ID
 *     tags: [Bonuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bonus ID
 *     responses:
 *       200:
 *         description: Bonus details
 *       404:
 *         description: Bonus not found
 */
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const bonus = await Bonus.findById(req.params.id)
      .populate('bookmaker', 'name slug logo rating');

    if (!bonus) {
      return res.status(404).json({
        success: false,
        message: 'Bonus not found'
      });
    }

    res.json({
      success: true,
      data: bonus
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bonuses/{id}/track-impression:
 *   post:
 *     summary: Track bonus impression
 *     tags: [Bonuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bonus ID
 *     responses:
 *       200:
 *         description: Impression tracked
 *       404:
 *         description: Bonus not found
 */
router.post('/:id/track-impression', validateId, async (req, res, next) => {
  try {
    const bonus = await Bonus.findById(req.params.id);

    if (!bonus) {
      return res.status(404).json({
        success: false,
        message: 'Bonus not found'
      });
    }

    await bonus.trackImpression();

    res.json({
      success: true,
      message: 'Impression tracked'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bonuses/{id}/track-click:
 *   post:
 *     summary: Track bonus click
 *     tags: [Bonuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bonus ID
 *     responses:
 *       200:
 *         description: Click tracked
 *       404:
 *         description: Bonus not found
 */
router.post('/:id/track-click', validateId, async (req, res, next) => {
  try {
    const bonus = await Bonus.findById(req.params.id);

    if (!bonus) {
      return res.status(404).json({
        success: false,
        message: 'Bonus not found'
      });
    }

    await bonus.trackClick();

    res.json({
      success: true,
      message: 'Click tracked'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bonuses:
 *   post:
 *     summary: Create a new bonus
 *     tags: [Bonuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Bonus created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateBonus, async (req, res, next) => {
  try {
    const bonus = new Bonus(req.body);
    await bonus.save();

    res.status(201).json({
      success: true,
      data: bonus
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bonuses/{id}:
 *   put:
 *     summary: Update bonus
 *     tags: [Bonuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bonus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Bonus updated successfully
 *       404:
 *         description: Bonus not found
 */
router.put('/:id', [validateId, validateBonus], async (req, res, next) => {
  try {
    const bonus = await Bonus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bonus) {
      return res.status(404).json({
        success: false,
        message: 'Bonus not found'
      });
    }

    res.json({
      success: true,
      data: bonus
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/bonuses/{id}:
 *   delete:
 *     summary: Delete bonus
 *     tags: [Bonuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bonus ID
 *     responses:
 *       200:
 *         description: Bonus deleted successfully
 *       404:
 *         description: Bonus not found
 */
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const bonus = await Bonus.findByIdAndDelete(req.params.id);

    if (!bonus) {
      return res.status(404).json({
        success: false,
        message: 'Bonus not found'
      });
    }

    res.json({
      success: true,
      message: 'Bonus deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 