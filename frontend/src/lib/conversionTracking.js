/**
 * Conversion Tracking & Funnel Analysis
 * Specialized for betting comparison platform
 */

import { trackComparisonFunnel, trackConversion as gaTrackConversion } from './analytics';
import { gtmEvent } from './gtm';

/**
 * Conversion Funnel Steps for Betting Comparison Platform
 */
export const FUNNEL_STEPS = {
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
};

export const CONVERSION_TYPES = {
  AFFILIATE_CLICK: 'affiliate_click',
  BONUS_CLAIM: 'bonus_claim',
  REVIEW_READ: 'review_read',
  COMPARISON_COMPLETE: 'comparison_complete',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  CONTACT_FORM: 'contact_form'
};

/**
 * Conversion Funnel Tracker
 */
export class ConversionFunnel {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.funnelData = this.loadFunnelData();
    this.conversionValue = 0;
    this.attributionData = this.loadAttributionData();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  loadFunnelData() {
    const stored = sessionStorage.getItem(`funnel_${this.sessionId}`);
    return stored ? JSON.parse(stored) : {
      steps: [],
      startTime: Date.now(),
      currentStep: null,
      bookmakers: [],
      comparisons: [],
      conversions: []
    };
  }

  saveFunnelData() {
    sessionStorage.setItem(`funnel_${this.sessionId}`, JSON.stringify(this.funnelData));
  }

  loadAttributionData() {
    const stored = localStorage.getItem('attribution_data');
    return stored ? JSON.parse(stored) : {
      firstTouch: null,
      lastTouch: null,
      touchpoints: [],
      campaigns: []
    };
  }

  saveAttributionData() {
    localStorage.setItem('attribution_data', JSON.stringify(this.attributionData));
  }

  /**
   * Track funnel step progression
   */
  trackStep(step, data = {}) {
    const stepData = {
      step,
      timestamp: Date.now(),
      pageUrl: window.location.pathname,
      ...data
    };

    this.funnelData.steps.push(stepData);
    this.funnelData.currentStep = step;
    this.saveFunnelData();

    // Track to GA4
    trackComparisonFunnel(step, this.funnelData.bookmakers, {
      session_id: this.sessionId,
      step_number: this.funnelData.steps.length,
      time_in_funnel: Date.now() - this.funnelData.startTime
    });

    // Track to GTM
    gtmEvent('funnel_step', {
      funnel_step: step,
      step_number: this.funnelData.steps.length,
      session_id: this.sessionId,
      time_in_funnel: Date.now() - this.funnelData.startTime,
      event_category: 'Conversion Funnel',
      ...data
    });
  }

  /**
   * Track bookmaker interactions
   */
  trackBookmakerInteraction(bookmaker, action, context = {}) {
    // Add to funnel bookmakers if not already present
    if (!this.funnelData.bookmakers.find(b => b.name === bookmaker.name)) {
      this.funnelData.bookmakers.push({
        name: bookmaker.name,
        id: bookmaker.id,
        rating: bookmaker.rating,
        bonusValue: bookmaker.bonus_value,
        addedAt: Date.now()
      });
    }

    const interactionData = {
      bookmaker: bookmaker.name,
      action,
      timestamp: Date.now(),
      ...context
    };

    // Track specific funnel steps based on action
    switch (action) {
      case 'view_details':
        this.trackStep(FUNNEL_STEPS.VIEW_BOOKMAKER_DETAILS, interactionData);
        break;
      case 'add_to_comparison':
        this.trackStep(FUNNEL_STEPS.ADD_TO_COMPARISON, interactionData);
        break;
      case 'view_review':
        this.trackStep(FUNNEL_STEPS.READ_REVIEW, interactionData);
        break;
      case 'view_bonus':
        this.trackStep(FUNNEL_STEPS.VIEW_BONUS, interactionData);
        break;
      case 'affiliate_click':
        this.trackStep(FUNNEL_STEPS.CLICK_AFFILIATE, interactionData);
        this.trackConversion(bookmaker, CONVERSION_TYPES.AFFILIATE_CLICK);
        break;
    }

    this.saveFunnelData();
  }

  /**
   * Track comparison events
   */
  trackComparison(bookmakers, comparisonType = 'general') {
    const comparisonData = {
      bookmakers: bookmakers.map(b => b.name),
      comparisonType,
      timestamp: Date.now(),
      bookmakerCount: bookmakers.length
    };

    this.funnelData.comparisons.push(comparisonData);

    if (this.funnelData.comparisons.length === 1) {
      this.trackStep(FUNNEL_STEPS.START_COMPARISON, comparisonData);
    }

    this.trackStep(FUNNEL_STEPS.VIEW_COMPARISON, comparisonData);
    this.saveFunnelData();

    // Track micro-conversion
    this.trackMicroConversion('comparison_created', {
      comparison_type: comparisonType,
      bookmaker_count: bookmakers.length
    });
  }

