/**
 * User Behavior Tracking & Analytics
 * Advanced behavioral insights for betting comparison platform
 */

import { trackScrollDepth, trackTimeOnPage, trackUserEngagement } from './analytics';
import { gtmEvent } from './gtm';

/**
 * Scroll Depth Tracking Class
 */
export class ScrollDepthTracker {
  constructor() {
    this.milestones = [25, 50, 75, 90, 100];
    this.triggered = new Set();
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    let ticking = false;
    
    const trackScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.checkMilestones();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
    window.addEventListener('resize', () => this.triggered.clear());
  }

  checkMilestones() {
    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

    this.milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !this.triggered.has(milestone)) {
        this.triggered.add(milestone);
        
        // Track to GA4
        trackScrollDepth(milestone, window.location.pathname);
        
        // Track to GTM
        gtmEvent('scroll_depth', {
          scroll_percentage: milestone,
          page_url: window.location.pathname,
          event_category: 'User Engagement'
        });

        // High engagement tracking
        if (milestone >= 75) {
          trackUserEngagement('high_engagement_scroll', milestone, {
            engagement_level: 'high'
          });
        }
      }
    });
  }
}

/**
 * Time on Page Tracking Class
 */
export class TimeTracker {
  constructor() {
    this.startTime = Date.now();
    this.milestones = [10, 30, 60, 120, 300]; // seconds
    this.triggered = new Set();
    this.isActive = true;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Track when user becomes inactive
    const inactivityTimeout = 30000; // 30 seconds
    let inactivityTimer;

    const resetInactivityTimer = () => {
      this.isActive = true;
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        this.isActive = false;
      }, inactivityTimeout);
    };

    // Events that indicate user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
      .forEach(event => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
      });

    // Check milestones every 5 seconds
    this.interval = setInterval(() => {
      if (this.isActive) {
        this.checkTimeMilestones();
      }
    }, 5000);

    // Track when page is about to unload
    window.addEventListener('beforeunload', () => {
      this.trackFinalTime();
    });

    // Track when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackFinalTime();
      }
    });
  }

  checkTimeMilestones() {
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

    this.milestones.forEach(milestone => {
      if (timeSpent >= milestone && !this.triggered.has(milestone)) {
        this.triggered.add(milestone);
        
        const engagementLevel = this.getEngagementLevel(milestone);
        
        // Track to GA4
        trackTimeOnPage(milestone, window.location.pathname, engagementLevel);
        
        // Track to GTM
        gtmEvent('time_on_page', {
          time_seconds: milestone,
          engagement_level: engagementLevel,
          page_url: window.location.pathname,
          event_category: 'User Engagement'
        });
      }
    });
  }

  trackFinalTime() {
    const finalTime = Math.floor((Date.now() - this.startTime) / 1000);
    const engagementLevel = this.getEngagementLevel(finalTime);
    
    trackTimeOnPage(finalTime, window.location.pathname, engagementLevel);
    
    gtmEvent('page_exit', {
      total_time_seconds: finalTime,
      engagement_level: engagementLevel,
      page_url: window.location.pathname,
      event_category: 'User Engagement'
    });
  }

  getEngagementLevel(seconds) {
    if (seconds >= 120) return 'high';
    if (seconds >= 30) return 'medium';
    return 'low';
  }

  destroy() {
    clearInterval(this.interval);
  }
}

/**
 * Click Heatmap Tracking
 */
export class ClickTracker {
  constructor() {
    this.clicks = [];
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    document.addEventListener('click', (event) => {
      this.trackClick(event);
    }, { passive: true });
  }

  trackClick(event) {
    const clickData = {
      x: event.clientX,
      y: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      element: event.target.tagName,
      elementId: event.target.id,
      elementClass: event.target.className,
      text: event.target.textContent?.substring(0, 50) || '',
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.clicks.push(clickData);

    // Track significant clicks
    if (this.isSignificantClick(event.target)) {
      gtmEvent('significant_click', {
        element_type: event.target.tagName,
        element_id: event.target.id,
        element_text: clickData.text,
        click_position_x: event.clientX,
        click_position_y: event.clientY,
        event_category: 'User Interaction'
      });
    }

    // Send heatmap data in batches
    if (this.clicks.length >= 50) {
      this.sendHeatmapData();
    }
  }

  isSignificantClick(element) {
    // Define what constitutes a significant click
    const significantTags = ['BUTTON', 'A', 'INPUT', 'SELECT'];
    const significantClasses = ['btn', 'cta', 'link', 'card'];
    
    return significantTags.includes(element.tagName) ||
           significantClasses.some(cls => element.className.includes(cls));
  }

  sendHeatmapData() {
    gtmEvent('heatmap_data', {
      clicks: this.clicks.slice(-50),
      page_url: window.location.pathname,
      event_category: 'Heatmap'
    });

    // Keep only the last 50 clicks to prevent memory issues
    this.clicks = this.clicks.slice(-50);
  }
}

/**
 * User Engagement Scoring
 */
export class EngagementScorer {
  constructor() {
    this.score = 0;
    this.interactions = 0;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Track various engagement signals
    this.trackMouseMovement();
    this.trackKeyboardActivity();
    this.trackFormInteractions();
    this.trackContentInteractions();
  }

