import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiBarChart, FiGift, FiSearch } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';

interface MobileBottomBarProps {
  className?: string;
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ className = '' }) => {
  const router = useRouter();

  const bottomBarItems = [
    {
      name: 'Home',
      href: '/',
      icon: FiHome,
      current: router.pathname === '/',
      trackingId: 'home'
    },
    {
      name: 'Compare',
      href: '/compare',
      icon: FiBarChart,
      current: router.pathname === '/compare',
      trackingId: 'compare'
    },
    {
      name: 'Bonuses',
      href: '/bonuses',
      icon: FiGift,
      current: router.pathname.startsWith('/bonuses'),
      trackingId: 'bonuses'
    },
    {
      name: 'Search',
      href: '/search',
      icon: FiSearch,
      current: router.pathname === '/search',
      trackingId: 'search'
    }
  ];

  const handleItemClick = (trackingId: string) => {
    trackButtonClick(trackingId, 'mobile_bottom_bar');
  };

  return (
    <div className={`mobile-bottom-bar ${className}`}>
      <div className="mobile-bottom-bar-content">
        {bottomBarItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleItemClick(item.trackingId)}
              className={`mobile-bottom-bar-item ${
                item.current ? 'mobile-bottom-bar-item-active' : ''
              }`}
            >
              <div className="mobile-bottom-bar-icon">
                <IconComponent size={20} />
              </div>
              <span className="mobile-bottom-bar-label">{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      {/* Primary CTA Button */}
      <div className="mobile-bottom-bar-cta">
        <Link
          href="/compare"
          onClick={() => handleItemClick('compare_now_bottom')}
          className="mobile-bottom-bar-cta-button"
        >
          Compare Now
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomBar; 