import React, { useState, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface SwipeableTableProps {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
  autoScroll?: boolean;
}

const SwipeableTable: React.FC<SwipeableTableProps> = ({
  children,
  className = '',
  showArrows = true,
  autoScroll = false
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Touch handling for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
      
      return () => {
        scrollElement.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current && !isScrolling) {
      setIsScrolling(true);
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current && !isScrolling) {
      setIsScrolling(true);
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.targetTouches[0].clientX);
      setIsDragging(true);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && canScrollRight) {
      scrollRight();
    } else if (isRightSwipe && canScrollLeft) {
      scrollLeft();
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left scroll arrow */}
      {showArrows && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 touch-target hover:bg-gray-50 transition-colors"
          aria-label="Scroll left"
        >
          <FiChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Right scroll arrow */}
      {showArrows && canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 touch-target hover:bg-gray-50 transition-colors"
          aria-label="Scroll right"
        >
          <FiChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
          WebkitOverflowScrolling: 'touch' // iOS momentum scrolling
        }}
      >
        {children}
      </div>

      {/* Scroll indicators */}
      <div className="flex justify-center mt-3 space-x-2 md:hidden">
        <div className={`h-1 w-8 rounded-full transition-colors ${canScrollLeft ? 'bg-gray-300' : 'bg-gray-100'}`} />
        <div className={`h-1 w-8 rounded-full transition-colors ${canScrollRight ? 'bg-gray-300' : 'bg-gray-100'}`} />
      </div>
    </div>
  );
};

export default SwipeableTable; 