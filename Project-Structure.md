# 🏗️ BetCompare.co.ke - Project Structure & Indexing

## 📋 Project Overview
**Project Name:** BetCompare.co.ke  
**Vertical:** Bookmaker & Odds Comparison  
**Positioning:** "Compare Top Bookies & Odds Before You Bet"  
**Tech Stack:** Next.js/React.js + Node.js/Express + MongoDB  

---

## 🗂️ Root Directory Structure

```
BetCompare-Microsite/
├── backend/                     # Node.js/Express API Server
├── frontend/                    # Next.js/React Application
├── database/                    # Database seeds and migrations
├── docs/                        # Project documentation
├── shared/                      # Shared utilities and types
├── docker-compose.yml           # Docker configuration
├── .gitignore                   # Git ignore rules
├── README.md                    # Project overview
├── package.json                 # Root package.json for workspaces
└── Project-Structure.md         # This file
```

---

## 🔧 Backend Structure (`/backend`)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection setup
│   │   ├── environment.js       # Environment variables config
│   │   ├── cors.js              # CORS configuration
│   │   ├── security.js          # Security middleware
│   │   └── swagger.js           # API documentation setup
│   │
│   ├── models/
│   │   ├── index.js             # Model exports
│   │   ├── Bookmaker.js         # Bookmaker schema & model
│   │   ├── Review.js            # Review schema & model
│   │   ├── Bonus.js             # Bonus schema & model
│   │   ├── BlogPost.js          # Blog post schema & model
│   │   ├── Comparison.js        # Comparison schema & model
│   │   ├── Analytics.js         # Analytics tracking model
│   │   └── User.js              # Admin user model
│   │
│   ├── routes/
│   │   ├── index.js             # Route aggregator
│   │   ├── bookmakers.js        # Bookmaker CRUD endpoints
│   │   ├── reviews.js           # Review CRUD endpoints
│   │   ├── bonuses.js           # Bonus CRUD endpoints
│   │   ├── blog.js              # Blog CRUD endpoints
│   │   ├── comparison.js        # Comparison endpoints
│   │   ├── analytics.js         # Analytics endpoints
│   │   ├── search.js            # Search endpoints
│   │   └── auth.js              # Authentication endpoints
│   │
│   ├── controllers/
│   │   ├── bookmakersController.js    # Bookmaker business logic
│   │   ├── reviewsController.js       # Review business logic
│   │   ├── bonusesController.js       # Bonus business logic
│   │   ├── blogController.js          # Blog business logic
│   │   ├── comparisonController.js    # Comparison business logic
│   │   ├── analyticsController.js     # Analytics business logic
│   │   ├── searchController.js        # Search business logic
│   │   └── authController.js          # Authentication business logic
│   │
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── validation.js        # Request validation
│   │   ├── rateLimit.js         # Rate limiting
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── logger.js            # Request logging
│   │   └── cache.js             # Response caching
│   │
│   ├── services/
│   │   ├── bookmakerService.js  # Bookmaker service layer
│   │   ├── reviewService.js     # Review service layer
│   │   ├── bonusService.js      # Bonus service layer
│   │   ├── blogService.js       # Blog service layer
│   │   ├── emailService.js      # Email service
│   │   ├── imageService.js      # Image processing
│   │   └── seoService.js        # SEO utilities
│   │
│   ├── utils/
│   │   ├── slugify.js           # URL slug generation
│   │   ├── seoHelpers.js        # SEO utility functions
│   │   ├── imageOptimizer.js    # Image optimization
│   │   ├── validators.js        # Custom validators
│   │   ├── formatters.js        # Data formatters
│   │   └── constants.js         # App constants
│   │
│   ├── tests/
│   │   ├── unit/                # Unit tests
│   │   ├── integration/         # Integration tests
│   │   └── fixtures/            # Test data
│   │
│   └── app.js                   # Express app setup
│
├── uploads/                     # File uploads directory
├── logs/                        # Application logs
├── .env.example                 # Environment variables template
├── .env.development             # Development environment
├── .env.production              # Production environment
├── package.json                 # Backend dependencies
├── server.js                    # Server entry point
└── ecosystem.config.js          # PM2 configuration
```

---

## ⚛️ Frontend Structure (`/frontend`)

```
frontend/
├── public/
│   ├── images/
│   │   ├── logos/
│   │   │   ├── betway-logo.png
│   │   │   ├── melbet-logo.png
│   │   │   ├── 1xbet-logo.png
│   │   │   └── ... (other bookmaker logos)
│   │   ├── icons/
│   │   │   ├── star.svg
│   │   │   ├── mobile.svg
│   │   │   ├── mpesa.svg
│   │   │   └── ... (UI icons)
│   │   ├── banners/
│   │   │   ├── hero-banner.jpg
│   │   │   ├── comparison-banner.jpg
│   │   │   └── ... (promotional banners)
│   │   └── og-images/
│   │       ├── og-default.jpg
│   │       ├── og-comparison.jpg
│   │       └── ... (social media images)
│   ├── fonts/
│   │   ├── Montserrat-Bold.woff2
│   │   ├── OpenSans-Regular.woff2
│   │   └── ... (font files)
│   ├── favicon.ico
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # Search engine robots
│   └── sitemap.xml              # Site map
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx       # Main layout wrapper
│   │   │   ├── Header.jsx       # Site header with navigation
│   │   │   ├── Footer.jsx       # Site footer
│   │   │   ├── Navigation.jsx   # Main navigation
│   │   │   ├── MobileCTABar.jsx # Mobile sticky CTA bar
│   │   │   └── Breadcrumbs.jsx  # Breadcrumb navigation
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx       # Reusable button component
│   │   │   ├── Card.jsx         # Card component
│   │   │   ├── Rating.jsx       # Star rating component
│   │   │   ├── Table.jsx        # Table component
│   │   │   ├── Modal.jsx        # Modal component
│   │   │   ├── Spinner.jsx      # Loading spinner
│   │   │   ├── Badge.jsx        # Badge component
│   │   │   ├── Tabs.jsx         # Tab component
│   │   │   └── Tooltip.jsx      # Tooltip component
│   │   │
│   │   ├── bookmaker/
│   │   │   ├── BookmakerCard.jsx      # Individual bookmaker card
│   │   │   ├── BookmakerGrid.jsx      # Grid of bookmaker cards
│   │   │   ├── BookmakerList.jsx      # List view of bookmakers
│   │   │   ├── BookmakerDetails.jsx   # Detailed bookmaker info
│   │   │   ├── ComparisonTable.jsx    # Side-by-side comparison
│   │   │   ├── ComparisonCard.jsx     # Individual comparison card
│   │   │   ├── FilterPanel.jsx        # Filtering controls
│   │   │   └── SortingControls.jsx    # Sorting options
│   │   │
│   │   ├── bonus/
│   │   │   ├── BonusCard.jsx          # Individual bonus display
│   │   │   ├── BonusTable.jsx         # Bonus comparison table
│   │   │   ├── BonusFilter.jsx        # Bonus filtering
│   │   │   └── BonusDetails.jsx       # Detailed bonus info
│   │   │
│   │   ├── blog/
│   │   │   ├── BlogCard.jsx           # Blog post card
│   │   │   ├── BlogList.jsx           # Blog listing
│   │   │   ├── BlogPost.jsx           # Individual blog post
│   │   │   ├── BlogSidebar.jsx        # Blog sidebar
│   │   │   ├── BlogCategories.jsx     # Category navigation
│   │   │   └── RelatedPosts.jsx       # Related posts
│   │   │
│   │   ├── forms/
│   │   │   ├── ContactForm.jsx        # Contact form
│   │   │   ├── NewsletterForm.jsx     # Newsletter signup
│   │   │   ├── SearchForm.jsx         # Search functionality
│   │   │   ├── FilterForm.jsx         # Advanced filtering
│   │   │   └── FormElements.jsx       # Form input components
│   │   │
│   │   ├── seo/
│   │   │   ├── SEOHead.jsx            # SEO meta tags
│   │   │   ├── SchemaMarkup.jsx       # Structured data
│   │   │   ├── BreadcrumbList.jsx     # Breadcrumb schema
│   │   │   └── OpenGraph.jsx          # Open Graph tags
│   │   │
│   │   └── sections/
│   │       ├── HeroSection.jsx        # Homepage hero
│   │       ├── FeaturedBookmakers.jsx # Featured bookmakers
│   │       ├── HowItWorks.jsx         # How it works section
│   │       ├── TopBonuses.jsx         # Top bonuses section
│   │       ├── ComparisonSection.jsx  # Comparison showcase
│   │       ├── TestimonialSection.jsx # User testimonials
│   │       └── CTASection.jsx         # Call-to-action sections
│   │
│   ├── pages/
│   │   ├── _app.js              # Next.js app component
│   │   ├── _document.js         # Next.js document component
│   │   ├── index.js             # Homepage
│   │   ├── compare.js           # Comparison page
│   │   ├── bonuses.js           # Bonuses listing page
│   │   ├── about.js             # About page
│   │   ├── contact.js           # Contact page
│   │   ├── faq.js               # FAQ page
│   │   ├── privacy.js           # Privacy policy
│   │   ├── terms.js             # Terms of service
│   │   ├── 404.js               # 404 error page
│   │   ├── 500.js               # 500 error page
│   │   │
│   │   ├── review/
│   │   │   ├── index.js         # Reviews listing
│   │   │   └── [slug].js        # Individual review pages
│   │   │
│   │   ├── blog/
│   │   │   ├── index.js         # Blog listing
│   │   │   ├── [slug].js        # Individual blog posts
│   │   │   └── category/
│   │   │       └── [category].js # Category pages
│   │   │
│   │   ├── bookmaker/
│   │   │   └── [slug].js        # Individual bookmaker pages
│   │   │
│   │   └── api/                 # API routes (if using Next.js API)
│   │       ├── bookmakers.js
│   │       ├── bonuses.js
│   │       ├── contact.js
│   │       └── sitemap.js
│   │
│   ├── styles/
│   │   ├── globals.css          # Global styles
│   │   ├── variables.css        # CSS custom properties
│   │   ├── reset.css            # CSS reset
│   │   ├── typography.css       # Typography styles
│   │   ├── utilities.css        # Utility classes
│   │   └── components/
│   │       ├── header.css
│   │       ├── footer.css
│   │       ├── buttons.css
│   │       └── ... (component styles)
│   │
│   ├── hooks/
│   │   ├── useBookmakers.js     # Bookmaker data fetching
│   │   ├── useComparison.js     # Comparison functionality
│   │   ├── useBonuses.js        # Bonus data fetching
│   │   ├── useBlog.js           # Blog data fetching
│   │   ├── useAnalytics.js      # Analytics tracking
│   │   ├── useLocalStorage.js   # Local storage management
│   │   ├── useDebounce.js       # Debounce utility
│   │   └── useResponsive.js     # Responsive breakpoints
│   │
│   ├── context/
│   │   ├── AppContext.js        # Global application state
│   │   ├── ComparisonContext.js # Comparison state management
│   │   ├── ThemeContext.js      # Theme management
│   │   └── AnalyticsContext.js  # Analytics context
│   │
│   ├── utils/
│   │   ├── api.js               # API client configuration
│   │   ├── constants.js         # Application constants
│   │   ├── helpers.js           # Utility functions
│   │   ├── analytics.js         # Analytics helpers
│   │   ├── seo.js               # SEO utilities
│   │   ├── formatting.js        # Data formatting
│   │   ├── validation.js        # Form validation
│   │   └── breakpoints.js       # Responsive breakpoints
│   │
│   ├── lib/
│   │   ├── mongodb.js           # MongoDB connection (if using)
│   │   ├── auth.js              # Authentication utilities
│   │   └── gtm.js               # Google Tag Manager
│   │
│   └── types/
│       ├── index.js             # TypeScript type definitions
│       ├── bookmaker.js         # Bookmaker types
│       ├── bonus.js             # Bonus types
│       └── blog.js              # Blog types
│
├── .env.local.example           # Environment variables template
├── .env.local                   # Local environment variables
├── .env.production              # Production environment
├── package.json                 # Frontend dependencies
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration (if using)
└── tsconfig.json                # TypeScript configuration (if using)
```

---

## 🗄️ Database Structure (`/database`)

```
database/
├── seeds/
│   ├── bookmakers.json          # Sample bookmaker data
│   ├── bonuses.json             # Sample bonus data
│   ├── reviews.json             # Sample review data
│   ├── blogPosts.json           # Sample blog posts
│   └── users.json               # Sample admin users
│
├── migrations/
│   ├── 001_create_bookmakers.js
│   ├── 002_create_bonuses.js
│   ├── 003_create_reviews.js
│   ├── 004_create_blog_posts.js
│   └── 005_create_indexes.js
│
├── backups/
│   ├── daily/                   # Daily database backups
│   ├── weekly/                  # Weekly database backups
│   └── monthly/                 # Monthly database backups
│
└── scripts/
    ├── seed.js                  # Database seeding script
    ├── backup.js                # Backup script
    ├── restore.js               # Restore script
    └── indexes.js               # Index creation script
