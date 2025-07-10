
import React from 'react';
import BookmakerCard from '../ui/BookmakerCard';

const FeaturedBookmakers: React.FC = () => {
  const featuredBookmakers = [
    {
      id: '1',
      name: 'Betway',
      logo: '/images/logos/betway-logo.png',
      rating: 4.8,
      bonus: 'Up to KSh 10,000 Welcome Bonus',
      features: ['M-Pesa Support', 'Live Betting', 'Mobile App', 'Fast Payouts'],
      pros: ['Excellent M-Pesa integration', 'Great live betting platform'],
      cons: ['Limited payment methods', 'High wagering requirements'],
      affiliate_link: 'https://betway.com/ke',
      slug: 'betway',
      min_deposit: 'KSh 50',
      payout_speed: '24 hours'
    },
    {
      id: '2',
      name: '1XBet',
      logo: '/images/logos/1xbet-logo.png',
      rating: 4.6,
      bonus: 'Up to KSh 15,000 First Deposit Bonus',
      features: ['Huge Markets', 'Live Streaming', 'Cryptocurrency', 'Casino Games'],
      pros: ['Massive betting markets', 'Great odds'],
      cons: ['Complex interface', 'Customer service issues'],
      affiliate_link: 'https://1xbet.com/ke',
      slug: '1xbet',
      min_deposit: 'KSh 100',
      payout_speed: '12-24 hours'
    },
    {
      id: '3',
      name: 'MelBet',
      logo: '/images/logos/melbet-logo.png',
      rating: 4.5,
      bonus: 'Up to KSh 8,000 Welcome Package',
      features: ['M-Pesa Ready', 'Live Casino', 'Virtual Sports', 'Mobile Optimized'],
      pros: ['User-friendly interface', 'Good mobile experience'],
      cons: ['Limited local support', 'Withdrawal delays'],
      affiliate_link: 'https://melbet.com/ke',
      slug: 'melbet',
      min_deposit: 'KSh 40',
      payout_speed: '1-3 days'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top-Rated Bookmakers in Kenya
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare the best betting sites with M-Pesa support, great odds, and reliable payouts
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBookmakers.map((bookmaker, index) => (
            <BookmakerCard 
              key={bookmaker.id} 
              bookmaker={bookmaker} 
              featured={index === 0}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary-navy to-primary-navy/80 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Want to See More Options?
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Compare all licensed bookmakers side by side
            </p>
            <a
              href="/compare"
              className="inline-block bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Compare All Bookmakers
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBookmakers;
