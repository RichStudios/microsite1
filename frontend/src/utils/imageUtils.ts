/**
 * Generate a placeholder SVG image for a bookmaker
 * @param name - The name of the bookmaker
 * @param width - Width of the image (default: 48)
 * @param height - Height of the image (default: 48)
 * @returns Base64 encoded SVG data URL
 */
export function generateBookmakerPlaceholder(name: string, width: number = 48, height: number = 48): string {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    '#FF6B00', // Primary orange
    '#1A1F36', // Navy blue
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#6B7280', // Gray
  ];

  const colorIndex = name.length % colors.length;
  const bgColor = colors[colorIndex];
  const textColor = bgColor === '#F59E0B' ? '#1A1F36' : '#FFFFFF';

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" rx="8" fill="${bgColor}"/>
      <text x="${width/2}" y="${height/2 + 5}" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.3}" font-weight="bold" text-anchor="middle" fill="${textColor}">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate a placeholder blog image
 * @param title - The title of the blog post
 * @param width - Width of the image (default: 400)
 * @param height - Height of the image (default: 250)
 * @returns Base64 encoded SVG data URL
 */
export function generateBlogPlaceholder(title: string, width: number = 400, height: number = 250): string {
  const words = title.split(' ').slice(0, 3).join(' ');
  const truncatedTitle = words.length > 30 ? words.substring(0, 30) + '...' : words;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F3F5F9"/>
      <rect x="0" y="0" width="${width}" height="60" fill="#1A1F36"/>
      <text x="${width/2}" y="35" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#FF6B00">BetCompare Blog</text>
      <text x="${width/2}" y="${height/2 + 20}" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#1A1F36">${truncatedTitle}</text>
      <circle cx="${width/2}" cy="${height/2 - 20}" r="25" fill="#FF6B00" opacity="0.1"/>
      <path d="M${width/2 - 10} ${height/2 - 20} L${width/2} ${height/2 - 10} L${width/2 + 10} ${height/2 - 20}" stroke="#FF6B00" stroke-width="2" fill="none"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Handles image loading errors by setting a fallback image
 * @param event - The error event from the img element
 * @param name - The name of the entity (bookmaker, etc.)
 * @param type - The type of image ('bookmaker', 'logo', etc.)
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  name: string,
  type: string = 'image'
) => {
  const img = event.currentTarget;
  
  // Prevent infinite loop if fallback also fails
  if (img.src.includes('placeholder') || img.src.includes('fallback')) {
    return;
  }

  // Set fallback based on type
  switch (type) {
    case 'bookmaker':
    case 'logo':
      img.src = generateLogoFallback(name);
      break;
    default:
      img.src = '/images/placeholder.png';
  }

  // Add error class for styling
  img.classList.add('image-error');
};

/**
 * Generates a text-based fallback for logos
 * @param name - The name to create a fallback for
 * @returns Data URL for an SVG with the first letters
 */
export const generateLogoFallback = (name: string): string => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);

  const colors = [
    '#1A1F36', // Navy Blue
    '#FF6B00', // Orange  
    '#2563EB', // Blue
    '#059669', // Green
    '#DC2626', // Red
    '#7C3AED', // Purple
  ];

  // Simple hash function to pick consistent colors
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const backgroundColor = colors[hash % colors.length];
  const textColor = '#FFFFFF';

  const svg = `
    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="${backgroundColor}" rx="8"/>
      <text 
        x="32" 
        y="40" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="24" 
        font-weight="600" 
        fill="${textColor}" 
        text-anchor="middle"
      >
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Preloads an image and returns a promise
 * @param src - The image source URL
 * @returns Promise that resolves when image loads
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Optimizes image URLs for different screen sizes
 * @param src - Original image source
 * @param width - Desired width
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export const optimizeImageUrl = (
  src: string, 
  width?: number, 
  quality: number = 85
): string => {
  // If it's already a data URL or external URL, return as-is
  if (src.startsWith('data:') || src.startsWith('http')) {
    return src;
  }

  // For Next.js Image Optimization (if using Next.js Image component)
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());

  return `${src}?${params.toString()}`;
};

/**
 * Gets the appropriate image size for responsive loading
 * @param containerWidth - The container width
 * @param devicePixelRatio - The device pixel ratio
 * @returns Optimal image width
 */
export const getOptimalImageWidth = (
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): number => {
  const baseWidth = Math.ceil(containerWidth * devicePixelRatio);
  
  // Round up to common breakpoints for better caching
  const breakpoints = [64, 128, 256, 384, 512, 768, 1024, 1280, 1536];
  
  return breakpoints.find(bp => bp >= baseWidth) || baseWidth;
};

/**
 * Lazy loading intersection observer for images
 */
export const createImageLazyLoader = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
};

/**
 * Converts an image to WebP format if supported
 * @param src - Original image source
 * @returns WebP image source if supported, original otherwise
 */
export const toWebPIfSupported = (src: string): string => {
  // Check if browser supports WebP
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP && src.match(/\.(jpg|jpeg|png)$/i)) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
  }
  
  return src;
}; 