import React from 'react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      title: "Unbiased Comparisons",
      description: "We provide honest, data-driven comparisons without favoring any particular bookmaker.",
      icon: "🎯"
    },
    {
      title: "M-Pesa Integration",
      description: "All featured bookmakers support M-Pesa for easy deposits and withdrawals.",
      icon: "📱"
    },
    {
      title: "Daily Updates",
      description: "Odds, bonuses, and information are updated daily to ensure accuracy.",
      icon: "🔄"
    },
    {
      title: "Expert Reviews",
      description: "Our team of betting experts thoroughly tests each platform before recommending.",
      icon: "⭐"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-navy mb-4">
            Why Choose BetCompare?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to helping Kenyan bettors make informed decisions with transparent, accurate information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary-navy mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;