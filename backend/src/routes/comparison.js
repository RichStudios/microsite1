const express = require('express');
const router = express.Router();
const { Bookmaker } = require('../models');
const { validateId } = require('../middleware/validation');

// Compare two bookmakers
router.get('/compare/:id1/:id2', async (req, res, next) => {
  try {
    const bookmaker1 = await Bookmaker.findById(req.params.id1)
      .populate('bonuses', 'type title amount requirements');
    
    const bookmaker2 = await Bookmaker.findById(req.params.id2)
      .populate('bonuses', 'type title amount requirements');

    if (!bookmaker1 || !bookmaker2) {
      return res.status(404).json({
        success: false,
        message: 'One or both bookmakers not found'
      });
    }

    const comparison = {
      bookmaker1: {
        id: bookmaker1._id,
        name: bookmaker1.name,
        logo: bookmaker1.logo,
        rating: bookmaker1.rating,
        features: bookmaker1.features,
        bonuses: bookmaker1.bonuses,
        paymentMethods: bookmaker1.paymentMethods
      },
      bookmaker2: {
        id: bookmaker2._id,
        name: bookmaker2.name,
        logo: bookmaker2.logo,
        rating: bookmaker2.rating,
        features: bookmaker2.features,
        bonuses: bookmaker2.bonuses,
        paymentMethods: bookmaker2.paymentMethods
      },
      comparisonCategories: [
        {
          category: 'Overall Rating',
          bookmaker1Score: bookmaker1.rating.overall,
          bookmaker2Score: bookmaker2.rating.overall,
          winner: bookmaker1.rating.overall > bookmaker2.rating.overall ? 'bookmaker1' : 'bookmaker2'
        },
        {
          category: 'Odds Quality',
          bookmaker1Score: bookmaker1.rating.odds,
          bookmaker2Score: bookmaker2.rating.odds,
          winner: bookmaker1.rating.odds > bookmaker2.rating.odds ? 'bookmaker1' : 'bookmaker2'
        },
        {
          category: 'Bonuses',
          bookmaker1Score: bookmaker1.rating.bonuses,
          bookmaker2Score: bookmaker2.rating.bonuses,
          winner: bookmaker1.rating.bonuses > bookmaker2.rating.bonuses ? 'bookmaker1' : 'bookmaker2'
        },
        {
          category: 'Mobile Experience',
          bookmaker1Score: bookmaker1.rating.mobile,
          bookmaker2Score: bookmaker2.rating.mobile,
          winner: bookmaker1.rating.mobile > bookmaker2.rating.mobile ? 'bookmaker1' : 'bookmaker2'
        },
        {
          category: 'Customer Support',
          bookmaker1Score: bookmaker1.rating.support,
          bookmaker2Score: bookmaker2.rating.support,
          winner: bookmaker1.rating.support > bookmaker2.rating.support ? 'bookmaker1' : 'bookmaker2'
        }
      ]
    };

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    next(error);
  }
});

// Get comparison table data
router.get('/table', async (req, res, next) => {
  try {
    const bookmakers = await Bookmaker.find({ status: 'active' })
      .sort({ 'rating.overall': -1 })
      .limit(10)
      .populate('bonuses', 'type title amount requirements');

    const comparisonTable = bookmakers.map(bookmaker => ({
      id: bookmaker._id,
      name: bookmaker.name,
      logo: bookmaker.logo,
      rating: bookmaker.rating,
      features: bookmaker.features.slice(0, 3),
      topBonus: bookmaker.bonuses.length > 0 ? bookmaker.bonuses[0] : null,
      affiliateLink: bookmaker.affiliateLink,
      pros: [
        bookmaker.features.includes('M-Pesa Ready') ? 'M-Pesa Ready' : null,
        bookmaker.features.includes('High Odds') ? 'High Odds' : null,
        bookmaker.features.includes('Live Betting') ? 'Live Betting' : null
      ].filter(Boolean),
      cons: [
        bookmaker.rating.mobile < 4 ? 'Mobile could be better' : null,
        bookmaker.rating.support < 4 ? 'Support needs improvement' : null
      ].filter(Boolean)
    }));

    res.json({
      success: true,
      data: comparisonTable
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 