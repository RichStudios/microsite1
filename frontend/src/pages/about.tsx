import React from 'react';
import Layout from '../components/layout/Layout';
import SEOHead from '../components/seo/SEOHead';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <SEOHead
        title="About BetCompare.co.ke - Kenya's Leading Betting Site Comparison"
        description="Learn about BetCompare.co.ke - your trusted source for unbiased betting site comparisons in Kenya. Our mission is to help you make informed betting decisions."
      />

      <div className="bg-primary-navy text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">About BetCompare.co.ke</h1>
            <p className="text-xl opacity-90">
              Your trusted source for unbiased betting site comparisons in Kenya
            </p>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-primary-navy mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-4">
                  At BetCompare.co.ke, we're committed to empowering Kenyan bettors with the information they need to make smart, informed decisions.
                </p>
                <p className="text-lg text-gray-600">
                  We provide transparent, unbiased comparisons of Kenya's top betting sites, helping you find the best odds, bonuses, and features that matter most to you.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary-navy mb-6">Why Trust Us?</h2>
                <ul className="space-y-3 text-lg text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-orange">✓</span>
                    <span>Independent reviews with no bias</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-orange">✓</span>
                    <span>Expert analysis from betting professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-orange">✓</span>
                    <span>Daily updates on odds and promotions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-orange">✓</span>
                    <span>Focus on M-Pesa and Kenyan market</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-primary-navy mb-6 text-center">What We Do</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-3">Research & Analysis</h3>
                  <p className="text-gray-600">
                    We thoroughly test and analyze every betting site to provide accurate, up-to-date information.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-3">Compare Features</h3>
                  <p className="text-gray-600">
                    Our comparison tools help you evaluate odds, bonuses, payment methods, and user experience.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-3">Provide Guidance</h3>
                  <p className="text-gray-600">
                    We offer expert recommendations tailored to different betting preferences and budgets.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary-navy mb-6">Start Comparing Today</h2>
              <p className="text-lg text-gray-600 mb-8">
                Ready to find the perfect betting site for your needs? Use our comparison tool to discover the best options available in Kenya.
              </p>
              <a
                href="/compare"
                className="bg-primary-orange text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Compare Betting Sites
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;