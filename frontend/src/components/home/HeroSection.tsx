import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-primary-navy to-primary-navy/90 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Compare Kenya's Best Betting Sites
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Find the best odds, bonuses, and M-Pesa support. Make informed decisions with our comprehensive comparison.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/compare"
              className="btn btn-primary bg-primary-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105"
            >
              Compare Now
            </Link>
            <Link 
              href="/bonuses"
              className="btn btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-navy px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              View Bonuses
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>M-Pesa Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Licensed Operators</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;