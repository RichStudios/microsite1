const express = require('express');
const router = express.Router();

/**
 * Analytics API Routes
 * Handles all analytics data collection and processing
 */

// Track general analytics events
router.post('/track', async (req, res) => {
  try {
    const {
      event_type,
      timestamp,
      session_id,
      user_id,
      page_url,
      user_agent,
      referrer,
      ...eventData
    } = req.body;

    // Log analytics data (replace with database save in production)
    console.log('Analytics Event:', {
      event_type,
      timestamp,
      session_id,
      user_id,
      page_url,
      ...eventData
    });

    // Here you would typically save to analytics database
    // await analyticsService.trackEvent(req.body);

    res.status(200).json({ 
      success: true, 
      message: 'Event tracked successfully',
      event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track event' 
    });
  }
});

// Track affiliate clicks specifically
router.post('/track/affiliate', async (req, res) => {
  try {
    const {
      bookmaker_id,
      bookmaker_name,
      affiliate_url,
      position,
      section,
      bonus_value,
      user_id,
      session_id
    } = req.body;

    const affiliateData = {
      event_type: 'affiliate_click',
      bookmaker_id,
      bookmaker_name,
      affiliate_url,
      position,
      section,
      bonus_value,
      user_id,
      session_id,
      timestamp: new Date().toISOString(),
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    };

    console.log('Affiliate Click:', affiliateData);

    // Track conversion value
    const conversionValue = bonus_value || 100; // Default conversion value
    
    res.status(200).json({ 
      success: true, 
      message: 'Affiliate click tracked',
      conversion_value: conversionValue,
      click_id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error) {
    console.error('Affiliate tracking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track affiliate click' 
    });
  }
});

// Track user behavior events
router.post('/track/behavior', async (req, res) => {
  try {
    const {
      behavior_type,
      scroll_depth,
      time_on_page,
      click_coordinates,
      engagement_score,
      page_url,
      session_id
    } = req.body;

    const behaviorData = {
      event_type: 'user_behavior',
      behavior_type,
      scroll_depth,
      time_on_page,
      click_coordinates,
      engagement_score,
      page_url,
      session_id,
      timestamp: new Date().toISOString()
    };

    console.log('User Behavior:', behaviorData);

    res.status(200).json({ 
      success: true, 
      message: 'Behavior tracked successfully' 
    });
  } catch (error) {
    console.error('Behavior tracking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track behavior' 
    });
  }
});

// Track conversion funnel steps
router.post('/track/funnel', async (req, res) => {
  try {
    const {
      funnel_step,
      funnel_step_name,
      funnel_name,
      user_id,
      session_id,
      bookmaker_ids,
      comparison_data
    } = req.body;

    const funnelData = {
      event_type: 'funnel_step',
      funnel_step,
      funnel_step_name,
      funnel_name,
      user_id,
      session_id,
      bookmaker_ids,
      comparison_data,
      timestamp: new Date().toISOString()
    };

    console.log('Funnel Step:', funnelData);

    res.status(200).json({ 
      success: true, 
      message: 'Funnel step tracked',
      funnel_progress: `${funnel_step}/10`
    });
  } catch (error) {
    console.error('Funnel tracking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track funnel step' 
    });
  }
});

