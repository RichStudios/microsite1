import React from 'react';
import Head from 'next/head';

/**
 * Organization Schema Markup for BetCompare.co.ke
 */
export const OrganizationSchema = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BetCompare.co.ke",
    "alternateName": "BetCompare Kenya",
    "description": "Compare Kenya's best betting sites and bookmakers. Find the best odds, bonuses, and betting experiences with our comprehensive reviews and comparisons.",
    "url": "https://betcompare.co.ke",
    "logo": "https://betcompare.co.ke/images/logo/betcompare-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254-XXX-XXXX",
      "contactType": "customer service",
      "areaServed": "KE",
      "availableLanguage": ["English", "Swahili"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Kenya",
      "addressRegion": "Nairobi"
    },
    "sameAs": [
      "https://twitter.com/betcompareke",
      "https://t.me/betcompareke",
      "https://www.youtube.com/c/betcompareke"
    ],
    "founder": {
      "@type": "Organization",
      "name": "BetCompare Team"
    },
    "foundingDate": "2024",
    "knowsAbout": [
      "Sports Betting",
      "Online Bookmakers",
      "Betting Odds Comparison",
      "Kenya Betting Market",
      "M-Pesa Betting",
      "Betting Bonuses"
    ]
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </Head>
  );
};

/**
 * Review Schema Markup for Bookmaker Reviews
 */
export const ReviewSchema = ({
  bookmakerName,
  reviewRating,
  reviewText,
  pros = [],
  cons = [],
  author = "BetCompare Editorial Team",
  datePublished,
  dateModified
}) => {
  const reviewData = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Organization",
      "name": bookmakerName,
      "description": `${bookmakerName} - Online sports betting platform available in Kenya`
    },
    "author": {
      "@type": "Organization",
      "name": author
    },
    "datePublished": datePublished || new Date().toISOString().split('T')[0],
    "dateModified": dateModified || new Date().toISOString().split('T')[0],
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviewRating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": reviewText,
    "positiveNotes": pros,
    "negativeNotes": cons,
    "publisher": {
      "@type": "Organization",
      "name": "BetCompare.co.ke"
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewData) }}
      />
    </Head>
  );
};

/**
 * FAQ Page Schema Markup
 */
export const FAQSchema = ({ faqs }) => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </Head>
  );
};

/**
 * Breadcrumb List Schema Markup
 */
export const BreadcrumbSchema = ({ breadcrumbs }) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </Head>
  );
};

/**
 * Article Schema Markup for Blog Posts
 */
export const ArticleSchema = ({
  title,
  description,
  author = "BetCompare Editorial Team",
  datePublished,
  dateModified,
  url,
  imageUrl,
  category = "Sports Betting"
}) => {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "url": url,
    "image": imageUrl,
    "publisher": {
      "@type": "Organization",
      "name": "BetCompare.co.ke",
      "logo": {
        "@type": "ImageObject",
        "url": "https://betcompare.co.ke/images/logo/betcompare-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": category,
    "inLanguage": "en-KE",
    "isAccessibleForFree": true
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />
    </Head>
  );
};

/**
 * Website Schema Markup
 */
export const WebsiteSchema = () => {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BetCompare.co.ke",
    "alternateName": "BetCompare Kenya",
    "url": "https://betcompare.co.ke",
    "description": "Compare Kenya's best betting sites and bookmakers. Find the best odds, bonuses, and betting experiences.",
    "inLanguage": "en-KE",
    "isAccessibleForFree": true,
    "publisher": {
      "@type": "Organization",
      "name": "BetCompare.co.ke"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://betcompare.co.ke/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </Head>
  );
};

/**
 * Local Business Schema for Contact Page
 */
export const LocalBusinessSchema = () => {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BetCompare.co.ke",
    "description": "Kenya's leading betting comparison platform",
    "url": "https://betcompare.co.ke",
    "telephone": "+254-XXX-XXXX",
    "email": "info@betcompare.co.ke",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Kenya",
      "addressRegion": "Nairobi"
    },
    "openingHours": "Mo-Su 00:00-24:00",
    "areaServed": {
      "@type": "Country",
      "name": "Kenya"
    },
    "serviceType": "Betting Comparison Service",
    "knowsLanguage": ["English", "Swahili"]
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
      />
    </Head>
  );
};

/**
 * Offer Schema for Bonuses
 */
export const OfferSchema = ({
  name,
  description,
  validFrom,
  validThrough,
  eligibleQuantity,
  priceSpecification,
  offeredBy,
  url
}) => {
  const offerData = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": name,
    "description": description,
    "validFrom": validFrom,
    "validThrough": validThrough,
    "eligibleQuantity": {
      "@type": "QuantitativeValue",
      "value": eligibleQuantity || "1"
    },
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": priceSpecification?.price || "0",
      "priceCurrency": priceSpecification?.currency || "KES"
    },
    "offeredBy": {
      "@type": "Organization",
      "name": offeredBy
    },
    "url": url,
    "availability": "https://schema.org/InStock",
    "category": "Sports Betting Bonus"
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerData) }}
      />
    </Head>
  );
};

/**
 * Comparison Schema for Compare Pages
 */
export const ComparisonSchema = ({ items, comparisonType = "bookmaker" }) => {
  const comparisonData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${comparisonType.charAt(0).toUpperCase() + comparisonType.slice(1)} Comparison`,
    "description": `Compare different ${comparisonType}s side by side`,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Organization",
        "name": item.name,
        "description": item.description,
        "url": item.url,
        "aggregateRating": item.rating ? {
          "@type": "AggregateRating",
          "ratingValue": item.rating,
          "bestRating": "5",
          "worstRating": "1"
        } : undefined
      }
    }))
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonData) }}
      />
    </Head>
  );
};

/**
 * Combined Schema Component for Multiple Schemas
 */
export const CombinedSchema = ({ schemas = [] }) => {
  return (
    <Head>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}; 