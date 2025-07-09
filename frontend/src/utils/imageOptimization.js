/**
 * Image Optimization and Fallback System
 * Handles missing images, provides fallbacks, and optimizes loading
 */

// Default image dimensions for different image types
export const IMAGE_DIMENSIONS = {
  bookmaker_logo: { width: 120, height: 60 },
  blog_image: { width: 400, height: 225 },
  banner: { width: 800, height: 400 },
  avatar: { width: 64, height: 64 },
  icon: { width: 24, height: 24 }
};

// Image quality settings
export const IMAGE_QUALITY = {
  thumbnail: 60,
  medium: 75,
  high: 85,
  original: 95
};

/**
 * Generates a placeholder SVG for missing images
 */
export const generatePlaceholderSVG = (width, height, text, backgroundColor = '#f3f5f9', textColor = '#1a1f36') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" rx="4"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
            text-anchor="middle" dominant-baseline="middle" fill="${textColor}">
        ${text}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Bookmaker logo fallback system
 */
export const BOOKMAKER_LOGOS = {
  betway: {
    name: 'Betway',
    fallback: () => generatePlaceholderSVG(120, 60, 'BETWAY', '#1a1f36', '#ffffff'),
    color: '#1a1f36'
  },
  melbet: {
    name: 'MelBet',
    fallback: () => generatePlaceholderSVG(120, 60, 'MELBET', '#ff6b00', '#ffffff'),
    color: '#ff6b00'
  },
  '1xbet': {
    name: '1xBet',
    fallback: () => generatePlaceholderSVG(120, 60, '1XBET', '#1f4788', '#ffffff'),
    color: '#1f4788'
  },
  odibets: {
    name: 'Odibets',
    fallback: () => generatePlaceholderSVG(120, 60, 'ODIBETS', '#00b894', '#ffffff'),
    color: '#00b894'
  },
  bet365: {
    name: 'Bet365',
    fallback: () => generatePlaceholderSVG(120, 60, 'BET365', '#f4d03f', '#000000'),
    color: '#f4d03f'
  },
  sportpesa: {
    name: 'SportPesa',
    fallback: () => generatePlaceholderSVG(120, 60, 'SPORTPESA', '#e74c3c', '#ffffff'),
    color: '#e74c3c'
  },
  betika: {
    name: 'Betika',
    fallback: () => generatePlaceholderSVG(120, 60, 'BETIKA', '#27ae60', '#ffffff'),
    color: '#27ae60'
  }
};

/**
 * Blog image fallback system
 */
export const BLOG_IMAGE_FALLBACKS = {
  'melbet-vs-betway': () => generatePlaceholderSVG(400, 225, 'MelBet vs Betway Comparison', '#1a1f36', '#ffffff'),
  'mpesa-betting-guide': () => generatePlaceholderSVG(400, 225, 'M-Pesa Betting Guide', '#00b894', '#ffffff'),
  'betting-mistakes': () => generatePlaceholderSVG(400, 225, 'Common Betting Mistakes', '#e74c3c', '#ffffff'),
  'betting-odds-guide': () => generatePlaceholderSVG(400, 225, 'Understanding Betting Odds', '#ff6b00', '#ffffff')
};

/**
 * Get optimized image URL with fallback
 */
export const getOptimizedImageUrl = (imagePath, type = 'medium', fallbackType = null) => {
  if (!imagePath) {
    return null;
  }

  // Check if it's a bookmaker logo
  const bookmakerMatch = imagePath.match(/\/logos\/([^-]+)-logo\.(png|jpg|jpeg|webp)/);
  if (bookmakerMatch) {
    const bookmakerSlug = bookmakerMatch[1];
    if (BOOKMAKER_LOGOS[bookmakerSlug]) {
      return imagePath; // Return original path, fallback will be handled by onError
    }
  }

  // Check if it's a blog image
  const blogMatch = imagePath.match(/\/blog\/([^.]+)\.(jpg|jpeg|png|webp)/);
  if (blogMatch) {
    const blogSlug = blogMatch[1];
    if (BLOG_IMAGE_FALLBACKS[blogSlug]) {
      return imagePath; // Return original path, fallback will be handled by onError
    }
  }

  // For other images, return as-is
  return imagePath;
};

/**
 * Get fallback image for specific types
 */
export const getFallbackImage = (imagePath, type = 'bookmaker_logo') => {
  if (type === 'bookmaker_logo') {
    const bookmakerMatch = imagePath.match(/\/logos\/([^-]+)-logo/);
    if (bookmakerMatch) {
      const bookmakerSlug = bookmakerMatch[1];
      return BOOKMAKER_LOGOS[bookmakerSlug]?.fallback() || 
             generatePlaceholderSVG(120, 60, 'LOGO', '#f3f5f9', '#1a1f36');
    }
  }

  if (type === 'blog_image') {
    const blogMatch = imagePath.match(/\/blog\/([^.]+)/);
    if (blogMatch) {
      const blogSlug = blogMatch[1];
      return BLOG_IMAGE_FALLBACKS[blogSlug]?.() || 
             generatePlaceholderSVG(400, 225, 'Blog Image', '#f3f5f9', '#1a1f36');
    }
  }

  // Default fallback
  const dims = IMAGE_DIMENSIONS[type] || { width: 200, height: 120 };
  return generatePlaceholderSVG(dims.width, dims.height, 'Image', '#f3f5f9', '#1a1f36');
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = (imageUrls) => {
  if (typeof window === 'undefined') return; // SSR check

  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Lazy loading intersection observer
 */
export const createLazyLoadObserver = (callback) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
};

/**
 * WebP support detection
 */
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Convert image URL to WebP if supported
 */
export const getWebPUrl = (imageUrl) => {
  if (!supportsWebP() || !imageUrl) return imageUrl;
  
  // Only convert certain extensions
  if (imageUrl.match(/\.(jpg|jpeg|png)$/i)) {
    return imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  return imageUrl;
}; 