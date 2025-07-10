import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      number: '15+',
      label: 'Licensed Bookmakers',
      description: 'All verified and regulated'
    },
    {
      number: '50K+',
      label: 'Happy Users',
      description: 'Trusted by Kenyan bettors'
    },
    {
      number: '24/7',
      label: 'Live Odds',
      description: 'Real-time updates'
    },
    {
      number: '1M+',
      label: 'Bets Compared',
      description: 'Find the best value'
    }
  ];

  return (
    <section className="py-16 bg-primary-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join Kenya's largest community of smart bettors who compare before they bet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-colors duration-200">
                <div className="text-3xl font-bold text-primary-orange mb-2">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </h3>
                <p className="text-white/70 text-sm">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;