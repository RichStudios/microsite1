/**
 * Analytics Hooks
 * Custom React hooks for easy analytics integration
 */

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';

// Analytics imports
import { 
  trackBookmakerSelection, 
  trackConversion, 
  trackUserEngagement,
  trackSearch,
  trackCTAPerformance 
} from '../lib/analytics';

import { 
  trackBookmakerInteraction,
  trackComparison,
  trackCTAClick,
  trackSearch as gtmTrackSearch,
  trackFilterUsage 
} from '../lib/gtm';

import { 
  getFunnelTracker,
  FUNNEL_STEPS,
  CONVERSION_TYPES 
} from '../lib/conversionTracking';

import { ANALYTICS_CONFIG, isAnalyticsEnabled } from '../config/analytics';

/**
 * Main Analytics Hook
 * Provides all analytics tracking functions
 */
export const useAnalytics = () => {
  const router = useRouter();
  const funnelTracker = getFunnelTracker();

  // Bookmaker tracking
  const trackBookmaker = useCallback((action, bookmaker, context = {}) => {
    if (!isAnalyticsEnabled()) return;

    // Track to GA4
    trackBookmakerSelection(bookmaker, action, context.position);
    
    // Track to GTM
    trackBookmakerInteraction(action, bookmaker.name, {
      rating: bookmaker.rating,
      bonus_value: bookmaker.bonus_value,
      ...context
    });

    // Track to conversion funnel
    if (funnelTracker) {
      funnelTracker.trackBookmakerInteraction(bookmaker, action, context);
    }
  }, [funnelTracker]);

  // Conversion tracking
  const trackConversionEvent = useCallback((bookmaker, conversionType, value = null) => {
    if (!isAnalyticsEnabled()) return;

    // Track to GA4
    trackConversion(bookmaker, conversionType, value);

    // Track to conversion funnel
    if (funnelTracker) {
      funnelTracker.trackConversion(bookmaker, conversionType, value);
    }
  }, [funnelTracker]);

  // CTA tracking
  const trackCTA = useCallback((ctaText, ctaLocation, bookmaker = null, position = null) => {
    if (!isAnalyticsEnabled()) return;

    // Track to GA4
    trackCTAPerformance(ctaText, ctaLocation, bookmaker, position);
    
    // Track to GTM
    trackCTAClick(ctaText, ctaLocation, bookmaker?.name);
  }, []);

  // Search tracking
  const trackSearchEvent = useCallback((searchTerm, location, resultsCount = 0, filters = []) => {
    if (!isAnalyticsEnabled()) return;

    // Track to GA4
    trackSearch(searchTerm, location, resultsCount, filters);
    
    // Track to GTM
    gtmTrackSearch(searchTerm, location, resultsCount);
  }, []);

  // Comparison tracking
  const trackComparisonEvent = useCallback((bookmakers, comparisonType = 'general') => {
    if (!isAnalyticsEnabled()) return;

    // Track to GTM
    trackComparison(bookmakers.map(b => b.name), comparisonType);

    // Track to conversion funnel
    if (funnelTracker) {
      funnelTracker.trackComparison(bookmakers, comparisonType);
    }
  }, [funnelTracker]);

  // Filter tracking
  const trackFilter = useCallback((filterType, filterValue, resultsCount = 0) => {
    if (!isAnalyticsEnabled()) return;

    trackFilterUsage(filterType, filterValue, resultsCount);
  }, []);

  // User engagement tracking
  const trackEngagement = useCallback((engagementType, value, context = {}) => {
    if (!isAnalyticsEnabled()) return;

    trackUserEngagement(engagementType, value, context);
  }, []);

  // Page tracking helper
  const trackPage = useCallback((pageName, category = null) => {
    if (!isAnalyticsEnabled()) return;

    const pageData = {
      page_name: pageName,
      page_category: category,
      page_path: router.asPath
    };

    // This would typically be handled by the router, but can be used for SPA navigation
    trackUserEngagement('page_interaction', 1, pageData);
  }, [router.asPath]);

  return {
    trackBookmaker,
    trackConversion: trackConversionEvent,
    trackCTA,
    trackSearch: trackSearchEvent,
    trackComparison: trackComparisonEvent,
    trackFilter,
    trackEngagement,
    trackPage,
    isEnabled: isAnalyticsEnabled()
  };
};

/**
 * Bookmaker Interaction Hook
 * Specialized hook for bookmaker-related tracking
 */
export const useBookmakerTracking = () => {
  const { trackBookmaker, trackConversion } = useAnalytics();

  const trackView = useCallback((bookmaker, context = {}) => {
    trackBookmaker('view_details', bookmaker, context);
  }, [trackBookmaker]);

  const trackCompare = useCallback((bookmaker, context = {}) => {
    trackBookmaker('add_to_comparison', bookmaker, context);
  }, [trackBookmaker]);

  const trackReview = useCallback((bookmaker, context = {}) => {
    trackBookmaker('view_review', bookmaker, context);
  }, [trackBookmaker]);

  const trackBonus = useCallback((bookmaker, context = {}) => {
    trackBookmaker('view_bonus', bookmaker, context);
  }, [trackBookmaker]);

  const trackAffiliate = useCallback((bookmaker, context = {}) => {
    trackBookmaker('affiliate_click', bookmaker, context);
    trackConversion(bookmaker, CONVERSION_TYPES.AFFILIATE_CLICK);
  }, [trackBookmaker, trackConversion]);

  return {
    trackView,
    trackCompare,
    trackReview,
    trackBonus,
    trackAffiliate
  };
};

