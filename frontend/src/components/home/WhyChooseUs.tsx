import React from 'react';
import { FiShield, FiTrendingUp, FiUsers, FiClock, FiCheck, FiEye } from 'react-icons/fi';

const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      icon: FiShield,
      title: 'Trusted & Secure',
      description: 'We only recommend licensed bookmakers that are safe and secure for Kenyan bettors.',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: FiTrendingUp,
      title: 'Real-Time Odds',
      description: 'Get up-to-date odds comparisons across all major bookmakers in Kenya.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: FiUsers,
      title: 'Expert Reviews',
      description: 'Our team of betting experts thoroughly test each bookmaker to bring you honest reviews.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: FiClock,
      title: 'Always Updated',
      description: 'We constantly monitor bonuses, odds, and features to keep our information current.',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: FiCheck,
      title: 'M-Pesa Ready',
      description: 'All our recommended bookmakers support M-Pesa for easy deposits and withdrawals.',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: FiEye,
      title: 'Transparent',
      description: 'No hidden fees, no bias - just honest comparisons to help you make the best choice.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="relative bg-white rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-500 group border border-gray-100 hover:border-primary/20 transform hover:-translate-y-2"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex items-start space-x-4">
            <div className={`relative p-4 rounded-xl ${benefit.bgColor} group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md`}>
              <benefit.icon className={`h-7 w-7 ${benefit.color} relative z-10`} />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-xl text-primary mb-3 group-hover:text-primary-600 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {benefit.description}
              </p>
            </div>
          </div>
          
          {/* Subtle Border Animation */}
          <div className="absolute inset-0 rounded-2xl border border-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        </div>
      ))}
    </div>
  );
};

export default WhyChooseUs; 