  /**
   * Track conversions with attribution
   */
  trackConversion(bookmaker, conversionType, conversionValue = null) {
    const conversionData = {
      bookmaker: bookmaker.name,
      type: conversionType,
      value: conversionValue || this.calculateConversionValue(bookmaker, conversionType),
      timestamp: Date.now(),
      sessionId: this.sessionId,
      funnelSteps: this.funnelData.steps.length,
      timeToConversion: Date.now() - this.funnelData.startTime,
      attribution: this.getAttributionModel()
    };

    this.funnelData.conversions.push(conversionData);
    this.trackStep(FUNNEL_STEPS.CONVERSION, conversionData);
    this.saveFunnelData();

    // Track to GA4 with enhanced ecommerce
    gaTrackConversion(bookmaker, conversionType, conversionData.value);

    // Track to GTM
    gtmEvent('conversion', {
      conversion_type: conversionType,
      bookmaker_name: bookmaker.name,
      conversion_value: conversionData.value,
      session_id: this.sessionId,
      time_to_conversion: conversionData.timeToConversion,
      funnel_steps_completed: conversionData.funnelSteps,
      attribution_model: conversionData.attribution,
      event_category: 'Conversion'
    });

    // Update conversion value for session
    this.conversionValue += conversionData.value;

    // Track high-value conversions
    if (conversionData.value >= 1000) {
      this.trackHighValueConversion(conversionData);
    }
  }

  /**
   * Track micro-conversions (engagement events that indicate intent)
   */
  trackMicroConversion(eventType, data = {}) {
    gtmEvent('micro_conversion', {
      micro_conversion_type: eventType,
      session_id: this.sessionId,
      time_in_session: Date.now() - this.funnelData.startTime,
      event_category: 'Micro Conversion',
      ...data
    });
  }

  /**
   * Calculate conversion value based on bookmaker and type
   */
  calculateConversionValue(bookmaker, conversionType) {
    const baseValues = {
      [CONVERSION_TYPES.AFFILIATE_CLICK]: 100,
      [CONVERSION_TYPES.BONUS_CLAIM]: 50,
      [CONVERSION_TYPES.REVIEW_READ]: 25,
      [CONVERSION_TYPES.COMPARISON_COMPLETE]: 75,
      [CONVERSION_TYPES.NEWSLETTER_SIGNUP]: 30,
      [CONVERSION_TYPES.CONTACT_FORM]: 40
    };

    let value = baseValues[conversionType] || 0;

    // Adjust based on bookmaker rating
    if (bookmaker.rating) {
      value *= (parseFloat(bookmaker.rating) / 5);
    }

    // Adjust based on bonus value
    if (bookmaker.bonus_value) {
      value += Math.min(parseFloat(bookmaker.bonus_value) * 0.1, 50);
    }

    return Math.round(value);
  }

  /**
   * Get attribution model for conversion
   */
  getAttributionModel() {
    return {
      firstTouch: this.attributionData.firstTouch,
      lastTouch: this.attributionData.lastTouch,
      touchpointCount: this.attributionData.touchpoints.length,
      model: 'last_click' // Can be enhanced with more sophisticated models
    };
  }

  /**
   * Track high-value conversions with additional context
   */
  trackHighValueConversion(conversionData) {
    gtmEvent('high_value_conversion', {
      ...conversionData,
      conversion_tier: 'high_value',
      event_category: 'High Value Conversion'
    });

    // Track user segment for high-value conversions
    const userSegment = this.getUserSegment();
    gtmEvent('conversion_segment_analysis', {
      user_segment: userSegment,
      conversion_value: conversionData.value,
      bookmaker: conversionData.bookmaker,
      event_category: 'Conversion Analysis'
    });
  }

  /**
   * Get current user segment
   */
  getUserSegment() {
    const visits = parseInt(localStorage.getItem('visit_count') || '1');
    const conversions = this.funnelData.conversions.length;
    const comparisons = this.funnelData.comparisons.length;

    if (conversions >= 3) return 'high_converter';
    if (conversions >= 1) return 'converter';
    if (comparisons >= 3) return 'active_comparer';
    if (comparisons >= 1) return 'comparer';
    if (visits >= 5) return 'frequent_visitor';
    if (visits >= 2) return 'returning_visitor';
    return 'new_visitor';
  }