// Get analytics dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const { timeRange = '7d', metrics = 'all' } = req.query;

    // Mock analytics data for dashboard
    const analyticsData = {
      overview: {
        totalPageViews: 12547,
        uniqueVisitors: 3821,
        affiliateClicks: 892,
        conversionRate: 2.3,
        avgTimeOnPage: 156,
        bounceRate: 34.2
      },
      funnel: {
        steps: [
          { name: 'Landing', users: 3821, rate: 100 },
          { name: 'Browse Bookmakers', users: 3456, rate: 90.4 },
          { name: 'View Details', users: 2987, rate: 78.2 },
          { name: 'Start Comparison', users: 1893, rate: 49.5 },
          { name: 'Add to Comparison', users: 1234, rate: 32.3 },
          { name: 'View Comparison', users: 987, rate: 25.8 },
          { name: 'Read Review', users: 743, rate: 19.4 },
          { name: 'View Bonus', users: 623, rate: 16.3 },
          { name: 'Click Affiliate', users: 489, rate: 12.8 },
          { name: 'Conversion', users: 98, rate: 2.6 }
        ],
        dropOffAnalysis: {
          biggestDrops: [
            { from: 'View Details', to: 'Start Comparison', dropRate: 36.6 },
            { from: 'Start Comparison', to: 'Add to Comparison', dropRate: 34.8 }
          ]
        }
      },
      behavior: {
        scrollDepth: {
          '25%': 89.2,
          '50%': 67.8,
          '75%': 45.3,
          '90%': 23.1,
          '100%': 12.4
        },
        timeOnPage: {
          '0-30s': 23.4,
          '30-60s': 31.2,
          '1-2m': 28.7,
          '2-5m': 12.3,
          '5m+': 4.4
        },
        clickHeatmap: [
          { x: 150, y: 200, clicks: 234, element: 'cta-primary' },
          { x: 300, y: 450, clicks: 189, element: 'bookmaker-card' },
          { x: 450, y: 300, clicks: 156, element: 'comparison-button' }
        ],
        engagementScores: {
          high: 24.3,
          medium: 45.7,
          low: 30.0
        }
      },
      abTests: [
        {
          name: 'CTA Button Color',
          variants: [
            { name: 'Orange (Control)', users: 1234, conversions: 45, rate: 3.6 },
            { name: 'Blue', users: 1189, conversions: 38, rate: 3.2 },
            { name: 'Green', users: 1201, conversions: 52, rate: 4.3 }
          ],
          winner: 'Green',
          confidence: 95.2
        },
        {
          name: 'Hero Section Layout',
          variants: [
            { name: 'Original', users: 1987, conversions: 67, rate: 3.4 },
            { name: 'Simplified', users: 2034, conversions: 89, rate: 4.4 }
          ],
          winner: 'Simplified',
          confidence: 92.8
        }
      ],
      performance: {
        coreWebVitals: {
          lcp: 2.1, // Largest Contentful Paint
          fid: 45, // First Input Delay
          cls: 0.08 // Cumulative Layout Shift
        },
        pageLoadTimes: {
          avg: 1.8,
          p50: 1.6,
          p75: 2.1,
          p95: 3.2
        },
        errorRate: 0.3
      },
      topBookmakers: [
        { name: 'Betway', views: 1234, clicks: 89, conversion_rate: 7.2 },
        { name: 'MelBet', views: 1098, clicks: 76, conversion_rate: 6.9 },
        { name: '1XBet', views: 987, clicks: 62, conversion_rate: 6.3 },
        { name: 'Odibets', views: 876, clicks: 54, conversion_rate: 6.2 }
      ],
      timeRange,
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load dashboard data' 
    });
  }
});

// Get specific metric data
router.get('/metrics/:metric', async (req, res) => {
  try {
    const { metric } = req.params;
    const { timeRange = '7d', granularity = 'daily' } = req.query;

    // Mock metric data
    const metricData = {
      pageviews: generateTimeSeriesData(timeRange, 'pageviews'),
      conversions: generateTimeSeriesData(timeRange, 'conversions'),
      users: generateTimeSeriesData(timeRange, 'users'),
      revenue: generateTimeSeriesData(timeRange, 'revenue')
    };

    if (!metricData[metric]) {
      return res.status(404).json({
        success: false,
        message: 'Metric not found'
      });
    }

    res.status(200).json({
      success: true,
      metric,
      data: metricData[metric],
      timeRange,
      granularity
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load metric data' 
    });
  }
});

// Export analytics data
router.get('/export', async (req, res) => {
  try {
    const { format = 'json', timeRange = '7d', metrics = 'all' } = req.query;

    // Mock export data
    const exportData = {
      exportInfo: {
        timeRange,
        metrics,
        generatedAt: new Date().toISOString(),
        format
      },
      data: {
        // Include sample export data structure
        events: [
          {
            timestamp: '2024-01-07T10:30:00Z',
            event_type: 'affiliate_click',
            bookmaker_name: 'Betway',
            user_id: 'user_123',
            conversion_value: 100
          }
          // More events would be included
        ]
      }
    };

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics_${timeRange}_${Date.now()}.csv`);
      
      // Convert to CSV format
      const csv = convertToCSV(exportData.data.events);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=analytics_${timeRange}_${Date.now()}.json`);
      res.json(exportData);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to export data' 
    });
  }
});

// Helper function to generate time series data
function generateTimeSeriesData(timeRange, metric) {
  const days = parseInt(timeRange.replace('d', ''));
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    let value;
    switch (metric) {
      case 'pageviews':
        value = Math.floor(Math.random() * 500) + 200;
        break;
      case 'conversions':
        value = Math.floor(Math.random() * 20) + 5;
        break;
      case 'users':
        value = Math.floor(Math.random() * 150) + 50;
        break;
      case 'revenue':
        value = Math.floor(Math.random() * 5000) + 1000;
        break;
      default:
        value = Math.floor(Math.random() * 100);
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value
    });
  }
  
  return data;
}

// Helper function to convert JSON to CSV
function convertToCSV(data) {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}

module.exports = router; 