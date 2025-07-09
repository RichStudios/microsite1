/**
 * Google Analytics 4 (GA4) Implementation
 * Enhanced analytics for betting comparison platform
 */

// Analytics Configuration
import { ANALYTICS_CONFIG, TRACKING_CATEGORIES, isAnalyticsEnabled } from '../config/analytics';

/**
 * Initialize Google Analytics 4
 */
export const initGA4 = () => {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;

  // Load GA4 script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', ANALYTICS_CONFIG.GA4_ID, {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      custom_parameter_1: 'bookmaker_category',
      custom_parameter_2: 'comparison_type',
      custom_parameter_3: 'user_segment'
    }
  });

  // Load GTM if configured
  if (ANALYTICS_CONFIG.GTM_ID) {
    initGTM();
  }
};

/**
 * Initialize Google Tag Manager
 */
const initGTM = () => {
  if (typeof window === 'undefined') return;

  // GTM script injection
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',ANALYTICS_CONFIG.GTM_ID);
};

/**
 * Enhanced Page View Tracking with Context
 */
export const trackPageView = (url, title, additionalData = {}) => {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;

  const pageData = {
    page_title: title || document.title,
    page_location: url || window.location.href,
    page_path: window.location.pathname,
    content_group1: getContentCategory(window.location.pathname),
    content_group2: getUserSegment(),
    ...additionalData
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('config', ANALYTICS_CONFIG.GA4_ID, pageData);
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      ...pageData
    });
  }

  // Send to backend for server-side analytics
  sendToBackend('pageview', pageData);
};

/**
 * Enhanced Ecommerce Tracking for Betting Platform
 */
export const trackBookmakerView = (bookmaker) => {
  if (!isAnalyticsEnabled()) return;

  const eventData = {
    event: TRACKING_CATEGORIES.ECOMMERCE.VIEW_ITEM,
    ecommerce: {
      currency: 'KES',
      value: bookmaker.rating * 10, // Convert rating to value
      items: [{
        item_id: bookmaker.id,
        item_name: bookmaker.name,
        item_category: 'Bookmaker',
        item_category2: bookmaker.category || 'Sports Betting',
        item_brand: bookmaker.name,
        price: bookmaker.rating * 10,
        quantity: 1
      }]
    },
    // Custom parameters
    bookmaker_id: bookmaker.id,
    bookmaker_name: bookmaker.name,
    bookmaker_rating: bookmaker.rating,
    page_section: 'bookmaker_listing'
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', eventData.event, eventData);
  }

  // Custom event for detailed tracking
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('bookmaker_view', eventData);
};

/**
 * Conversion Tracking with Enhanced Ecommerce
 */
export const trackConversion = (type, data = {}) => {
  if (!isAnalyticsEnabled()) return;

  const conversionValue = ANALYTICS_CONFIG.CONVERSION_VALUES[type] || 0;
  
  const eventData = {
    event: TRACKING_CATEGORIES.CONVERSION[type.toUpperCase()] || 'conversion',
    ecommerce: {
      currency: 'KES',
      value: conversionValue,
      transaction_id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      items: [{
        item_id: data.bookmaker_id || 'unknown',
        item_name: data.bookmaker_name || 'Unknown Bookmaker',
        item_category: 'Conversion',
        item_category2: type,
        price: conversionValue,
        quantity: 1
      }]
    },
    conversion_type: type,
    conversion_value: conversionValue,
    ...data
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: eventData.ecommerce.transaction_id,
      value: conversionValue,
      currency: 'KES',
      send_to: ANALYTICS_CONFIG.GA4_ID,
      items: eventData.ecommerce.items
    });
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('conversion', eventData);
};

/**
 * User Engagement Tracking
 */
export const trackUserEngagement = (action, data = {}) => {
  if (!isAnalyticsEnabled()) return;

  const eventData = {
    event: TRACKING_CATEGORIES.ENGAGEMENT[action.toUpperCase()] || 'user_engagement',
    engagement_action: action,
    engagement_time_msec: data.time || 0,
    ...data
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'user_engagement', eventData);
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('engagement', eventData);
};

/**
 * Search Tracking with Enhanced Context
 */
export const trackSearch = (searchTerm, results = 0, filters = {}) => {
  if (!isAnalyticsEnabled()) return;

  const eventData = {
    event: TRACKING_CATEGORIES.SEARCH.SEARCH,
    search_term: searchTerm,
    search_results: results,
    search_filters: JSON.stringify(filters),
    search_category: 'bookmaker_search'
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'search', eventData);
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('search', eventData);
};

/**
 * Comparison Funnel Tracking
 */
export const trackComparisonFunnel = (step, data = {}) => {
  if (!isAnalyticsEnabled()) return;

  const funnelSteps = {
    'landing': 1,
    'browse_bookmakers': 2,
    'view_details': 3,
    'start_comparison': 4,
    'add_to_comparison': 5,
    'view_comparison': 6,
    'read_review': 7,
    'view_bonus': 8,
    'click_affiliate': 9,
    'conversion': 10
  };

  const eventData = {
    event: TRACKING_CATEGORIES.FUNNEL[step.toUpperCase()] || 'funnel_step',
    funnel_step: funnelSteps[step] || 0,
    funnel_step_name: step,
    funnel_name: 'bookmaker_comparison',
    ...data
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'funnel_step', eventData);
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('funnel', eventData);
};