```

---

## 📚 Documentation Structure (`/docs`)

```
docs/
├── README.md                    # Project overview
├── SETUP.md                     # Setup instructions
├── API.md                       # API documentation
├── DEPLOYMENT.md                # Deployment guide
├── CONTRIBUTING.md              # Contribution guidelines
├── CHANGELOG.md                 # Version history
│
├── architecture/
│   ├── system-design.md         # System architecture
│   ├── database-schema.md       # Database design
│   ├── api-design.md            # API design patterns
│   └── security.md              # Security considerations
│
├── design/
│   ├── brand-guidelines.md      # Brand identity guide
│   ├── ui-components.md         # UI component library
│   ├── responsive-design.md     # Responsive design guide
│   └── accessibility.md         # Accessibility guidelines
│
├── development/
│   ├── coding-standards.md      # Code style guide
│   ├── testing.md               # Testing strategy
│   ├── performance.md           # Performance optimization
│   └── seo.md                   # SEO best practices
│
└── deployment/
    ├── production.md            # Production deployment
    ├── staging.md               # Staging environment
    ├── monitoring.md            # Monitoring setup
    └── backup.md                # Backup strategy
```

---

## 🔧 Shared Utilities (`/shared`)

```
shared/
├── types/
│   ├── index.js                 # Common type definitions
│   ├── api.js                   # API response types
│   └── database.js              # Database model types
│
├── utils/
│   ├── validation.js            # Shared validation rules
│   ├── constants.js             # Shared constants
│   ├── helpers.js               # Common helper functions
│   └── formatters.js            # Data formatting utilities
│
└── config/
    ├── database.js              # Database configuration
    ├── api.js                   # API configuration
    └── environment.js           # Environment configuration
