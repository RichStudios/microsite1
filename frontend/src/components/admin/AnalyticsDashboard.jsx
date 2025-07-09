/**
 * Analytics Dashboard Component
 * Comprehensive admin dashboard for viewing all analytics data
 */

import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiUsers, FiMousePointer, FiClock, 
  FiTarget, FiActivity, FiBarChart3, FiPieChart,
  FiRefreshCw, FiDownload, FiFilter, FiEye
} from 'react-icons/fi';

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real implementation, fetch from backend
      const data = await fetchAnalyticsData(timeRange);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async (timeRange) => {
    // Mock data - replace with actual API calls
    return {
      overview: {
        totalVisitors: 12450,
        totalConversions: 234,
        conversionRate: 1.88,
        averageTimeOnSite: 324,
        bounceRate: 42.3,
        topBookmakers: [
          { name: 'Betway', clicks: 892, conversions: 45 },
          { name: 'MelBet', clicks: 756, conversions: 38 },
          { name: '1XBet', clicks: 654, conversions: 32 },
          { name: 'OdiBets', clicks: 543, conversions: 28 }
        ]
      },
      funnel: {
        steps: [
          { name: 'Landing', users: 12450, conversionRate: 100 },
          { name: 'Browse Bookmakers', users: 8934, conversionRate: 71.8 },
          { name: 'View Details', users: 5672, conversionRate: 45.6 },
          { name: 'Start Comparison', users: 3421, conversionRate: 27.5 },
          { name: 'View Comparison', users: 2234, conversionRate: 17.9 },
          { name: 'Click Affiliate', users: 456, conversionRate: 3.7 },
          { name: 'Conversion', users: 234, conversionRate: 1.9 }
        ],
        dropOffPoints: [
          { step: 'Browse to Details', dropOffRate: 36.5 },
          { step: 'Details to Comparison', dropOffRate: 39.7 },
          { step: 'Comparison to Click', dropOffRate: 79.6 }
        ]
      },
      behavior: {
        scrollDepth: {
          '25%': 89.2,
          '50%': 67.8,
          '75%': 45.3,
          '100%': 23.1
        },
        timeOnPage: {
          '0-10s': 23.4,
          '10-30s': 34.2,
          '30-60s': 28.9,
          '60-300s': 11.2,
          '300s+': 2.3
        },
        clickHeatmap: [
          { element: 'Compare Button', clicks: 2341 },
          { element: 'Bookmaker Logo', clicks: 1987 },
          { element: 'Bonus Info', clicks: 1654 },
          { element: 'Review Link', clicks: 1432 }
        ],
        engagementScore: {
          low: 34.2,
          medium: 45.6,
          high: 16.8,
          veryHigh: 3.4
        }
      },
      abTests: [
        {
          name: 'CTA Button Color',
          status: 'active',
          variants: [
            { name: 'Orange', conversionRate: 2.3, users: 1200 },
            { name: 'Blue', conversionRate: 1.9, users: 1180 },
            { name: 'Green', conversionRate: 2.7, users: 1220 }
          ],
          significance: 95.2
        },
        {
          name: 'Homepage Layout',
          status: 'completed',
          variants: [
            { name: 'Control', conversionRate: 1.8, users: 2400 },
            { name: 'Variant A', conversionRate: 2.1, users: 2380 }
          ],
          significance: 98.7
        }
      ],
      performance: {
        pageLoadTime: 2.1,
        largestContentfulPaint: 1.8,
        firstInputDelay: 45,
        cumulativeLayoutShift: 0.08,
        coreWebVitalsScore: 92
      }
    };
  };

  const exportData = () => {
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics_${timeRange}_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiRefreshCw className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2 text-lg">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Track performance and user behavior insights</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            {/* Action Buttons */}
            <button
              onClick={loadDashboardData}
              className="btn btn-outline btn-sm"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            
            <button
              onClick={exportData}
              className="btn btn-primary btn-sm"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: FiBarChart3 },
            { id: 'funnel', label: 'Conversion Funnel', icon: FiTarget },
            { id: 'behavior', label: 'User Behavior', icon: FiUsers },
            { id: 'abtests', label: 'A/B Tests', icon: FiActivity },
            { id: 'performance', label: 'Performance', icon: FiTrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab data={dashboardData.overview} />}
        {activeTab === 'funnel' && <FunnelTab data={dashboardData.funnel} />}
        {activeTab === 'behavior' && <BehaviorTab data={dashboardData.behavior} />}
        {activeTab === 'abtests' && <ABTestsTab data={dashboardData.abTests} />}
        {activeTab === 'performance' && <PerformanceTab data={dashboardData.performance} />}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Visitors"
          value={data.totalVisitors.toLocaleString()}
          icon={FiUsers}
          trend="+12.5%"
          trendUp={true}
        />
        <MetricCard
          title="Conversions"
          value={data.totalConversions.toLocaleString()}
          icon={FiTarget}
          trend="+8.3%"
          trendUp={true}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.conversionRate}%`}
          icon={FiTrendingUp}
          trend="-2.1%"
          trendUp={false}
        />
        <MetricCard
          title="Avg. Time on Site"
          value={`${Math.floor(data.averageTimeOnSite / 60)}:${String(data.averageTimeOnSite % 60).padStart(2, '0')}`}
          icon={FiClock}
          trend="+5.7%"
          trendUp={true}
        />
        <MetricCard
          title="Bounce Rate"
          value={`${data.bounceRate}%`}
          icon={FiActivity}
          trend="-3.2%"
          trendUp={true}
        />
      </div>

      {/* Top Bookmakers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Bookmakers</h3>
        <div className="space-y-4">
          {data.topBookmakers.map((bookmaker, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  {index + 1}
                </div>
                <span className="font-medium">{bookmaker.name}</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>{bookmaker.clicks} clicks</span>
                <span>{bookmaker.conversions} conversions</span>
                <span className="font-medium text-primary">
                  {((bookmaker.conversions / bookmaker.clicks) * 100).toFixed(1)}% CVR
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Funnel Tab Component
const FunnelTab = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
        <div className="space-y-4">
          {data.steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-white rounded-lg border border-primary-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{step.name}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-lg font-bold text-primary">{step.users.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">{step.conversionRate}%</span>
                </div>
              </div>
              {/* Visual funnel shape */}
              <div 
                className="bg-primary-200 mx-auto mt-2"
                style={{
                  width: `${step.conversionRate}%`,
                  height: '4px',
                  maxWidth: '100%'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Drop-off Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Major Drop-off Points</h3>
        <div className="space-y-3">
          {data.dropOffPoints.map((dropOff, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="font-medium text-gray-900">{dropOff.step}</span>
              <span className="text-red-600 font-bold">{dropOff.dropOffRate}% drop-off</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Behavior Tab Component
const BehaviorTab = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scroll Depth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scroll Depth</h3>
          <div className="space-y-3">
            {Object.entries(data.scrollDepth).map(([depth, percentage]) => (
              <div key={depth} className="flex items-center justify-between">
                <span className="text-gray-600">{depth}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time on Page */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time on Page</h3>
          <div className="space-y-3">
            {Object.entries(data.timeOnPage).map(([timeRange, percentage]) => (
              <div key={timeRange} className="flex items-center justify-between">
                <span className="text-gray-600">{timeRange}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Click Heatmap */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Clicked Elements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.clickHeatmap.map((element, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{element.element}</span>
                <span className="text-lg font-bold text-primary">{element.clicks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Score Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement Levels</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.engagementScore).map(([level, percentage]) => (
            <div key={level} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{percentage}%</div>
              <div className="text-sm text-gray-600 capitalize">{level}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// A/B Tests Tab Component
const ABTestsTab = ({ data }) => {
  return (
    <div className="space-y-6">
      {data.map((test, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                test.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {test.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Statistical Significance: {test.significance}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {test.variants.map((variant, vIndex) => (
              <div key={vIndex} className="p-4 border rounded-lg">
                <div className="font-medium text-gray-900 mb-2">{variant.name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Users:</span>
                    <span className="font-medium">{variant.users.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate:</span>
                    <span className="font-bold text-primary">{variant.conversionRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Page Load Time"
            value={`${data.pageLoadTime}s`}
            status={data.pageLoadTime <= 3 ? 'good' : 'needs-improvement'}
          />
          <MetricCard
            title="LCP"
            value={`${data.largestContentfulPaint}s`}
            status={data.largestContentfulPaint <= 2.5 ? 'good' : 'needs-improvement'}
          />
          <MetricCard
            title="FID"
            value={`${data.firstInputDelay}ms`}
            status={data.firstInputDelay <= 100 ? 'good' : 'needs-improvement'}
          />
          <MetricCard
            title="CLS"
            value={data.cumulativeLayoutShift.toFixed(3)}
            status={data.cumulativeLayoutShift <= 0.1 ? 'good' : 'needs-improvement'}
          />
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <FiActivity className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-800">
              Overall Core Web Vitals Score: {data.coreWebVitalsScore}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ title, value, icon: Icon, trend, trendUp, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-white border-gray-200';
    }
  };

  return (
    <div className={`p-6 rounded-lg border ${status ? getStatusColor(status) : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        {Icon && <Icon className="w-8 h-8 text-gray-400" />}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 