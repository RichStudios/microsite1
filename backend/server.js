const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Import routes
const bookmakerRoutes = require('./src/routes/bookmakers');
const reviewRoutes = require('./src/routes/reviews');
const bonusRoutes = require('./src/routes/bonuses');
const blogRoutes = require('./src/routes/blog');
const comparisonRoutes = require('./src/routes/comparison');
const analyticsRoutes = require('./src/routes/analytics');
const searchRoutes = require('./src/routes/search');
const authRoutes = require('./src/routes/auth');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/bookmakers', bookmakerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bonuses', bonusRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// API documentation (if in development)
if (process.env.NODE_ENV === 'development') {
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'BetCompare API',
        version: '1.0.0',
        description: 'API for BetCompare.co.ke microsite'
      },
      servers: [
        {
          url: process.env.API_BASE_URL || 'http://localhost:5001',
          description: 'Development server'
        }
      ]
    },
    apis: ['./src/routes/*.js']
  };

  const specs = swaggerJsdoc(options);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
const connectDB = require('./src/config/database');

// Connect to database (won't crash if MongoDB is unavailable)
connectDB().then(() => {
  console.log('✅ Database connection established');
}).catch((err) => {
  console.log('⚠️  Running without database connection');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app; 