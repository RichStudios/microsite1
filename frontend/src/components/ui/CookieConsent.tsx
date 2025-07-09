import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
    trackButtonClick('cookie_accept', 'cookie_consent');
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
    trackButtonClick('cookie_decline', 'cookie_consent');
  };

  const handleClose = () => {
    setIsVisible(false);
    trackButtonClick('cookie_close', 'cookie_consent');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50 md:bottom-auto md:top-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary mb-2">
              We use cookies to enhance your experience
            </h3>
            <p className="text-sm text-gray-600">
              We use cookies to analyze website traffic, personalize content, and provide social media features. 
              By clicking "Accept", you consent to our use of cookies.{' '}
              <a
                href="/privacy"
                className="text-secondary hover:underline"
                onClick={() => trackButtonClick('cookie_privacy_link', 'cookie_consent')}
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary-600 transition-colors duration-200"
            >
              Accept All
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close cookie consent"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 