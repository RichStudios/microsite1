import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false); // Close dropdown when opening mobile menu
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.header-dropdown') && !target.closest('.mobile-menu')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation items
  const navigationItems = [
    { name: 'Home', href: '/', current: router.pathname === '/' },
    { name: 'Compare', href: '/compare', current: router.pathname === '/compare' },
    { name: 'Reviews', href: '/reviews', current: router.pathname.startsWith('/reviews') },
    { name: 'Bonuses', href: '/bonuses', current: router.pathname.startsWith('/bonuses') },
    {
      name: 'More',
      href: '#',
      current: false,
      dropdown: [
        { name: 'About', href: '/about' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <header
      className={`header ${
        isScrolled
          ? 'header-scrolled'
          : 'header-transparent'
      }`}
    >
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo">
            <Link href="/" className="header-logo-link">
              <img
                src="/images/logo.svg"
                alt="BetCompare.co.ke"
                className="header-logo-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="150" height="40" rx="6" fill="#1A1F36"/>
                      <text x="75" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#FF6B00">BetCompare</text>
                      <text x="75" y="32" font-family="Arial, sans-serif" font-size="8" text-anchor="middle" fill="#FFFFFF">.co.ke</text>
                    </svg>
                  `)}`;
                }}
              />
              <span className="header-logo-text">
                BetCompare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            {navigationItems.map((item) => (
              <div key={item.name} className="header-nav-item">
                {item.dropdown ? (
                  <div className="header-dropdown">
                    <button
                      onClick={toggleDropdown}
                      className={`header-nav-link header-nav-dropdown-toggle ${
                        item.current ? 'header-nav-link-active' : ''
                      }`}
                    >
                      {item.name}
                      <FiChevronDown className="header-nav-dropdown-icon" />
                    </button>
                    {isDropdownOpen && (
                      <div className="header-dropdown-menu">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="header-dropdown-item"
                            onClick={() => trackButtonClick(dropdownItem.name.toLowerCase(), 'header_dropdown')}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`header-nav-link ${
                      item.current ? 'header-nav-link-active' : ''
                    }`}
                    onClick={() => trackButtonClick(item.name.toLowerCase(), 'header_nav')}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <button
              onClick={() => trackButtonClick('search', 'header')}
              className="header-search-btn"
              aria-label="Search"
            >
              <FiSearch className="header-search-icon" />
            </button>
            <Link
              href="/compare"
              onClick={() => trackButtonClick('compare_now', 'header')}
              className="header-cta-btn"
            >
              Compare Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="header-mobile-toggle"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <FiX className="header-mobile-toggle-icon" />
            ) : (
              <FiMenu className="header-mobile-toggle-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navigationItems.map((item) => (
              <div key={item.name} className="mobile-menu-item">
                {item.dropdown ? (
                  <div className="mobile-menu-dropdown">
                    <button
                      onClick={toggleDropdown}
                      className="mobile-menu-link mobile-menu-dropdown-toggle"
                    >
                      {item.name}
                      <FiChevronDown className="mobile-menu-dropdown-icon" />
                    </button>
                    {isDropdownOpen && (
                      <div className="mobile-menu-dropdown-content">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="mobile-menu-dropdown-item"
                            onClick={() => {
                              trackButtonClick(dropdownItem.name.toLowerCase(), 'mobile_menu_dropdown');
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`mobile-menu-link ${
                      item.current ? 'mobile-menu-link-active' : ''
                    }`}
                    onClick={() => {
                      trackButtonClick(item.name.toLowerCase(), 'mobile_menu');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="mobile-menu-footer">
            <Link
              href="/compare"
              onClick={() => {
                trackButtonClick('compare_now', 'mobile_menu');
                setIsMobileMenuOpen(false);
              }}
              className="mobile-menu-cta"
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 