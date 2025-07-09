import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  article?: boolean;
  noindex?: boolean;
  nofollow?: boolean;
  canonicalUrl?: string;
  structuredData?: any;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

const SEOHead: React.FC<SEOProps> = ({
  title = "Compare Kenya's Best Betting Sites | BetCompare.co.ke",
  description = "Find and compare the best betting sites in Kenya. Compare bonuses, odds, payment methods, and reviews before you bet. Updated daily.",
  keywords = "betting sites kenya, bookmaker comparison, betting bonuses, sports betting, m-pesa betting, kenya odds",
  image = "/images/og-default.jpg",
  article = false,
  noindex = false,
  nofollow = false,
  canonicalUrl,
  structuredData,
  breadcrumbs,
}) => {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://betcompare.co.ke';
  const fullUrl = `${siteUrl}${router.asPath}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  // Default structured data for Organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "BetCompare.co.ke",
        "description": "Kenya's leading betting comparison platform",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`,
          "width": 200,
          "height": 60
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254-700-000-000",
          "contactType": "customer service",
          "availableLanguage": ["English", "Swahili"]
        },
        "sameAs": [
          "https://twitter.com/betcompare",
          "https://facebook.com/betcompare"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "BetCompare.co.ke",
        "description": description,
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  // Add breadcrumb structured data if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    (defaultStructuredData["@graph"] as any).push({
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${siteUrl}${crumb.url}`
      }))
    });
  }

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || fullUrl} />
      
      {/* Robots Meta */}
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="BetCompare.co.ke" />
      <meta property="og:locale" content="en_KE" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@betcompare" />
      
      {/* Additional Meta Tags for Better SEO */}
      <meta name="author" content="BetCompare.co.ke" />
      <meta name="publisher" content="BetCompare.co.ke" />
      <meta name="language" content="en-KE" />
      <meta name="geo.region" content="KE" />
      <meta name="geo.country" content="Kenya" />
      
      {/* Mobile Optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
    </Head>
  );
};

export default SEOHead; 