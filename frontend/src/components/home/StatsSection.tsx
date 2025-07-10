import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      number: "15+",
      label: "Bookmakers Compared",
      description: "Licensed operators"
    },
    {
      number: "50K+",
      label: "Happy Users",
      description: "Monthly visitors"
    },
    {
      number: "24/7",
      label: "Updates",
      description: "Real-time data"
    },
    {
      number: "100%",
      label: "Unbiased",
      description: "Honest reviews"
    }
  ];

  return (
    <section className="py-16 bg-primary-navy text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Thousands of Kenyan Bettors
          </h2>
          <p className="text-lg opacity-90">
            Join the community that makes smarter betting decisions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-orange mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-sm opacity-75">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;