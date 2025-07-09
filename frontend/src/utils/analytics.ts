// Google Analytics and tracking utilities

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('click', 'button', `${buttonName} - ${location}`);
};

// Track affiliate link clicks
export const trackAffiliateClick = (bookmakerName: string, source: string, medium: string = 'cta') => {
  trackEvent('affiliate_click', 'engagement', `${bookmakerName} - ${source}`, 1);
  
  // Also send to backend for tracking
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/track/affiliate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookmaker: bookmakerName,
        source,
        medium,
        campaign: 'microsite',
      }),
    }).catch(err => console.error('Failed to track affiliate click:', err));
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent('form_submit', 'engagement', `${formName} - ${success ? 'success' : 'error'}`);
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', 'engagement', query, resultsCount);
};

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', 'engagement', `${depth}%`, depth);
};

// Track time on page
export const trackTimeOnPage = (seconds: number) => {
  trackEvent('time_on_page', 'engagement', 'seconds', seconds);
};

// Track video plays (if applicable)
export const trackVideoPlay = (videoTitle: string) => {
  trackEvent('video_play', 'engagement', videoTitle);
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('download', 'engagement', `${fileName} - ${fileType}`);
};

// Track outbound links
export const trackOutboundLink = (url: string, linkText: string) => {
  trackEvent('outbound_link', 'engagement', `${linkText} - ${url}`);
};

// Track social shares
export const trackSocialShare = (platform: string, url: string) => {
  trackEvent('social_share', 'engagement', `${platform} - ${url}`);
};

// Track newsletter signups
export const trackNewsletterSignup = (email: string, source: string) => {
  trackEvent('newsletter_signup', 'conversion', source);
};

// Track comparison tool usage
export const trackComparison = (bookmaker1: string, bookmaker2: string) => {
  trackEvent('comparison', 'tool_usage', `${bookmaker1} vs ${bookmaker2}`);
};

// Track filter usage
export const trackFilter = (filterType: string, filterValue: string) => {
  trackEvent('filter_usage', 'tool_usage', `${filterType}: ${filterValue}`);
};

// Track rating interactions
export const trackRating = (bookmakerName: string, rating: number) => {
  trackEvent('rating', 'engagement', bookmakerName, rating);
};

// Enhanced ecommerce tracking for affiliate conversions
export const trackAffiliateConversion = (bookmakerName: string, bonusAmount: number, conversionValue: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      value: conversionValue,
      currency: 'KES',
      transaction_id: `${bookmakerName}_${Date.now()}`,
      items: [{
        item_id: bookmakerName,
        item_name: `${bookmakerName} Signup`,
        item_category: 'Affiliate',
        item_brand: bookmakerName,
        price: bonusAmount,
        quantity: 1,
      }],
    });
  }
};

// Track user engagement score
export const trackEngagementScore = (score: number) => {
  trackEvent('engagement_score', 'user_behavior', 'score', score);
};

// Initialize analytics
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Utility to get user's country (for localized tracking)
export const getUserCountry = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_name || 'Unknown';
  } catch (error) {
    console.error('Failed to get user country:', error);
    return 'Unknown';
  }
};

// Utility to track user journey
export const trackUserJourney = (step: string, data?: any) => {
  if (typeof window !== 'undefined') {
    const journey = JSON.parse(localStorage.getItem('userJourney') || '[]');
    journey.push({
      step,
      timestamp: new Date().toISOString(),
      data,
    });
    localStorage.setItem('userJourney', JSON.stringify(journey));
    
    // Track the step
    trackEvent('user_journey', 'navigation', step);
  }
};

// Get user journey for analysis
export const getUserJourney = (): any[] => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('userJourney') || '[]');
  }
  return [];
};

// Clear user journey
export const clearUserJourney = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userJourney');
  }
}; 