/**
 * Conversion Funnel Hook
 * Track user progress through the conversion funnel
 */
export const useFunnelTracking = () => {
  const funnelTracker = getFunnelTracker();

  const trackStep = useCallback((step, data = {}) => {
    if (!funnelTracker) return;
    funnelTracker.trackStep(step, data);
  }, [funnelTracker]);

  const trackLanding = useCallback((data = {}) => {
    trackStep(FUNNEL_STEPS.LANDING, data);
  }, [trackStep]);

  const trackBrowse = useCallback((data = {}) => {
    trackStep(FUNNEL_STEPS.BROWSE_BOOKMAKERS, data);
  }, [trackStep]);

  const trackComparison = useCallback((bookmakers, data = {}) => {
    if (!funnelTracker) return;
    funnelTracker.trackComparison(bookmakers, data.comparisonType);
  }, [funnelTracker]);

  const getFunnelSummary = useCallback(() => {
    return funnelTracker ? funnelTracker.getSummary() : null;
  }, [funnelTracker]);

  return {
    trackStep,
    trackLanding,
    trackBrowse,
    trackComparison,
    getFunnelSummary,
    STEPS: FUNNEL_STEPS
  };
};

/**
 * A/B Testing Hook
 * Manage A/B test variants and track conversions
 */
export const useABTesting = () => {
  const abTestManager = typeof window !== 'undefined' && window.behaviorTrackers?.abTest;

  const createTest = useCallback((testName, variants, trafficAllocation = 1.0) => {
    if (!abTestManager) return 'control';
    return abTestManager.createTest(testName, variants, trafficAllocation);
  }, [abTestManager]);

  const getVariant = useCallback((testName) => {
    if (!abTestManager) return 'control';
    return abTestManager.getVariant(testName);
  }, [abTestManager]);

  const trackConversion = useCallback((testName, conversionGoal, value = 1) => {
    if (!abTestManager) return;
    abTestManager.trackConversion(testName, conversionGoal, value);
  }, [abTestManager]);

  return {
    createTest,
    getVariant,
    trackConversion: trackConversion,
    isEnabled: !!abTestManager
  };
};

/**
 * Performance Tracking Hook
 * Track performance metrics and Core Web Vitals
 */
export const usePerformanceTracking = () => {
  const performanceDataRef = useRef({});

  const trackMetric = useCallback((metricName, value, context = {}) => {
    if (!isAnalyticsEnabled()) return;

    performanceDataRef.current[metricName] = {
      value,
      timestamp: Date.now(),
      ...context
    };

    // Track to analytics
    trackUserEngagement('performance_metric', value, {
      metric_name: metricName,
      ...context
    });
  }, []);

  const trackCoreWebVital = useCallback((metric) => {
    trackMetric(metric.name, metric.value, {
      metric_type: 'core_web_vital',
      page_url: window.location.pathname
    });
  }, [trackMetric]);

  const getMetrics = useCallback(() => {
    return performanceDataRef.current;
  }, []);

  return {
    trackMetric,
    trackCoreWebVital,
    getMetrics
  };
};

/**
 * Scroll Tracking Hook
 * Track scroll depth and reading behavior
 */
export const useScrollTracking = (threshold = 75) => {
  const hasTrackedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.pageYOffset / 
        (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent >= threshold && !hasTrackedRef.current) {
        hasTrackedRef.current = true;
        
        const timeOnPage = Date.now() - startTimeRef.current;
        
        trackUserEngagement('deep_scroll', scrollPercent, {
          time_to_scroll: timeOnPage,
          scroll_threshold: threshold,
          page_url: window.location.pathname
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return {
    hasTrackedDeepScroll: hasTrackedRef.current
  };
};

/**
 * Form Tracking Hook
 * Track form interactions and submissions
 */
export const useFormTracking = (formName) => {
  const { trackEngagement } = useAnalytics();

  const trackStart = useCallback(() => {
    trackEngagement('form_start', 1, {
      form_name: formName,
      page_url: window.location.pathname
    });
  }, [trackEngagement, formName]);

  const trackSubmit = useCallback((success = true, data = {}) => {
    trackEngagement(success ? 'form_submit_success' : 'form_submit_error', 1, {
      form_name: formName,
      page_url: window.location.pathname,
      ...data
    });
  }, [trackEngagement, formName]);

  const trackFieldInteraction = useCallback((fieldName, action = 'focus') => {
    trackEngagement('form_field_interaction', 1, {
      form_name: formName,
      field_name: fieldName,
      action: action,
      page_url: window.location.pathname
    });
  }, [trackEngagement, formName]);

  return {
    trackStart,
    trackSubmit,
    trackFieldInteraction
  };
};

export default {
  useAnalytics,
  useBookmakerTracking,
  useFunnelTracking,
  useABTesting,
  usePerformanceTracking,
  useScrollTracking,
  useFormTracking
}; 