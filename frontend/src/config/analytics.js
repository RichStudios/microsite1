/**
 * Analytics Configuration
 * Centralized configuration for all analytics and tracking systems
 */

// Environment Variables
export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GA_ID || null,
  
  // Google Tag Manager
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || null,
  
  // Legacy Google Analytics (fallback)
  GA_ID: process.env.NEXT_PUBLIC_GA_ID || null,
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
  ENABLE_BEHAVIOR_TRACKING: process.env.NEXT_PUBLIC_ENABLE_BEHAVIOR_TRACKING !== 'false',
  ENABLE_CONVERSION_TRACKING: process.env.NEXT_PUBLIC_ENABLE_CONVERSION_TRACKING !== 'false',
  ENABLE_AB_TESTING: process.env.NEXT_PUBLIC_ENABLE_AB_TESTING !== 'false',
  ENABLE_PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== 'false',
  
  // Debug Settings
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true',
  MOCK_DATA: process.env.NEXT_PUBLIC_MOCK_ANALYTICS_DATA === 'true',
  
  // Site Information
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'BetCompare.co.ke',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://betcompare.co.ke',
  SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Compare Kenya\'s Best Betting Sites',
};

// Tracking Categories
export const TRACKING_CATEGORIES = {
  USER_ENGAGEMENT: 'User Engagement',
  CONVERSION: 'Conversion',
  BOOKMAKER: 'Bookmaker',
  COMPARISON: 'Comparison',
  CTA: 'CTA',
  SEARCH: 'Search',
  FILTER: 'Filter',
  REVIEW: 'Review',
  BLOG: 'Blog',
  BONUS: 'Bonus',
  FORM: 'Form',
  ERROR: 'Error',
  PERFORMANCE: 'Performance',
  HEATMAP: 'Heatmap',
  FUNNEL: 'Conversion Funnel',
  AB_TESTING: 'A/B Testing',
  ATTRIBUTION: 'Attribution',
  MICRO_CONVERSION: 'Micro Conversion',
  HIGH_VALUE_CONVERSION: 'High Value Conversion',
  CONVERSION_ANALYSIS: 'Conversion Analysis',
  FUNNEL_ANALYSIS: 'Funnel Analysis'
};

// Event Names
export const EVENT_NAMES = {
  // Page Events
  PAGE_VIEW: 'page_view',
  PAGE_VIEW_ENHANCED: 'page_view_enhanced',
  PAGE_EXIT: 'page_exit',
  
  // User Engagement
  SCROLL_DEPTH: 'scroll',
  TIME_ON_PAGE: 'timing_complete',
  USER_ENGAGEMENT: 'user_engagement',
  ENGAGEMENT_MILESTONE: 'engagement_milestone',
  HIGH_ENGAGEMENT_SCROLL: 'high_engagement_scroll',
  
  // Bookmaker Interactions
  BOOKMAKER_INTERACTION: 'bookmaker_interaction',
  SELECT_ITEM: 'select_item',
  BOOKMAKER_VIEW: 'view_item',
  
  // Conversions
  CONVERSION: 'conversion',
  PURCHASE: 'purchase',
  MICRO_CONVERSION: 'micro_conversion',
  HIGH_VALUE_CONVERSION: 'high_value_conversion',
  
  // Comparison Funnel
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_TO_CART: 'add_to_cart',
  VIEW_CART: 'view_cart',
  FUNNEL_STEP: 'funnel_step',
  
  // Search & Filter
  SEARCH: 'search',
  FILTER_USED: 'filter_used',
  
  // CTA & Promotions
  SELECT_PROMOTION: 'select_promotion',
  CTA_CLICK: 'cta_click',
  SIGNIFICANT_CLICK: 'significant_click',
  
  // Forms
  FORM_INTERACTION: 'form_interaction',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  
  // Reviews & Content
  REVIEW_INTERACTION: 'review_interaction',
  BLOG_ENGAGEMENT: 'blog_engagement',
  BONUS_INTERACTION: 'bonus_interaction',
  
  // Technical
  EXCEPTION: 'exception',
  TIMING_COMPLETE: 'timing_complete',
  
  // Session & Attribution
  SESSION_START: 'session_start',
  CAMPAIGN_ATTRIBUTION: 'campaign_attribution',
  
  // A/B Testing
  AB_TEST_ASSIGNMENT: 'ab_test_assignment',
  AB_TEST_CONVERSION: 'ab_test_conversion'
};

// Custom Dimensions & Parameters
export const CUSTOM_DIMENSIONS = {
  USER_SEGMENT: 'user_segment',
  VISIT_COUNT: 'visit_count',
  DEVICE_TYPE: 'device_type',
  ENGAGEMENT_LEVEL: 'engagement_level',
  BOOKMAKER_PREFERENCE: 'bookmaker_preference',
  COMPARISON_FREQUENCY: 'comparison_frequency',
  CONVERSION_TYPE: 'conversion_type',
  FUNNEL_STEP: 'funnel_step',
  SESSION_ID: 'session_id',
  TIME_IN_FUNNEL: 'time_in_funnel',
  ATTRIBUTION_MODEL: 'attribution_model'
};

