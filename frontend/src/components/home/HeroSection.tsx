import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-primary-navy to-primary-navy/80 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Compare Kenya's Best Betting Sites
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Find the best odds, bonuses, and M-Pesa support
          </p>
          <button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Compare Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;