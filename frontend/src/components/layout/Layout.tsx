import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Components
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import BackToTop from '../ui/BackToTop';
import CookieConsent from '../ui/CookieConsent';

// Utils
import { trackUserJourney } from '../../utils/analytics';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'BetCompare.co.ke - Compare Kenya\'s Best Betting Sites',
  description = 'Compare top betting sites in Kenya. Find the best odds, bonuses, and reviews for Kenyan bookmakers. Make informed betting decisions with our comprehensive guides.',
  keywords = 'betting sites Kenya, best bookmakers Kenya, betting odds comparison, sports betting bonuses, M-Pesa betting, Kenya betting reviews',
  image = '/images/og-image.jpg',
  noIndex = false,
  canonicalUrl,
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page visits
  useEffect(() => {
    trackUserJourney('page_visit', {
      path: router.pathname,
      query: router.query,
    });
  }, [router.pathname, router.query]);

  // Generate full URLs
  const fullUrl = canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`;
  const imageUrl = image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_SITE_URL}${image}`;

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="BetCompare.co.ke" />
        <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullUrl} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BetCompare.co.ke" />
        <meta property="og:locale" content="en_KE" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:creator" content="@betcompare" />
        
        {/* Additional Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BetCompare" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BetCompare.co.ke",
              "alternateName": "BetCompare",
              "url": process.env.NEXT_PUBLIC_SITE_URL,
              "description": description,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <Header isScrolled={isScrolled} />

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* Back to Top Button */}
        {showBackToTop && <BackToTop />}

        {/* Cookie Consent */}
        <CookieConsent />
      </div>
    </>
  );
};

export default Layout; 