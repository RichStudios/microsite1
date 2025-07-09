# 🏆 BetCompare.co.ke - Compare Kenya's Best Betting Sites

> **"Compare Top Bookies & Odds Before You Bet"**

A modern, mobile-first microsite for comparing betting sites, bonuses, and odds in Kenya. Built with Next.js, React, Node.js, Express, and MongoDB.

## 📋 Project Overview

- **Vertical**: Bookmaker & Odds Comparison
- **Market**: Kenya
- **Tech Stack**: Next.js/React.js + Node.js/Express + MongoDB
- **Architecture**: Full-stack microsite with mobile-first design
- **SEO Focus**: Structured data, meta optimization, Core Web Vitals

## 🚀 Features

### Core Functionality
- ✅ **Bookmaker Comparison** - Side-by-side comparison of top betting sites
- ✅ **Detailed Reviews** - Comprehensive bookmaker reviews with pros/cons
- ✅ **Bonus Tracker** - Latest welcome bonuses and promotions
- ✅ **Mobile-First Design** - Optimized for 320px to 768px screens
- ✅ **SEO Optimized** - Schema markup, meta tags, structured data

### User Experience
- ✅ **Responsive Design** - Works on all devices
- ✅ **Fast Loading** - <3s page load times
- ✅ **Touch Friendly** - 48px minimum touch targets
- ✅ **Intuitive Navigation** - Clear user journey
- ✅ **Analytics Tracking** - User behavior insights

## 🏗️ Project Structure

```
BetCompare-Microsite/
├── backend/                     # Node.js/Express API Server
├── frontend/                    # Next.js/React Application
├── database/                    # Database seeds and migrations
├── docs/                        # Project documentation
├── shared/                      # Shared utilities and types
├── docker-compose.yml           # Docker configuration
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── package.json                 # Root package.json for workspaces
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+ with App Router
- **UI Library**: React 18+
- **Styling**: Styled Components + CSS Variables
- **State Management**: React Context + Custom Hooks
- **Analytics**: Google Tag Manager + Google Analytics 4

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS, Rate Limiting

### DevOps
- **Containerization**: Docker + Docker Compose
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Railway/DigitalOcean
- **Database**: MongoDB Atlas
- **Monitoring**: Sentry + Uptime monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/betcompare/microsite-1.git
   cd BetCompare-Microsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env.development
   
   # Frontend environment
   cp frontend/.env.local.example frontend/.env.local
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Using Docker (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

## 📊 Brand Guidelines

### Colors
- **Primary**: Navy Blue (#1A1F36) - Trust & Authority
- **Secondary**: Vivid Orange (#FF6B00) - Action & Energy
- **Accent**: Light Gray (#F3F5F9) - Clean UX

### Typography
- **Headers**: Montserrat Bold (Strong, readable)
- **Body**: Open Sans Regular (Clear, neutral)

### Voice & Tone
- **Personality**: Trustworthy, data-driven, transparent
- **Tone**: Informative, unbiased, expert with action-oriented CTAs
- **CTAs**: "Compare Now", "See Odds", "View Bonuses"

## 📱 Mobile-First Design

- **Breakpoints**: 320px (mobile) → 768px (tablet) → 1024px (desktop)
- **Touch Targets**: Minimum 48px height for all interactive elements
- **Navigation**: Hamburger menu with stacked links
- **Tables**: Horizontal scroll with sticky headers
- **CTAs**: Floating bottom bar + strategic placement

## 🔍 SEO Strategy

### Technical SEO
- **Schema Markup**: Review, FAQPage, BreadcrumbList, Organization
- **Meta Tags**: Dynamic titles, descriptions, Open Graph
- **Internal Linking**: Strategic cross-page connections
- **Sitemap**: Auto-generated XML sitemap
- **Performance**: Core Web Vitals optimization

### Content Strategy
- **H1-H3 Structure**: Proper heading hierarchy
- **Keywords**: Kenya betting, bookmaker comparison, odds comparison
- **Content Types**: Reviews, comparisons, guides, news
- **Rich Snippets**: Bonus info, ratings, quick facts

## 📈 Analytics & Tracking

### Events Tracked
- **Affiliate Clicks**: Track outbound bookmaker clicks
- **Comparisons**: Monitor comparison table usage
- **Form Submissions**: Contact and newsletter forms
- **Scroll Depth**: User engagement measurement
- **Page Performance**: Load times and Core Web Vitals

### Tools Used
- **Google Tag Manager**: Event tracking and conversion measurement
- **Google Analytics 4**: User behavior analysis
- **Microsoft Clarity**: Heat maps and session recordings
- **Search Console**: SEO performance monitoring

## 🔧 Development Scripts

```bash
# Development
npm run dev                      # Start both frontend and backend
npm run dev:frontend             # Start frontend only
npm run dev:backend              # Start backend only

# Building
npm run build                    # Build both applications
npm run build:frontend           # Build frontend only
npm run build:backend            # Build backend only

# Testing
npm run test                     # Run all tests
npm run test:frontend            # Run frontend tests
npm run test:backend             # Run backend tests

# Linting
npm run lint                     # Lint all code
npm run lint:fix                 # Fix linting issues
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Set build command: `npm run build --workspace=frontend`
4. Set output directory: `frontend/.next`

### Backend (Railway/DigitalOcean)
1. Create new service from GitHub repository
2. Set build command: `npm run build --workspace=backend`
3. Configure environment variables
4. Set start command: `npm run start --workspace=backend`

### Database (MongoDB Atlas)
1. Create new cluster
2. Configure IP whitelist
3. Create database user
4. Update connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Site**: https://betcompare.co.ke
- **API Documentation**: https://api.betcompare.co.ke/docs
- **Design System**: https://design.betcompare.co.ke
- **Status Page**: https://status.betcompare.co.ke

---

**Built with ❤️ by the BetCompare Team** 