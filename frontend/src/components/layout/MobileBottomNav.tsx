import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiBarChart, FiStar, FiGift, FiSearch } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';

const MobileBottomNav: React.FC = () => {
  const router = useRouter();

  // Navigation items for mobile bottom nav
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: FiHome,
      active: router.pathname === '/',
      trackingId: 'home'
    },
    {
      name: 'Compare',
      href: '/compare',
      icon: FiBarChart,
      active: router.pathname === '/compare',
      trackingId: 'compare'
    },
    {
      name: 'Reviews',
      href: '/reviews',
      icon: FiStar,
      active: router.pathname.startsWith('/reviews'),
      trackingId: 'reviews'
    },
    {
      name: 'Bonuses',
      href: '/bonuses',
      icon: FiGift,
      active: router.pathname.startsWith('/bonuses'),
      trackingId: 'bonuses'
    },
    {
      name: 'Search',
      href: '/search',
      icon: FiSearch,
      active: router.pathname === '/search',
      trackingId: 'search'
    },
  ];

  const handleNavClick = (trackingId: string) => {
    trackButtonClick(trackingId, 'mobile_bottom_nav');
  };

  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bottom-bar-content">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item.trackingId)}
              className={`mobile-bottom-bar-item ${
                item.active ? 'mobile-bottom-bar-item-active' : ''
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
          onClick={() => handleNavClick('compare_now_bottom')}
          className="mobile-bottom-bar-cta-button"
        >
          Compare Now
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav; 