```

---

## 🐳 Docker Configuration

```
# docker-compose.yml (Root)
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/betcompare

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

## 📦 Package Management

### Root Package.json
```json
{
  "name": "betcompare-microsite",
  "version": "1.0.0",
  "workspaces": ["frontend", "backend"],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "npm run dev --workspace=backend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "build": "npm run build --workspace=backend && npm run build --workspace=frontend",
    "start": "npm run start --workspace=backend & npm run start --workspace=frontend",
    "test": "npm run test --workspace=backend && npm run test --workspace=frontend",
    "lint": "npm run lint --workspace=backend && npm run lint --workspace=frontend"
  }
}
```

---

## 🔐 Environment Variables

### Backend Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/betcompare
DATABASE_NAME=betcompare

# Server
PORT=5000
NODE_ENV=development
API_BASE_URL=http://localhost:5000

# Security
JWT_SECRET=your-jwt-secret-key
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

# External APIs
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10MB

# Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

### Frontend Environment Variables
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# SEO
NEXT_PUBLIC_SITE_NAME=BetCompare.co.ke
NEXT_PUBLIC_SITE_DESCRIPTION=Compare Kenya's Best Betting Sites

# Features
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 🚀 Deployment Structure

### Production Deployment
```
production/
├── frontend/                    # Vercel deployment
│   ├── vercel.json
│   └── build/
├── backend/                     # Railway/DigitalOcean deployment
│   ├── Dockerfile
│   ├── docker-compose.prod.yml
│   └── dist/
├── database/                    # MongoDB Atlas
│   └── connection-string.txt
└── cdn/                         # Static assets CDN
    └── images/
```

