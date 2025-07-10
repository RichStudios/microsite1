import React from 'react';
import { FiUsers, FiTrendingUp, FiGift, FiStar } from 'react-icons/fi';

interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  description: string;
  color: string;
}

const StatsSection: React.FC = () => {
  const stats: Stat[] = [
    {
      icon: FiStar,
      value: '50+',
      label: 'Bookmakers Reviewed',
      description: 'Comprehensive reviews of Kenya\'s top betting sites',
      color: 'text-primary',
    },
    {
      icon: FiUsers,
      value: '100K+',
      label: 'Bettors Helped',
      description: 'Kenyan bettors who found their perfect bookmaker',
      color: 'text-secondary',
    },
    {
      icon: FiGift,
      value: '200+',
      label: 'Bonuses Tracked',
      description: 'Welcome bonuses and promotions monitored daily',
      color: 'text-success',
    },
    {
      icon: FiTrendingUp,
      value: '95%',
      label: 'Success Rate',
      description: 'Users who found a better bookmaker through our site',
      color: 'text-warning',
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-4">
            Trusted by Kenyan Bettors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied bettors who use BetCompare.co.ke to find the best bookmakers in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white rounded-2xl shadow-soft p-8 hover:shadow-strong transition-all duration-500 border border-gray-100 hover:border-primary/20 overflow-hidden">
                {/* Floating Background Effect */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-150" />
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-500 shadow-inner`}>
                      <stat.icon className={`h-10 w-10 ${stat.color} transform group-hover:scale-110 transition-transform duration-300`} />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className={`text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      {stat.value}
                    </div>
                    <h3 className="text-xl font-semibold text-primary group-hover:text-primary-600 transition-colors duration-300">
                      {stat.label}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {stat.description}
                  </p>
                </div>
                
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.8/5 Average Rating</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Updated Daily</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <FiUsers className="h-4 w-4 text-primary" />
              <span className="text-sm text-gray-600">5,000+ Monthly Users</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 