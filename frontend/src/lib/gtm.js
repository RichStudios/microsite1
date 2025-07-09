/**
 * Google Tag Manager Implementation
 * Handles analytics, tracking, and custom events
 */

// GTM Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'GA-XXXXXXXXX';

/**
 * Initialize Google Tag Manager
 */
export const initGTM = () => {
  // Skip in development if no GTM_ID
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') {
    console.log('GTM not initialized: No GTM_ID provided');
    return;
  }

  // GTM Script injection
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `;
  document.head.appendChild(script);

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];
  
  console.log('GTM initialized with ID:', GTM_ID);
};

/**
 * GTM NoScript fallback
 */
export const GTMNoScript = () => {
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
};

/**
 * Send custom event to GTM
 */
export const gtmEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...parameters
  });

  console.log('GTM Event:', eventName, parameters);
};

/**
 * Page view tracking
 */
export const trackPageView = (url, title) => {
  gtmEvent('page_view', {
    page_location: url,
    page_title: title,
    content_group1: getContentGroup(url),
    custom_map: {
      custom_parameter: 'page_view'
    }
  });
};

/**
 * Get content group based on URL
 */
const getContentGroup = (url) => {
  if (url.includes('/review/')) return 'Reviews';
  if (url.includes('/blog/')) return 'Blog';
  if (url.includes('/compare')) return 'Compare';
  if (url.includes('/bonuses')) return 'Bonuses';
  if (url === '/') return 'Homepage';
  return 'Other';
};

/**
 * Bookmaker interaction tracking
 */
export const trackBookmakerInteraction = (action, bookmakerName, additionalData = {}) => {
  gtmEvent('bookmaker_interaction', {
    action: action,
    bookmaker_name: bookmakerName,
    event_category: 'Bookmaker',
    ...additionalData
  });
};

/**
 * Comparison tracking
 */
export const trackComparison = (bookmakers, comparisonType = 'general') => {
  gtmEvent('comparison_made', {
    bookmakers: bookmakers.join(', '),
    comparison_type: comparisonType,
    bookmaker_count: bookmakers.length,
    event_category: 'Comparison'
  });
};

/**
 * CTA button tracking
 */
export const trackCTAClick = (ctaText, ctaLocation, bookmakerName = null) => {
  gtmEvent('cta_click', {
    cta_text: ctaText,
    cta_location: ctaLocation,
    bookmaker_name: bookmakerName,
    event_category: 'CTA'
  });
};

/**
 * Search tracking
 */
export const trackSearch = (searchTerm, searchLocation, resultsCount = 0) => {
  gtmEvent('search', {
    search_term: searchTerm,
    search_location: searchLocation,
    results_count: resultsCount,
    event_category: 'Search'
  });
};

/**
 * Filter usage tracking
 */
export const trackFilterUsage = (filterType, filterValue, resultsCount = 0) => {
  gtmEvent('filter_used', {
    filter_type: filterType,
    filter_value: filterValue,
    results_count: resultsCount,
    event_category: 'Filter'
  });
};

/**
 * Review interaction tracking
 */
export const trackReviewInteraction = (action, bookmakerName, reviewRating = null) => {
  gtmEvent('review_interaction', {
    action: action,
    bookmaker_name: bookmakerName,
    review_rating: reviewRating,
    event_category: 'Review'
  });
};

/**
 * Blog engagement tracking
 */
export const trackBlogEngagement = (action, postTitle, postCategory = null) => {
  gtmEvent('blog_engagement', {
    action: action,
    post_title: postTitle,
    post_category: postCategory,
    event_category: 'Blog'
  });
};

/**
 * Bonus interaction tracking
 */
export const trackBonusInteraction = (action, bonusType, bookmakerName, bonusValue = null) => {
  gtmEvent('bonus_interaction', {
    action: action,
    bonus_type: bonusType,
    bookmaker_name: bookmakerName,
    bonus_value: bonusValue,
    event_category: 'Bonus'
  });
};

/**
 * Contact form tracking
 */
export const trackContactForm = (action, formType = 'contact') => {
  gtmEvent('form_interaction', {
    action: action,
    form_type: formType,
    event_category: 'Form'
  });
};

/**
 * Newsletter subscription tracking
 */
export const trackNewsletterSubscription = (location) => {
  gtmEvent('newsletter_signup', {
    signup_location: location,
    event_category: 'Newsletter'
  });
};

/**
 * Social sharing tracking
 */
export const trackSocialShare = (platform, contentType, contentTitle) => {
  gtmEvent('social_share', {
    platform: platform,
    content_type: contentType,
    content_title: contentTitle,
    event_category: 'Social'
  });
};

/**
 * Scroll depth tracking
 */
export const trackScrollDepth = (depth, pageUrl) => {
  gtmEvent('scroll_depth', {
    scroll_depth: depth,
    page_url: pageUrl,
    event_category: 'Engagement'
  });
};

/**
 * Time on page tracking
 */
export const trackTimeOnPage = (timeSpent, pageUrl) => {
  gtmEvent('time_on_page', {
    time_spent: timeSpent,
    page_url: pageUrl,
    event_category: 'Engagement'
  });
};

/**
 * Error tracking
 */
export const trackError = (errorType, errorMessage, pageUrl) => {
  gtmEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    page_url: pageUrl,
    event_category: 'Error'
  });
};

/**
 * Performance tracking
 */
export const trackPerformance = (metricName, value, pageUrl) => {
  gtmEvent('performance_metric', {
    metric_name: metricName,
    metric_value: value,
    page_url: pageUrl,
    event_category: 'Performance'
  });
};

/**
 * Conversion tracking (affiliate link clicks)
 */
export const trackConversion = (bookmakerName, conversionType = 'affiliate_click', conversionValue = null) => {
  gtmEvent('conversion', {
    bookmaker_name: bookmakerName,
    conversion_type: conversionType,
    conversion_value: conversionValue,
    event_category: 'Conversion'
  });
};

/**
 * Enhanced E-commerce tracking for bonuses
 */
export const trackBonusView = (bonus) => {
  gtmEvent('view_item', {
    currency: 'KES',
    value: bonus.value || 0,
    items: [{
      item_id: bonus.id,
      item_name: bonus.title,
      item_category: 'Bonus',
      item_brand: bonus.bookmaker,
      price: bonus.value || 0,
      quantity: 1
    }]
  });
};

/**
 * User engagement score calculation
 */
export const calculateEngagementScore = () => {
  if (typeof window === 'undefined') return 0;

  const timeOnSite = Date.now() - (window.sessionStart || Date.now());
  const pageViews = window.pageViewCount || 1;
  const interactions = window.interactionCount || 0;

  const score = Math.min(100, Math.round(
    (timeOnSite / 1000 / 60) * 10 + // Time in minutes * 10
    pageViews * 5 + // Page views * 5
    interactions * 2 // Interactions * 2
  ));

  return score;
};

/**
 * Session tracking utilities
 */
export const initSessionTracking = () => {
  if (typeof window === 'undefined') return;

  window.sessionStart = Date.now();
  window.pageViewCount = 0;
  window.interactionCount = 0;

  // Track session end
  window.addEventListener('beforeunload', () => {
    const engagementScore = calculateEngagementScore();
    gtmEvent('session_end', {
      session_duration: Date.now() - window.sessionStart,
      page_views: window.pageViewCount,
      interactions: window.interactionCount,
      engagement_score: engagementScore
    });
  });
};

/**
 * Increment interaction counter
 */
export const incrementInteractionCount = () => {
  if (typeof window !== 'undefined') {
    window.interactionCount = (window.interactionCount || 0) + 1;
  }
}; 