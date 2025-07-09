import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * Enhanced SEO Head Component with Comprehensive Meta Tags
 */
const SEOHead = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  author = 'BetCompare Editorial Team',
  publishedTime,
  modifiedTime,
  noindex = false,
  nofollow = false,
  schema = []
}) => {
  const router = useRouter();
  
  // Default values
  const siteName = 'BetCompare.co.ke';
  const siteUrl = 'https://betcompare.co.ke';
  const defaultDescription = 'Compare Kenya\'s best betting sites and bookmakers. Find the best odds, bonuses, and betting experiences with our comprehensive reviews and comparisons.';
  const defaultKeywords = [
    'Kenya betting sites',
    'bookmaker comparison',
    'best odds Kenya',
    'betting bonuses',
    'M-Pesa betting',
    'sports betting Kenya',
    'online bookmakers',
    'betting reviews'
  ];
  
  // Construct full URL
  const fullUrl = canonical || `${siteUrl}${router.asPath}`;
  
  // Combine keywords
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');
  
  // Default OG image
  const defaultOgImage = `${siteUrl}/images/og/og-default.jpg`;
  const ogImageUrl = ogImage || defaultOgImage;
  
  // Robots meta content
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1'
  ].join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title ? `${title} | ${siteName}` : `${siteName} - Compare Kenya's Best Betting Sites`}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title || `${siteName} - Compare Kenya's Best Betting Sites`} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:alt" content={title || siteName} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_KE" />
      
      {/* Article-specific Open Graph tags */}
      {ogType === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Sports Betting" />
          <meta property="article:tag" content="Kenya betting" />
          <meta property="article:tag" content="bookmaker comparison" />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@betcompareke" />
      <meta name="twitter:creator" content="@betcompareke" />
      <meta name="twitter:title" content={title || `${siteName} - Compare Kenya's Best Betting Sites`} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={title || siteName} />
      
      {/* Additional Meta Tags for SEO */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#1A1F36" />
      <meta name="msapplication-TileColor" content="#1A1F36" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Geo Tags for Kenya */}
      <meta name="geo.region" content="KE" />
      <meta name="geo.country" content="Kenya" />
      <meta name="geo.placename" content="Kenya" />
      <meta name="ICBM" content="-1.286389, 36.817223" /> {/* Nairobi coordinates */}
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-KE" />
      <link rel="alternate" hrefLang="en" href={fullUrl} />
      <link rel="alternate" hrefLang="en-ke" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Schema Markup */}
      {schema.map((schemaData, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      ))}
      
      {/* Additional Performance Hints */}
      <meta name="resource-type" content="document" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

/**
 * Homepage SEO Component
 */
export const HomepageSEO = () => (
  <SEOHead
    title="Compare Kenya's Best Betting Sites & Odds"
    description="Find the best betting sites in Kenya. Compare odds, bonuses, M-Pesa support, and reviews. Your trusted guide to safe and profitable betting."
    keywords={[
      'best betting sites Kenya',
      'Kenya bookmakers',
      'compare betting odds',
      'M-Pesa betting sites',
      'Kenya sports betting',
      'online betting Kenya'
    ]}
  />
);

/**
 * Compare Page SEO Component
 */
export const CompareSEO = () => (
  <SEOHead
    title="Compare Betting Sites - Side by Side Comparison"
    description="Compare Kenya's top betting sites side by side. See odds, bonuses, payment methods, and features to find your perfect bookmaker."
    keywords={[
      'compare bookmakers',
      'betting site comparison',
      'bookmaker comparison Kenya',
      'best odds comparison'
    ]}
  />
);

/**
 * Reviews Page SEO Component
 */
export const ReviewsSEO = () => (
  <SEOHead
    title="Betting Site Reviews - Expert Reviews & Ratings"
    description="Read detailed reviews of Kenya's top betting sites. Expert analysis of odds, bonuses, mobile apps, customer service, and more."
    keywords={[
      'betting site reviews',
      'bookmaker reviews Kenya',
      'betting platform reviews',
      'Kenya betting reviews'
    ]}
  />
);

/**
 * Bonuses Page SEO Component
 */
export const BonusesSEO = () => (
  <SEOHead
    title="Best Betting Bonuses in Kenya - Welcome Offers & Promotions"
    description="Discover the best betting bonuses and welcome offers in Kenya. Compare free bets, deposit bonuses, and exclusive promotions."
    keywords={[
      'betting bonuses Kenya',
      'welcome bonuses',
      'free bets Kenya',
      'betting promotions',
      'bookmaker bonuses'
    ]}
  />
);

/**
 * Blog SEO Component
 */
export const BlogSEO = ({ post }) => (
  <SEOHead
    title={post?.title}
    description={post?.excerpt}
    ogType="article"
    ogImage={post?.featuredImage}
    publishedTime={post?.publishedAt}
    modifiedTime={post?.updatedAt}
    author={post?.author?.name}
    keywords={post?.tags || []}
  />
);

/**
 * Dynamic Review SEO Component
 */
export const ReviewSEO = ({ bookmaker }) => (
  <SEOHead
    title={`${bookmaker?.name} Review - Expert Analysis & Rating`}
    description={`Complete ${bookmaker?.name} review. Expert analysis of odds, bonuses, mobile app, customer service, and more. See our ${bookmaker?.rating}/5 rating.`}
    keywords={[
      `${bookmaker?.name} review`,
      `${bookmaker?.name} Kenya`,
      `${bookmaker?.name} betting`,
      'bookmaker review'
    ]}
    ogType="article"
  />
);

export default SEOHead; 