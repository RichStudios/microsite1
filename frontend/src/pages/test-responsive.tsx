/**
 * Test page for BetCompare.co.ke responsive components
 * Showcases all responsive components working together
 */

import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { useResponsiveState } from '../utils/responsive';

// Import responsive components
import ResponsiveGrid from '../components/layout/ResponsiveGrid';
import { ResponsiveHeading1, ResponsiveHeading2, ResponsiveHeading3, ResponsiveBody } from '../components/ui/ResponsiveTypography';
import { SwipeGesture, PullToRefresh, LongPress, Tap, TouchFeedback } from '../components/ui/MobileInteractions';
import ResponsivePerformanceMonitor, { useResponsivePerformanceMetrics } from '../components/ui/ResponsivePerformanceMonitor';

const TestResponsivePage: React.FC = () => {
  const [gestureLog, setGestureLog] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBookmaker, setSelectedBookmaker] = useState<number | null>(null);
  
  const responsiveState = useResponsiveState();
  const metrics = useResponsivePerformanceMetrics();

  const handleSwipe = useCallback((direction: string) => {
    setGestureLog(prev => [...prev.slice(-4), `Swiped ${direction} at ${new Date().toLocaleTimeString()}`]);
  }, []);

  const handleTap = useCallback((type: string) => {
    setGestureLog(prev => [...prev.slice(-4), `${type} tap at ${new Date().toLocaleTimeString()}`]);
  }, []);

  const handleLongPress = useCallback(() => {
    setGestureLog(prev => [...prev.slice(-4), `Long press at ${new Date().toLocaleTimeString()}`]);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    setGestureLog(prev => [...prev.slice(-4), `Refreshed at ${new Date().toLocaleTimeString()}`]);
  }, []);

  const handleBookmakerSelect = useCallback((id: number) => {
    setSelectedBookmaker(id);
  }, []);

  // Sample data for testing
  const sampleBookmakers = [
    { id: 1, name: 'BetWay Kenya', logo: '/images/betway.png', rating: 4.5, bonus: 'KES 10,000', features: ['Live Betting', 'Mobile App'], odds: 'Competitive', minDeposit: 100, link: '#' },
    { id: 2, name: 'SportPesa', logo: '/images/sportpesa.png', rating: 4.2, bonus: 'KES 5,000', features: ['Live Streaming', 'Cash Out'], odds: 'High', minDeposit: 50, link: '#' },
    { id: 3, name: 'Betin', logo: '/images/betin.png', rating: 4.0, bonus: 'KES 2,000', features: ['Quick Deposits', 'Jackpot'], odds: 'Standard', minDeposit: 20, link: '#' },
  ];

  return (
    <>
      <Head>
        <title>Responsive Components Test - BetCompare.co.ke</title>
        <meta name="description" content="Test page for responsive components" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ResponsivePerformanceMonitor 
        enabled={true}
        showDebugOverlay={process.env.NODE_ENV === 'development'}
        alertThresholds={{ 
          layoutShift: 0.1, 
          imageLoadTime: 1500, 
          touchLatency: 100 
        }}
      />

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <ResponsiveHeading1 className="text-center mb-8 text-blue-900">
            BetCompare.co.ke - Responsive Components Test
          </ResponsiveHeading1>

          {/* Responsive State Display */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <ResponsiveHeading2 className="mb-4">Current Responsive State</ResponsiveHeading2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><strong>Device:</strong> {responsiveState.device}</div>
              <div><strong>Breakpoint:</strong> {responsiveState.breakpoint}</div>
              <div><strong>Viewport:</strong> {responsiveState.width}×{responsiveState.height}</div>
              <div><strong>Touch:</strong> {responsiveState.isTouch ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Interactive Gestures Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <ResponsiveHeading2 className="mb-4">Mobile Interactions Test</ResponsiveHeading2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Swipe Test Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-48">
                <ResponsiveHeading3 className="mb-2">Swipe Test Area</ResponsiveHeading3>
                <SwipeGesture
                  onSwipeLeft={() => handleSwipe('left')}
                  onSwipeRight={() => handleSwipe('right')}
                  onSwipeUp={() => handleSwipe('up')}
                  onSwipeDown={() => handleSwipe('down')}
                  className="w-full h-32 bg-blue-100 rounded flex items-center justify-center text-gray-600"
                >
                  Swipe in any direction
                </SwipeGesture>
              </div>

              {/* Tap and Long Press Test */}
              <div className="space-y-4">
                <div>
                  <ResponsiveHeading3 className="mb-2">Tap Test</ResponsiveHeading3>
                  <Tap
                    onTap={() => handleTap('Single')}
                    onDoubleTap={() => handleTap('Double')}
                    className="w-full"
                  >
                    <TouchFeedback haptic={true}>
                      <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors">
                        Tap or Double Tap Me
                      </button>
                    </TouchFeedback>
                  </Tap>
                </div>

                <div>
                  <ResponsiveHeading3 className="mb-2">Long Press Test</ResponsiveHeading3>
                  <LongPress onLongPress={handleLongPress} delay={1000}>
                    <TouchFeedback visual={true}>
                      <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors">
                        Long Press Me (1s)
                      </button>
                    </TouchFeedback>
                  </LongPress>
                </div>
              </div>
            </div>

            {/* Gesture Log */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <ResponsiveHeading3 className="mb-2">Gesture Log</ResponsiveHeading3>
              <div className="text-sm space-y-1">
                {gestureLog.length === 0 ? (
                  <div className="text-gray-500">No gestures detected yet...</div>
                ) : (
                  gestureLog.map((log, index) => (
                    <div key={index} className="text-gray-700">{log}</div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pull to Refresh Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <ResponsiveHeading2 className="mb-4">Pull to Refresh Test</ResponsiveHeading2>
            <PullToRefresh onRefresh={handleRefresh}>
              <div className="min-h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                {refreshing ? 'Refreshing...' : 'Pull down to refresh (mobile) or scroll up'}
              </div>
            </PullToRefresh>
          </div>

          {/* Responsive Grid with Simple Cards */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <ResponsiveHeading2 className="mb-4">Responsive Grid Test</ResponsiveHeading2>
            <ResponsiveBody className="mb-6 text-gray-600">
              This grid automatically adjusts based on container size and viewport. 
              Selected bookmaker: {selectedBookmaker ? sampleBookmakers.find(b => b.id === selectedBookmaker)?.name : 'None'}
            </ResponsiveBody>
            
            <ResponsiveGrid
              minItemWidth={280}
              maxItemWidth={400}
              gap={20}
              className="mb-6"
            >
              {sampleBookmakers.map((bookmaker) => (
                <TouchFeedback key={bookmaker.id} haptic={true}>
                  <div 
                    className={`cursor-pointer bg-white rounded-lg shadow-md p-4 border-2 transition-all hover:shadow-lg ${ 
                      selectedBookmaker === bookmaker.id ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleBookmakerSelect(bookmaker.id)}
                  >
                    <ResponsiveHeading3 className="mb-2 text-gray-800">{bookmaker.name}</ResponsiveHeading3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Rating: {bookmaker.rating}/5</div>
                      <div>Bonus: {bookmaker.bonus}</div>
                      <div>Min Deposit: KES {bookmaker.minDeposit}</div>
                      <div>Features: {bookmaker.features.join(', ')}</div>
                    </div>
                  </div>
                </TouchFeedback>
              ))}
            </ResponsiveGrid>
          </div>

          {/* Typography Showcase */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <ResponsiveHeading2 className="mb-4">Responsive Typography Test</ResponsiveHeading2>
            <div className="space-y-4">
              <div>
                <ResponsiveHeading1 className="text-blue-900">
                  H1: Compare Kenya's Best Betting Sites
                </ResponsiveHeading1>
                <ResponsiveBody className="text-gray-600">
                  This heading scales fluidly from 24px on mobile to 60px on desktop
                </ResponsiveBody>
              </div>
              
              <div>
                <ResponsiveHeading2 className="text-orange-600">
                  H2: Top Features & Benefits
                </ResponsiveHeading2>
                <ResponsiveBody className="text-gray-600">
                  This heading scales from 20px on mobile to 48px on desktop
                </ResponsiveBody>
              </div>
              
              <div>
                <ResponsiveHeading3 className="text-green-600">
                  H3: Why Choose BetCompare.co.ke?
                </ResponsiveHeading3>
                <ResponsiveBody className="text-gray-600">
                  This heading scales from 18px on mobile to 36px on desktop
                </ResponsiveBody>
              </div>
              
              <div>
                <ResponsiveBody className="text-gray-800">
                  This body text scales from 14px on mobile to 18px on desktop. 
                  It provides optimal readability across all device sizes while maintaining 
                  the brand's professional appearance. The fluid typography system ensures 
                  consistent visual hierarchy and improved user experience.
                </ResponsiveBody>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <ResponsiveHeading2 className="mb-4">Performance Metrics</ResponsiveHeading2>
            {metrics && metrics.metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900">Viewport Changes</div>
                  <div className="text-blue-700">{metrics.metrics.viewportChanges?.length || 0}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-semibold text-green-900">Layout Shifts</div>
                  <div className="text-green-700">{metrics.metrics.layoutShifts?.length || 0}</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="font-semibold text-yellow-900">Image Loads</div>
                  <div className="text-yellow-700">{Object.keys(metrics.metrics.imageLoadingTimes || {}).length}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-semibold text-purple-900">Breakpoint Transitions</div>
                  <div className="text-purple-700">{Object.keys(metrics.metrics.breakpointTransitions || {}).length}</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="font-semibold text-red-900">Tap Target Misses</div>
                  <div className="text-red-700">{metrics.metrics.mobileSpecificMetrics?.tapTargetMisses || 0}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-semibold text-gray-900">Touch Events</div>
                  <div className="text-gray-700">{metrics.metrics.mobileSpecificMetrics?.touchEventLatency?.length || 0}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Loading performance metrics...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestResponsivePage; 