  trackMouseMovement() {
    let mouseDistance = 0;
    let lastX = 0, lastY = 0;

    document.addEventListener('mousemove', (event) => {
      if (lastX && lastY) {
        const distance = Math.sqrt(
          Math.pow(event.clientX - lastX, 2) + 
          Math.pow(event.clientY - lastY, 2)
        );
        mouseDistance += distance;
        
        // Every 1000px of mouse movement = 1 engagement point
        if (mouseDistance >= 1000) {
          this.addEngagementScore(1, 'mouse_movement');
          mouseDistance = 0;
        }
      }
      lastX = event.clientX;
      lastY = event.clientY;
    }, { passive: true });
  }

  trackKeyboardActivity() {
    document.addEventListener('keydown', () => {
      this.addEngagementScore(2, 'keyboard_input');
    }, { passive: true });
  }

  trackFormInteractions() {
    document.addEventListener('input', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        this.addEngagementScore(3, 'form_interaction');
      }
    }, { passive: true });
  }

  trackContentInteractions() {
    // Track clicks on content elements
    document.addEventListener('click', (event) => {
      const points = this.getClickPoints(event.target);
      if (points > 0) {
        this.addEngagementScore(points, 'content_click');
      }
    }, { passive: true });
  }

  getClickPoints(element) {
    const tagName = element.tagName;
    const className = element.className;

    // Assign points based on element importance
    if (tagName === 'BUTTON' || className.includes('btn')) return 5;
    if (tagName === 'A') return 3;
    if (className.includes('card') || className.includes('bookmaker')) return 4;
    if (className.includes('comparison') || className.includes('filter')) return 3;
    if (tagName === 'INPUT' || tagName === 'SELECT') return 2;
    
    return 0;
  }

  addEngagementScore(points, source) {
    this.score += points;
    this.interactions++;

    // Track high engagement milestones
    if (this.score >= 50 && this.score % 25 === 0) {
      trackUserEngagement('engagement_milestone', this.score, {
        engagement_source: source,
        total_interactions: this.interactions,
        engagement_level: this.getEngagementLevel()
      });
    }
  }

  getEngagementLevel() {
    if (this.score >= 100) return 'very_high';
    if (this.score >= 50) return 'high';
    if (this.score >= 25) return 'medium';
    if (this.score >= 10) return 'low';
    return 'minimal';
  }

  getScore() {
    return {
      score: this.score,
      interactions: this.interactions,
      level: this.getEngagementLevel()
    };
  }
}

/**
 * A/B Testing Framework
 */
export class ABTestManager {
  constructor() {
    this.tests = new Map();
    this.userVariants = this.loadUserVariants();
  }

  loadUserVariants() {
    const stored = localStorage.getItem('ab_test_variants');
    return stored ? JSON.parse(stored) : {};
  }

  saveUserVariants() {
    localStorage.setItem('ab_test_variants', JSON.stringify(this.userVariants));
  }

  createTest(testName, variants, trafficAllocation = 1.0) {
    this.tests.set(testName, {
      variants,
      trafficAllocation,
      createdAt: Date.now()
    });

    // Assign user to variant if not already assigned
    if (!this.userVariants[testName]) {
      this.assignUserToVariant(testName);
    }

    return this.userVariants[testName];
  }

  assignUserToVariant(testName) {
    const test = this.tests.get(testName);
    if (!test) return null;

    // Check if user should be included in test
    if (Math.random() > test.trafficAllocation) {
      this.userVariants[testName] = 'control';
    } else {
      // Randomly assign to a variant
      const variants = ['control', ...test.variants];
      const randomIndex = Math.floor(Math.random() * variants.length);
      this.userVariants[testName] = variants[randomIndex];
    }

    this.saveUserVariants();

    // Track assignment
    gtmEvent('ab_test_assignment', {
      test_name: testName,
      variant: this.userVariants[testName],
      event_category: 'A/B Testing'
    });

    return this.userVariants[testName];
  }

  getVariant(testName) {
    return this.userVariants[testName] || 'control';
  }

  trackConversion(testName, conversionGoal, value = 1) {
    const variant = this.getVariant(testName);
    
    gtmEvent('ab_test_conversion', {
      test_name: testName,
      variant: variant,
      conversion_goal: conversionGoal,
      conversion_value: value,
      event_category: 'A/B Testing'
    });
  }
}

/**
 * Initialize All Tracking
 */
export const initUserBehaviorTracking = () => {
  if (typeof window === 'undefined') return;

  // Initialize all trackers
  const scrollTracker = new ScrollDepthTracker();
  const timeTracker = new TimeTracker();
  const clickTracker = new ClickTracker();
  const engagementScorer = new EngagementScorer();
  const abTestManager = new ABTestManager();

  // Store instances globally for access
  window.behaviorTrackers = {
    scroll: scrollTracker,
    time: timeTracker,
    click: clickTracker,
    engagement: engagementScorer,
    abTest: abTestManager
  };

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    timeTracker.destroy();
    clickTracker.sendHeatmapData();
  });

  return {
    scrollTracker,
    timeTracker,
    clickTracker,
    engagementScorer,
    abTestManager
  };
};

export default {
  ScrollDepthTracker,
  TimeTracker,
  ClickTracker,
  EngagementScorer,
  ABTestManager,
  initUserBehaviorTracking
}; 