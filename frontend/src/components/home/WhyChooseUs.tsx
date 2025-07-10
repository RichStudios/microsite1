import React from 'react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Comprehensive Comparison',
      description: 'Compare odds, bonuses, and features across all major Kenyan bookmakers in one place.'
    },
    {
      icon: '🏆',
      title: 'Expert Reviews',
      description: 'In-depth, unbiased reviews from betting experts who understand the Kenyan market.'
    },
    {
      icon: '💰',
      title: 'Best Bonuses',
      description: 'Find the highest value welcome bonuses and ongoing promotions available.'
    },
    {
      icon: '📱',
      title: 'Mobile-First',
      description: 'Optimized for mobile betting with M-Pesa integration and app recommendations.'
    },
    {
      icon: '⚡',
      title: 'Real-Time Updates',
      description: 'Live odds comparison and instant updates on bonuses and promotions.'
    },
    {
      icon: '🛡️',
      title: 'Safe & Secure',
      description: 'Only licensed, regulated bookmakers with proven track records in Kenya.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose BetCompare?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make finding the perfect bookmaker simple, fast, and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/compare"
            className="inline-flex items-center px-6 py-3 bg-primary-orange hover:bg-primary-orange/90 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Start Comparing Now
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;