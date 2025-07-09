import React from 'react';
import Link from 'next/link';
import { FiGift, FiCalendar, FiArrowRight, FiPercent } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';
import { handleImageError } from '../../utils/imageUtils';

interface Bonus {
  id: number;
  bookmaker: string;
  logo: string;
  title: string;
  amount: string;
  description: string;
  wagering: string;
  minDeposit: string;
  expiresAt: string;
  isNew: boolean;
  isPopular: boolean;
  affiliate_link: string;
}

const LatestBonuses: React.FC = () => {
  const latestBonuses: Bonus[] = [
    {
      id: 1,
      bookmaker: 'Betway',
      logo: '/images/logos/betway-logo.png',
      title: 'Welcome Bonus',
      amount: 'Up to KES 1,000',
      description: '100% deposit bonus on your first deposit',
      wagering: '5x',
      minDeposit: 'KES 100',
      expiresAt: '2024-12-31',
      isNew: true,
      isPopular: true,
      affiliate_link: '#',
    },
    {
      id: 2,
      bookmaker: 'MelBet',
      logo: '/images/logos/melbet-logo.png',
      title: 'Mega Welcome Bonus',
      amount: 'Up to KES 20,000',
      description: '100% first deposit bonus up to KES 20,000',
      wagering: '5x',
      minDeposit: 'KES 200',
      expiresAt: '2024-12-31',
      isNew: false,
      isPopular: true,
      affiliate_link: '#',
    },
    {
      id: 3,
      bookmaker: '1xBet',
      logo: '/images/logos/1xbet-logo.png',
      title: 'New Player Bonus',
      amount: 'Up to KES 15,000',
      description: 'Get 100% bonus on your first deposit',
      wagering: '5x',
      minDeposit: 'KES 100',
      expiresAt: '2024-12-31',
      isNew: false,
      isPopular: false,
      affiliate_link: '#',
    },
    {
      id: 4,
      bookmaker: 'Odibets',
      logo: '/images/logos/odibets-logo.png',
      title: 'First Deposit Bonus',
      amount: 'Up to KES 5,000',
      description: '50% bonus on your first deposit',
      wagering: '6x',
      minDeposit: 'KES 50',
      expiresAt: '2024-12-31',
      isNew: true,
      isPopular: false,
      affiliate_link: '#',
    },
  ];

  const handleClaimBonus = (bonusId: number, bookmaker: string) => {
    trackButtonClick('claim_bonus', 'latest_bonuses');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {latestBonuses.map((bonus) => (
        <div
          key={bonus.id}
          className="card hover:shadow-medium transition-all duration-300 group relative overflow-hidden"
        >
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col space-y-1">
            {bonus.isNew && (
              <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full font-medium">
                New
              </span>
            )}
            {bonus.isPopular && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                Popular
              </span>
            )}
          </div>

          {/* Bookmaker Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={bonus.logo}
              alt={bonus.bookmaker}
              className="h-10 w-10 object-contain"
              onError={(e) => handleImageError(e, bonus.bookmaker, 'bookmaker')}
            />
            <div>
              <h3 className="font-semibold text-primary">{bonus.bookmaker}</h3>
              <p className="text-sm text-gray-600">{bonus.title}</p>
            </div>
          </div>

          {/* Bonus Amount */}
          <div className="text-center mb-4">
            <div className="bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-lg p-3">
              <FiGift className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{bonus.amount}</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {bonus.description}
          </p>

          {/* Bonus Details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Wagering:</span>
              <span className="font-medium flex items-center">
                <FiPercent className="h-3 w-3 mr-1" />
                {bonus.wagering}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Min Deposit:</span>
              <span className="font-medium">{bonus.minDeposit}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Expires:</span>
              <span className="font-medium flex items-center">
                <FiCalendar className="h-3 w-3 mr-1" />
                {new Date(bonus.expiresAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Link
              href={bonus.affiliate_link}
              onClick={() => handleClaimBonus(bonus.id, bonus.bookmaker)}
              className="btn btn-primary btn-sm w-full inline-flex items-center justify-center"
            >
              Claim Bonus
              <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`/bonuses/${bonus.bookmaker.toLowerCase()}`}
              className="btn btn-outline btn-sm w-full text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestBonuses; 