/**
 * Scroll Depth Tracking
 */
export const trackScrollDepth = (percentage, element = null) => {
  if (!isAnalyticsEnabled()) return;

  const eventData = {
    event: TRACKING_CATEGORIES.ENGAGEMENT.SCROLL,
    scroll_depth: percentage,
    page_url: window.location.href,
    element_id: element?.id || null,
    element_class: element?.className || null
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'scroll', eventData);
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('scroll', eventData);
};

/**
 * Time on Page Tracking
 */
export const trackTimeOnPage = (timeSpent, isEngaged = false) => {
  if (!isAnalyticsEnabled()) return;

  const eventData = {
    event: TRACKING_CATEGORIES.ENGAGEMENT.TIME_ON_PAGE,
    time_on_page: timeSpent,
    page_url: window.location.href,
    is_engaged: isEngaged,
    engagement_threshold: ANALYTICS_CONFIG.BEHAVIOR_TRACKING.TIME_THRESHOLD
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'time_on_page', eventData);
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('time_on_page', eventData);
};

/**
 * CTA Performance Tracking
 */
export const trackCTAClick = (ctaType, position, data = {}) => {
  if (!isAnalyticsEnabled()) return;

  const eventData = {
    event: TRACKING_CATEGORIES.CTA[ctaType.toUpperCase()] || 'cta_click',
    cta_type: ctaType,
    cta_position: position,
    page_url: window.location.href,
    ...data
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'cta_click', eventData);
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('cta_click', eventData);
};

/**
 * Error Tracking
 */
export const trackError = (errorType, errorMessage, context = {}) => {
  if (!isAnalyticsEnabled()) return;

  const eventData = {
    event: TRACKING_CATEGORIES.ERROR[errorType.toUpperCase()] || 'error',
    error_type: errorType,
    error_message: errorMessage,
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    ...context
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: errorType === 'fatal'
    });
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('error', eventData);
};

/**
 * Performance Tracking
 */
export const trackPerformance = (metric, value, context = {}) => {
  if (!isAnalyticsEnabled()) return;

  const eventData = {
    event: TRACKING_CATEGORIES.PERFORMANCE[metric.toUpperCase()] || 'performance',
    metric_name: metric,
    metric_value: value,
    page_url: window.location.href,
    ...context
  };

  // Send to GA4
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metric,
      value: value
    });
  }

  // Send to GTM
  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Send to backend
  sendToBackend('performance', eventData);
};

/**
 * Send Analytics Data to Backend
 */
const sendToBackend = async (eventType, data) => {
  if (!ANALYTICS_CONFIG.ENABLE_BACKEND_TRACKING || typeof window === 'undefined') return;

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        timestamp: new Date().toISOString(),
        session_id: getSessionId(),
        user_id: getUserId(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        ...data
      })
    });
  } catch (error) {
    if (ANALYTICS_CONFIG.DEBUG_MODE) {
      console.error('Analytics backend error:', error);
    }
  }
};

/**
 * Helper Functions
 */
const getContentCategory = (pathname) => {
  if (pathname.includes('/review')) return 'review';
  if (pathname.includes('/compare')) return 'comparison';
  if (pathname.includes('/bonuses')) return 'bonuses';
  if (pathname.includes('/blog')) return 'blog';
  return 'general';
};

const getUserSegment = () => {
  // Implement user segmentation logic
  if (typeof window !== 'undefined') {
    const visits = parseInt(localStorage.getItem('visit_count') || '1');
    if (visits === 1) return 'new_user';
    if (visits < 5) return 'returning_user';
    return 'frequent_user';
  }
  return 'unknown';
};

const getSessionId = () => {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
  return null;
};

const getUserId = () => {
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }
  return null;
};

/**
 * Enhanced Session Tracking
 */
export const initSessionTracking = () => {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;

  // Track session start
  const sessionData = {
    session_id: getSessionId(),
    user_id: getUserId(),
    session_start: new Date().toISOString(),
    entry_page: window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`
  };

  // Update visit count
  const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
  localStorage.setItem('visit_count', visitCount.toString());

  // Send session start event
  sendToBackend('session_start', sessionData);

  // Track session end on page unload
  window.addEventListener('beforeunload', () => {
    const sessionEndData = {
      session_id: getSessionId(),
      session_end: new Date().toISOString(),
      session_duration: Date.now() - parseInt(sessionStorage.getItem('session_start_time') || '0')
    };
    
    sendToBackend('session_end', sessionEndData);
  });

  // Store session start time
  sessionStorage.setItem('session_start_time', Date.now().toString());
};

// Stub: Track Bookmaker Selection
export const trackBookmakerSelection = (bookmaker, action, position) => {
  // TODO: Implement analytics logic for bookmaker selection
  // This is a stub to prevent import errors
};

// Stub: Track CTA Performance
export const trackCTAPerformance = (ctaText, ctaLocation, bookmaker, position) => {
  // TODO: Implement analytics logic for CTA performance
  // This is a stub to prevent import errors
};

// All tracking functions are already exported individually above 