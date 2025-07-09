import React from 'react';
import Link from 'next/link';
import { FiTwitter, FiFacebook, FiInstagram, FiMail } from 'react-icons/fi';

// Utils
import { trackButtonClick, trackSocialShare } from '../../utils/analytics';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Footer links data
  const footerLinks = {
    About: [
      { name: 'Our Story', href: '/about' },
      { name: 'How We Work', href: '/how-we-work' },
      { name: 'Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Report Issue', href: '/report' },
    ],
    Resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Guides', href: '/guides' },
      { name: 'Betting Tips', href: '/tips' },
      { name: 'Responsible Betting', href: '/responsible-betting' },
    ],
  };

  // Social media links
  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/betcompare',
      icon: FiTwitter,
      color: 'hover:text-blue-400',
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/betcompare',
      icon: FiFacebook,
      color: 'hover:text-blue-600',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/betcompare',
      icon: FiInstagram,
      color: 'hover:text-pink-500',
    },
    {
      name: 'Email',
      href: 'mailto:info@betcompare.co.ke',
      icon: FiMail,
      color: 'hover:text-green-500',
    },
  ];

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialShare(platform, url);
    trackButtonClick(`social_${platform}`, 'footer');
  };

  return (
    <footer className="bg-primary text-white">
      {/* Newsletter Section */}
      <div className="border-b border-primary-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Stay Updated with the Latest Betting News
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Get exclusive betting tips, bonus alerts, and the latest odds comparisons delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-primary-300 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                onClick={() => trackButtonClick('newsletter_signup', 'footer')}
                className="btn btn-secondary px-6 py-3 font-medium"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="/images/logo-white.svg"
                alt="BetCompare.co.ke"
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="150" height="40" rx="6" fill="transparent"/>
                      <text x="75" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#FF6B00">BetCompare</text>
                      <text x="75" y="32" font-family="Arial, sans-serif" font-size="8" text-anchor="middle" fill="#FFFFFF">.co.ke</text>
                    </svg>
                  `)}`;
                }}
              />
              <span className="ml-2 text-xl font-heading font-bold">
                BetCompare
              </span>
            </div>
            <p className="text-primary-100 mb-6 max-w-md">
              Kenya's trusted betting comparison platform. We help you find the best odds, 
              bonuses, and betting sites to maximize your betting experience.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  onClick={() => handleSocialClick(social.name.toLowerCase(), social.href)}
                  className={`p-2 rounded-lg bg-primary-400 transition-colors duration-200 ${social.color}`}
                  aria-label={`Follow us on ${social.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => trackButtonClick(link.name.toLowerCase().replace(' ', '_'), 'footer')}
                      className="text-primary-100 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-12 pt-8 border-t border-primary-400">
          <div className="bg-primary-400 rounded-lg p-4 mb-6">
            <h5 className="font-semibold mb-2">Affiliate Disclosure</h5>
            <p className="text-sm text-primary-100">
              BetCompare.co.ke may receive compensation from some of the bookmakers featured on our site. 
              This does not influence our rankings or recommendations. We maintain editorial independence 
              and provide honest, unbiased reviews to help you make informed betting decisions.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-100 text-sm">
              © {currentYear} BetCompare.co.ke. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-primary-100 hover:text-white text-sm transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-primary-100 hover:text-white text-sm transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-primary-100 hover:text-white text-sm transition-colors duration-200"
              >
                Cookies
              </Link>
              <span className="text-primary-100 text-sm">
                Made with ❤️ in Kenya
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsible Betting Banner */}
      <div className="bg-warning text-warning-900 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
            <p className="text-sm font-medium">
              ⚠️ Please bet responsibly. Gambling can be addictive.
            </p>
            <Link
              href="/responsible-betting"
              className="ml-2 text-sm font-medium underline hover:no-underline"
            >
              Learn more about responsible betting
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 