  /**
   * Analyze funnel performance
   */
  analyzeFunnel() {
    const steps = this.funnelData.steps;
    const analysis = {
      totalSteps: steps.length,
      timeInFunnel: Date.now() - this.funnelData.startTime,
      dropOffPoints: this.identifyDropOffPoints(),
      conversionRate: this.calculateConversionRate(),
      averageTimePerStep: this.calculateAverageTimePerStep(),
      mostEngagingStep: this.findMostEngagingStep()
    };

    gtmEvent('funnel_analysis', {
      ...analysis,
      session_id: this.sessionId,
      event_category: 'Funnel Analysis'
    });

    return analysis;
  }

  identifyDropOffPoints() {
    // Implementation would analyze step sequences to identify where users drop off
    return [];
  }

  calculateConversionRate() {
    const conversions = this.funnelData.conversions.length;
    const totalSteps = this.funnelData.steps.length;
    return totalSteps > 0 ? (conversions / totalSteps) * 100 : 0;
  }

  calculateAverageTimePerStep() {
    const steps = this.funnelData.steps;
    if (steps.length <= 1) return 0;

    const totalTime = Date.now() - this.funnelData.startTime;
    return totalTime / steps.length;
  }

  findMostEngagingStep() {
    // Analyze which step users spend most time on
    const stepTimes = {};
    const steps = this.funnelData.steps;

    for (let i = 1; i < steps.length; i++) {
      const step = steps[i].step;
      const timeSpent = steps[i].timestamp - steps[i-1].timestamp;
      stepTimes[step] = (stepTimes[step] || 0) + timeSpent;
    }

    return Object.keys(stepTimes).reduce((a, b) => 
      stepTimes[a] > stepTimes[b] ? a : b
    );
  }

  /**
   * Get funnel summary for analytics
   */
  getSummary() {
    return {
      sessionId: this.sessionId,
      steps: this.funnelData.steps.length,
      bookmakers: this.funnelData.bookmakers.length,
      comparisons: this.funnelData.comparisons.length,
      conversions: this.funnelData.conversions.length,
      conversionValue: this.conversionValue,
      timeInFunnel: Date.now() - this.funnelData.startTime,
      currentStep: this.funnelData.currentStep
    };
  }
}

/**
 * Attribution Tracking
 */
export class AttributionTracker {
  constructor() {
    this.touchpoints = this.loadTouchpoints();
    this.campaigns = this.loadCampaigns();
    this.init();
  }

  loadTouchpoints() {
    const stored = localStorage.getItem('touchpoints');
    return stored ? JSON.parse(stored) : [];
  }

  loadCampaigns() {
    const stored = localStorage.getItem('campaigns');
    return stored ? JSON.parse(stored) : [];
  }

  saveTouchpoints() {
    localStorage.setItem('touchpoints', JSON.stringify(this.touchpoints));
  }

  saveCampaigns() {
    localStorage.setItem('campaigns', JSON.stringify(this.campaigns));
  }

  init() {
    this.trackTouchpoint();
    this.trackCampaign();
  }

  trackTouchpoint() {
    const touchpoint = {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      utmParams: this.getUTMParams()
    };

    this.touchpoints.push(touchpoint);
    
    // Keep only last 10 touchpoints
    if (this.touchpoints.length > 10) {
      this.touchpoints = this.touchpoints.slice(-10);
    }

    this.saveTouchpoints();
  }

  trackCampaign() {
    const utmParams = this.getUTMParams();
    
    if (utmParams.utm_campaign) {
      const campaign = {
        ...utmParams,
        timestamp: Date.now(),
        url: window.location.href
      };

      this.campaigns.push(campaign);
      this.saveCampaigns();

      gtmEvent('campaign_attribution', {
        ...utmParams,
        event_category: 'Attribution'
      });
    }
  }

  getUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content')
    };
  }
}

// Initialize global conversion tracking
let globalFunnelTracker = null;
let globalAttributionTracker = null;

export const initConversionTracking = () => {
  if (typeof window === 'undefined') return;

  globalFunnelTracker = new ConversionFunnel();
  globalAttributionTracker = new AttributionTracker();

  // Track initial landing
  globalFunnelTracker.trackStep(FUNNEL_STEPS.LANDING, {
    landing_page: window.location.pathname,
    referrer: document.referrer
  });

  return {
    funnelTracker: globalFunnelTracker,
    attributionTracker: globalAttributionTracker
  };
};

export const getFunnelTracker = () => globalFunnelTracker;
export const getAttributionTracker = () => globalAttributionTracker;

export default {
  ConversionFunnel,
  AttributionTracker,
  initConversionTracking,
  getFunnelTracker,
  getAttributionTracker,
  FUNNEL_STEPS,
  CONVERSION_TYPES
}; 