---

## 📊 File Size Estimations

| Directory | Estimated Size | File Count |
|-----------|----------------|------------|
| `/backend` | ~50MB | ~150 files |
| `/frontend` | ~200MB | ~300 files |
| `/database` | ~10MB | ~50 files |
| `/docs` | ~5MB | ~30 files |
| `/shared` | ~2MB | ~20 files |
| **Total** | **~267MB** | **~550 files** |

---

## 🔍 Key File Indexes

### Critical Configuration Files
- `backend/src/app.js` - Express app configuration
- `backend/src/config/database.js` - MongoDB connection
- `frontend/next.config.js` - Next.js configuration
- `frontend/src/pages/_app.js` - React app wrapper
- `docker-compose.yml` - Container orchestration
- `package.json` - Root workspace configuration

### Main Entry Points
- `backend/server.js` - Backend server entry
- `frontend/src/pages/index.js` - Frontend homepage
- `frontend/src/components/layout/Layout.jsx` - Main layout
- `database/scripts/seed.js` - Database seeding

### SEO & Analytics Files
- `frontend/public/sitemap.xml` - Site map
- `frontend/public/robots.txt` - Robots file
- `frontend/src/components/seo/SEOHead.jsx` - SEO component
- `frontend/src/utils/analytics.js` - Analytics utilities

---

This project structure provides a scalable, maintainable foundation for the BetCompare.co.ke microsite with clear separation of concerns and optimal organization for a full-stack development team. 