// Conversion Values (in KES for Kenya market)
export const CONVERSION_VALUES = {
  AFFILIATE_CLICK: 100,
  BONUS_CLAIM: 50,
  REVIEW_READ: 25,
  COMPARISON_COMPLETE: 75,
  NEWSLETTER_SIGNUP: 30,
  CONTACT_FORM: 40,
  SEARCH_PERFORMED: 10,
  FILTER_APPLIED: 15,
  TIME_MILESTONE: 5,
  SCROLL_MILESTONE: 5,
  SOCIAL_SHARE: 20,
  DOWNLOAD: 35
};

// A/B Testing Configuration
export const AB_TEST_CONFIG = {
  DEFAULT_TRAFFIC_ALLOCATION: 1.0,
  MINIMUM_SAMPLE_SIZE: 100,
  SIGNIFICANCE_THRESHOLD: 95,
  TEST_DURATION_DAYS: 14,
  VARIANTS: {
    CONTROL: 'control',
    VARIANT_A: 'variant_a',
    VARIANT_B: 'variant_b',
    VARIANT_C: 'variant_c'
  }
};

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  CORE_WEB_VITALS: {
    LCP_GOOD: 2500,    // ms
    LCP_POOR: 4000,    // ms
    FID_GOOD: 100,     // ms
    FID_POOR: 300,     // ms
    CLS_GOOD: 0.1,     // score
    CLS_POOR: 0.25     // score
  },
  PAGE_LOAD: {
    GOOD: 3000,        // ms
    POOR: 5000         // ms
  },
  TIME_ON_PAGE: {
    LOW_ENGAGEMENT: 10,    // seconds
    MEDIUM_ENGAGEMENT: 30, // seconds
    HIGH_ENGAGEMENT: 120   // seconds
  },
  SCROLL_DEPTH: {
    ENGAGED: 50,       // %
    HIGHLY_ENGAGED: 75 // %
  }
};

// Behavior Tracking Settings
export const BEHAVIOR_CONFIG = {
  SCROLL_MILESTONES: [25, 50, 75, 90, 100], // percentages
  TIME_MILESTONES: [10, 30, 60, 120, 300],  // seconds
  ENGAGEMENT_SCORE: {
    MOUSE_MOVEMENT: 1,
    KEYBOARD_INPUT: 2,
    FORM_INTERACTION: 3,
    CONTENT_CLICK: 2,
    CTA_CLICK: 5,
    BOOKMAKER_CLICK: 4,
    COMPARISON_CLICK: 3
  },
  INACTIVITY_TIMEOUT: 30000, // 30 seconds
  CLICK_BATCH_SIZE: 50,
  HEATMAP_ENABLED: true
};

// Funnel Steps Configuration
export const FUNNEL_CONFIG = {
  STEPS: {
    LANDING: 'landing',
    BROWSE_BOOKMAKERS: 'browse_bookmakers',
    VIEW_BOOKMAKER_DETAILS: 'view_bookmaker_details',
    START_COMPARISON: 'start_comparison',
    ADD_TO_COMPARISON: 'add_to_comparison',
    VIEW_COMPARISON: 'view_comparison',
    READ_REVIEW: 'read_review',
    VIEW_BONUS: 'view_bonus',
    CLICK_AFFILIATE: 'click_affiliate',
    CONVERSION: 'conversion'
  },
  SESSION_STORAGE_KEY: 'conversion_funnel',
  LOCAL_STORAGE_KEYS: {
    ATTRIBUTION: 'attribution_data',
    TOUCHPOINTS: 'touchpoints',
    CAMPAIGNS: 'campaigns',
    AB_TEST_VARIANTS: 'ab_test_variants'
  }
};

// Content Groups for GA4
export const CONTENT_GROUPS = {
  HOMEPAGE: 'Homepage',
  REVIEWS: 'Reviews',
  BLOG: 'Blog',
  COMPARE: 'Compare',
  BONUSES: 'Bonuses',
  ABOUT: 'About',
  CONTACT: 'Contact',
  FAQ: 'FAQ',
  OTHER: 'Other'
};

// Validation Functions
export const isAnalyticsEnabled = () => {
  return ANALYTICS_CONFIG.ENABLE_ANALYTICS && (
    ANALYTICS_CONFIG.GA4_ID || 
    ANALYTICS_CONFIG.GTM_ID || 
    ANALYTICS_CONFIG.GA_ID
  );
};

export const isFeatureEnabled = (feature) => {
  const featureMap = {
    behavior: ANALYTICS_CONFIG.ENABLE_BEHAVIOR_TRACKING,
    conversion: ANALYTICS_CONFIG.ENABLE_CONVERSION_TRACKING,
    abtest: ANALYTICS_CONFIG.ENABLE_AB_TESTING,
    performance: ANALYTICS_CONFIG.ENABLE_PERFORMANCE_MONITORING
  };
  
  return featureMap[feature] !== false;
};

export default {
  ANALYTICS_CONFIG,
  TRACKING_CATEGORIES,
  EVENT_NAMES,
  CUSTOM_DIMENSIONS,
  CONVERSION_VALUES,
  AB_TEST_CONFIG,
  PERFORMANCE_THRESHOLDS,
  BEHAVIOR_CONFIG,
  FUNNEL_CONFIG,
  CONTENT_GROUPS,
  isAnalyticsEnabled,
  isFeatureEnabled
}; 