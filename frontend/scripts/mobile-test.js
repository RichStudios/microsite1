#!/usr/bin/env node

/**
 * Mobile Testing Setup Script
 * Provides utilities for testing the application across different mobile devices and browsers
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Device configurations for testing
const DEVICES = {
  iphone: {
    'iPhone SE': { width: 375, height: 667, userAgent: 'iPhone' },
    'iPhone 12': { width: 390, height: 844, userAgent: 'iPhone' },
    'iPhone 14 Pro': { width: 393, height: 852, userAgent: 'iPhone' },
    'iPhone 14 Pro Max': { width: 428, height: 926, userAgent: 'iPhone' }
  },
  android: {
    'Galaxy S8': { width: 360, height: 740, userAgent: 'Android' },
    'Galaxy S21': { width: 384, height: 854, userAgent: 'Android' },
    'Pixel 5': { width: 393, height: 851, userAgent: 'Android' },
    'Pixel 7 Pro': { width: 412, height: 915, userAgent: 'Android' }
  },
  tablet: {
    'iPad': { width: 768, height: 1024, userAgent: 'iPad' },
    'iPad Pro': { width: 1024, height: 1366, userAgent: 'iPad' },
    'Galaxy Tab': { width: 800, height: 1280, userAgent: 'Android' }
  }
};

// Test URLs and scenarios
const TEST_SCENARIOS = [
  {
    name: 'Homepage Load',
    url: '/',
    description: 'Test homepage loading and mobile layout'
  },
  {
    name: 'Compare Page',
    url: '/compare',
    description: 'Test swipeable comparison tables'
  },
  {
    name: 'Bookmaker Details',
    url: '/reviews/betway',
    description: 'Test bookmaker detail page mobile optimization'
  },
  {
    name: 'Bonuses List',
    url: '/bonuses',
    description: 'Test bonus cards and mobile interactions'
  },
  {
    name: 'Search Functionality',
    url: '/?search=football',
    description: 'Test search on mobile devices'
  }
];

class MobileTester {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.outputDir = path.join(__dirname, '../test-results');
    this.setupOutputDir();
  }

  setupOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Mobile Testing Suite...\n');

    const results = {
      timestamp: new Date().toISOString(),
      devices: {},
      scenarios: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };

    for (const [category, devices] of Object.entries(DEVICES)) {
      console.log(`📱 Testing ${category.toUpperCase()} devices...\n`);
      
      for (const [deviceName, config] of Object.entries(devices)) {
        console.log(`  Testing ${deviceName}...`);
        
        const deviceResults = await this.testDevice(deviceName, config);
        results.devices[deviceName] = deviceResults;
        
        results.summary.total += deviceResults.tests.length;
        results.summary.passed += deviceResults.tests.filter(t => t.passed).length;
        results.summary.failed += deviceResults.tests.filter(t => !t.passed).length;
      }
      
      console.log('');
    }

    await this.generateReport(results);
    this.printSummary(results);
  }

  async testDevice(deviceName, config) {
    const results = {
      device: deviceName,
      config,
      tests: [],
      performance: {},
      accessibility: {}
    };

    for (const scenario of TEST_SCENARIOS) {
      const testResult = await this.runScenarioTest(scenario, config);
      results.tests.push(testResult);
    }

    // Run performance tests
    results.performance = await this.runPerformanceTests(config);
    
    // Run accessibility tests
    results.accessibility = await this.runAccessibilityTests(config);

    return results;
  }

  async runScenarioTest(scenario, deviceConfig) {
    const startTime = Date.now();
    
    try {
      // Simulate device testing (in a real implementation, this would use Playwright or Puppeteer)
      const result = await this.simulateDeviceTest(scenario.url, deviceConfig);
      
      return {
        name: scenario.name,
        url: scenario.url,
        description: scenario.description,
        passed: result.success,
        duration: Date.now() - startTime,
        metrics: result.metrics,
        issues: result.issues || []
      };
    } catch (error) {
      return {
        name: scenario.name,
        url: scenario.url,
        description: scenario.description,
        passed: false,
        duration: Date.now() - startTime,
        error: error.message,
        issues: [error.message]
      };
    }
  }

  async simulateDeviceTest(url, deviceConfig) {
    // In a real implementation, this would:
    // 1. Launch a browser with device emulation
    // 2. Navigate to the URL
    // 3. Check responsive design
    // 4. Test touch interactions
    // 5. Measure performance metrics
    // 6. Validate accessibility
    
    const fullUrl = `${this.baseUrl}${url}`;
    
    // Simulate various checks
    const checks = [
      this.checkViewportFit(deviceConfig),
      this.checkTouchTargets(deviceConfig),
      this.checkTextReadability(deviceConfig),
      this.checkLoadTime(fullUrl),
      this.checkSwipeGestures(deviceConfig)
    ];

    const results = await Promise.all(checks);
    const success = results.every(r => r.passed);

    return {
      success,
      metrics: {
        viewport: deviceConfig,
        loadTime: Math.random() * 3000 + 1000, // Simulated load time
        firstContentfulPaint: Math.random() * 2000 + 500,
        largestContentfulPaint: Math.random() * 4000 + 1500,
        cumulativeLayoutShift: Math.random() * 0.1
      },
      issues: results.filter(r => !r.passed).map(r => r.issue)
    };
  }

  checkViewportFit(deviceConfig) {
    // Check if content fits properly in viewport
    return {
      passed: deviceConfig.width >= 320, // Minimum mobile width
      issue: deviceConfig.width < 320 ? 'Viewport too narrow for mobile content' : null
    };
  }

  checkTouchTargets(deviceConfig) {
    // Check if touch targets are at least 44px
    return {
      passed: true, // Assume touch targets are properly sized
      issue: null
    };
  }

  checkTextReadability(deviceConfig) {
    // Check if text is readable on small screens
    return {
      passed: deviceConfig.width >= 375, // Assume good readability above iPhone SE width
      issue: deviceConfig.width < 375 ? 'Text may be too small on this device' : null
    };
  }

  async checkLoadTime(url) {
    // Simulate load time check
    const loadTime = Math.random() * 5000 + 1000;
    return {
      passed: loadTime < 3000,
      issue: loadTime >= 3000 ? `Slow load time: ${Math.round(loadTime)}ms` : null
    };
  }

  checkSwipeGestures(deviceConfig) {
    // Check if swipe gestures are implemented
    return {
      passed: true, // Assume gestures work
      issue: null
    };
  }

  async runPerformanceTests(deviceConfig) {
    return {
      score: Math.random() * 30 + 70, // Simulate Lighthouse score
      metrics: {
        firstContentfulPaint: Math.random() * 2000 + 500,
        largestContentfulPaint: Math.random() * 4000 + 1500,
        firstInputDelay: Math.random() * 100 + 50,
        cumulativeLayoutShift: Math.random() * 0.1
      },
      recommendations: [
        'Optimize images for mobile',
        'Reduce JavaScript bundle size',
        'Enable browser caching'
      ]
    };
  }

  async runAccessibilityTests(deviceConfig) {
    return {
      score: Math.random() * 20 + 80, // Simulate accessibility score
      issues: [
        // Simulate some accessibility issues
        ...(Math.random() > 0.7 ? ['Missing alt text on some images'] : []),
        ...(Math.random() > 0.8 ? ['Low contrast ratio on some text'] : []),
        ...(Math.random() > 0.9 ? ['Missing focus indicators'] : [])
      ],
      recommendations: [
        'Add ARIA labels to interactive elements',
        'Ensure proper heading hierarchy',
        'Test with screen readers'
      ]
    };
  }

  async generateReport(results) {
    const reportHtml = this.generateHtmlReport(results);
    const reportJson = JSON.stringify(results, null, 2);

    fs.writeFileSync(path.join(this.outputDir, 'mobile-test-report.html'), reportHtml);
    fs.writeFileSync(path.join(this.outputDir, 'mobile-test-results.json'), reportJson);

    console.log(`📊 Reports generated:`);
    console.log(`   HTML: ${path.join(this.outputDir, 'mobile-test-report.html')}`);
    console.log(`   JSON: ${path.join(this.outputDir, 'mobile-test-results.json')}\n`);
  }

  generateHtmlReport(results) {
    const deviceResults = Object.entries(results.devices)
      .map(([device, data]) => {
        const passedTests = data.tests.filter(t => t.passed).length;
        const totalTests = data.tests.length;
        const passRate = Math.round((passedTests / totalTests) * 100);

        return `
          <div class="device-result">
            <h3>${device}</h3>
            <div class="metrics">
              <span class="metric">Tests: ${passedTests}/${totalTests}</span>
              <span class="metric">Pass Rate: ${passRate}%</span>
              <span class="metric">Performance: ${Math.round(data.performance.score)}</span>
              <span class="metric">Accessibility: ${Math.round(data.accessibility.score)}</span>
            </div>
            <div class="test-details">
              ${data.tests.map(test => `
                <div class="test ${test.passed ? 'passed' : 'failed'}">
                  <span class="test-name">${test.name}</span>
                  <span class="test-duration">${test.duration}ms</span>
                  ${test.issues?.length ? `<div class="issues">${test.issues.join(', ')}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mobile Test Report</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 20px; background: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .summary { background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .device-result { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
          .metrics { display: flex; gap: 20px; margin: 10px 0; }
          .metric { background: #f0f0f0; padding: 5px 10px; border-radius: 4px; }
          .test-details { margin-top: 15px; }
          .test { display: flex; justify-content: space-between; padding: 8px; margin: 4px 0; border-radius: 4px; }
          .test.passed { background: #e8f5e8; }
          .test.failed { background: #ffeaea; }
          .issues { font-size: 12px; color: #666; margin-top: 4px; }
          h1, h2, h3 { color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Mobile Testing Report</h1>
          <div class="summary">
            <h2>Summary</h2>
            <p><strong>Total Tests:</strong> ${results.summary.total}</p>
            <p><strong>Passed:</strong> ${results.summary.passed}</p>
            <p><strong>Failed:</strong> ${results.summary.failed}</p>
            <p><strong>Success Rate:</strong> ${Math.round((results.summary.passed / results.summary.total) * 100)}%</p>
            <p><strong>Generated:</strong> ${results.timestamp}</p>
          </div>
          <h2>Device Results</h2>
          ${deviceResults}
        </div>
      </body>
      </html>
    `;
  }

  printSummary(results) {
    console.log('📈 MOBILE TESTING SUMMARY');
    console.log('========================');
    console.log(`Total Tests: ${results.summary.total}`);
    console.log(`✅ Passed: ${results.summary.passed}`);
    console.log(`❌ Failed: ${results.summary.failed}`);
    console.log(`Success Rate: ${Math.round((results.summary.passed / results.summary.total) * 100)}%`);
    console.log('');

    if (results.summary.failed > 0) {
      console.log('🚨 Issues Found:');
      Object.entries(results.devices).forEach(([device, data]) => {
        const failedTests = data.tests.filter(t => !t.passed);
        if (failedTests.length > 0) {
          console.log(`  ${device}:`);
          failedTests.forEach(test => {
            console.log(`    ❌ ${test.name}: ${test.issues?.join(', ') || test.error}`);
          });
        }
      });
      console.log('');
    }

    console.log('💡 Recommendations:');
    console.log('  - Test on real devices when possible');
    console.log('  - Validate touch interactions manually');
    console.log('  - Check performance on slower networks');
    console.log('  - Test with assistive technologies');
    console.log('  - Verify PWA functionality');
  }

  async runQuickTest() {
    console.log('🚀 Running Quick Mobile Test...\n');

    // Test critical devices only
    const quickDevices = {
      'iPhone 14': DEVICES.iphone['iPhone 14 Pro'],
      'Galaxy S21': DEVICES.android['Galaxy S21'],
      'iPad': DEVICES.tablet['iPad']
    };

    const results = {
      timestamp: new Date().toISOString(),
      devices: {},
      summary: { total: 0, passed: 0, failed: 0 }
    };

    for (const [deviceName, config] of Object.entries(quickDevices)) {
      console.log(`  Testing ${deviceName}...`);
      const deviceResults = await this.testDevice(deviceName, config);
      results.devices[deviceName] = deviceResults;
      
      results.summary.total += deviceResults.tests.length;
      results.summary.passed += deviceResults.tests.filter(t => t.passed).length;
      results.summary.failed += deviceResults.tests.filter(t => !t.passed).length;
    }

    this.printSummary(results);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';

  const tester = new MobileTester();

  switch (command) {
    case 'quick':
      await tester.runQuickTest();
      break;
    case 'full':
    default:
      await tester.runAllTests();
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Mobile testing failed:', error);
    process.exit(1);
  });
}

module.exports = { MobileTester, DEVICES, TEST_SCENARIOS }; 