import Head from 'next/head';

// Review Schema for Bookmaker Reviews
interface ReviewSchemaProps {
  itemName: string;
  rating: number;
  ratingCount: number;
  author: string;
  datePublished: string;
  description: string;
  image?: string;
  url?: string;
  pros?: string[];
  cons?: string[];
}

export const ReviewSchema: React.FC<ReviewSchemaProps> = ({
  itemName,
  rating,
  ratingCount,
  author,
  datePublished,
  description,
  image,
  url,
  pros = [],
  cons = []
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://betcompare.co.ke';
  
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Product",
      "name": itemName,
      "description": description,
      "image": image ? `${siteUrl}${image}` : undefined,
      "url": url ? `${siteUrl}${url}` : undefined,
      "brand": {
        "@type": "Brand",
        "name": itemName
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "ratingCount": ratingCount,
        "bestRating": 5,
        "worstRating": 1
      }
    },
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
    "description": description,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "positiveNotes": pros.length > 0 ? pros : undefined,
    "negativeNotes": cons.length > 0 ? cons : undefined
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema)
        }}
      />
    </Head>
  );
};

// FAQ Schema for FAQ Pages
interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const faqSchema = {
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
    </Head>
  );
};

// Article Schema for Blog Posts
interface ArticleSchemaProps {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
  articleBody?: string;
  keywords?: string[];
}

export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  headline,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
  articleBody,
  keywords = []
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://betcompare.co.ke';
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": `${siteUrl}${image}`,
    "url": `${siteUrl}${url}`,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "BetCompare.co.ke",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}${url}`
    },
    "articleBody": articleBody,
    "keywords": keywords.join(", ")
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema)
        }}
      />
    </Head>
  );
};

// Offer Schema for Bonuses
interface OfferSchemaProps {
  name: string;
  description: string;
  url: string;
  validFrom: string;
  validThrough?: string;
  priceSpecification?: {
    price: string;
    priceCurrency: string;
  };
  eligibleRegion?: string;
  seller: string;
}

export const OfferSchema: React.FC<OfferSchemaProps> = ({
  name,
  description,
  url,
  validFrom,
  validThrough,
  priceSpecification,
  eligibleRegion = "Kenya",
  seller
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://betcompare.co.ke';
  
  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": name,
    "description": description,
    "url": `${siteUrl}${url}`,
    "validFrom": validFrom,
    "validThrough": validThrough,
    "priceSpecification": priceSpecification,
    "eligibleRegion": {
      "@type": "Country",
      "name": eligibleRegion
    },
    "seller": {
      "@type": "Organization",
      "name": seller
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(offerSchema)
        }}
      />
    </Head>
  );
};

// Comparison Table Schema
interface ComparisonSchemaProps {
  name: string;
  description: string;
  items: Array<{
    name: string;
    description: string;
    rating?: number;
    url?: string;
    image?: string;
  }>;
}

export const ComparisonSchema: React.FC<ComparisonSchemaProps> = ({
  name,
  description,
  items
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://betcompare.co.ke';
  
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": item.name,
        "description": item.description,
        "url": item.url ? `${siteUrl}${item.url}` : undefined,
        "image": item.image ? `${siteUrl}${item.image}` : undefined,
        "aggregateRating": item.rating ? {
          "@type": "AggregateRating",
          "ratingValue": item.rating,
          "bestRating": 5,
          "worstRating": 1
        } : undefined
      }
    }))
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(comparisonSchema)
        }}
      />
    </Head>
  );
}; 