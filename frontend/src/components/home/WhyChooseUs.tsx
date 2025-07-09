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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="card hover:shadow-medium transition-all duration-300 group"
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${benefit.bgColor} group-hover:scale-110 transition-transform duration-300`}>
              <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-lg text-primary mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhyChooseUs; 