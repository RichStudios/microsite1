import React from 'react';
import { FiArrowUp } from 'react-icons/fi';

// Utils
import { trackButtonClick } from '../../utils/analytics';

const BackToTop: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    trackButtonClick('back_to_top', 'ui');
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 md:bottom-6 right-6 bg-secondary text-white p-3 rounded-full shadow-lg hover:bg-secondary-600 transition-all duration-300 transform hover:scale-110 z-40"
      aria-label="Back to top"
    >
      <FiArrowUp className="h-5 w-5" />
    </button>
  );
};

export default BackToTop; 