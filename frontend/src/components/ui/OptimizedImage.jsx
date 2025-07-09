import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  getFallbackImage, 
  getOptimizedImageUrl, 
  createLazyLoadObserver,
  preloadCriticalImages 
} from '../../utils/imageOptimization';

/**
 * Optimized Image Component with Fallbacks and Performance Features
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  type = 'general',
  priority = false,
  lazy = true,
  className = '',
  style = {},
  onLoad,
  onError,
  placeholder = 'blur',
  quality = 75,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Set up lazy loading observer
  useEffect(() => {
    if (lazy && !priority && imgRef.current) {
      observerRef.current = createLazyLoadObserver((target) => {
        setIsInView(true);
        if (observerRef.current) {
          observerRef.current.unobserve(target);
        }
      });

      if (observerRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority]);

  // Handle image load
  const handleLoad = (event) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  };

  // Handle image error with fallback
  const handleError = (event) => {
    if (!imageError) {
      setImageError(true);
      const fallbackSrc = getFallbackImage(src, type);
      setImageSrc(fallbackSrc);
      
      if (onError) {
        onError(event);
      }
    }
  };

  // Generate blur data URL for placeholder
  const getBlurDataURL = () => {
    if (type === 'bookmaker_logo') {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y1ZjkiLz48L3N2Zz4=';
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNWY5Ii8+PC9zdmc+';
  };

  // Optimize image source
  const optimizedSrc = getOptimizedImageUrl(imageSrc, 'medium');

  // Component styles
  const imageStyles = {
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0.8,
    ...style
  };

  // If not in view and lazy loading is enabled, render placeholder
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`${className} bg-gray-100 flex items-center justify-center`}
        style={{
          width: width || '100%',
          height: height || 'auto',
          minHeight: height || '60px',
          ...style
        }}
      >
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  // For data URLs (fallback images), use regular img tag
  if (imageSrc && imageSrc.startsWith('data:')) {
    return (
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={imageStyles}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        {...props}
      />
    );
  }

  // Use Next.js Image component for regular images
  return (
    <div ref={imgRef} className={`relative ${className}`} style={style}>
      <Image
        src={optimizedSrc || imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? getBlurDataURL() : undefined}
        style={imageStyles}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
};

/**
 * Bookmaker Logo Component - Specialized for bookmaker logos
 */
export const BookmakerLogo = ({ bookmaker, className = '', ...props }) => {
  const logoSrc = `/images/logos/${bookmaker}-logo.png`;
  
  return (
    <OptimizedImage
      src={logoSrc}
      alt={`${bookmaker} logo`}
      width={120}
      height={60}
      type="bookmaker_logo"
      className={`bookmaker-logo ${className}`}
      {...props}
    />
  );
};

/**
 * Blog Image Component - Specialized for blog images
 */
export const BlogImage = ({ slug, title, className = '', ...props }) => {
  const imageSrc = `/images/blog/${slug}.jpg`;
  
  return (
    <OptimizedImage
      src={imageSrc}
      alt={title || 'Blog post image'}
      width={400}
      height={225}
      type="blog_image"
      className={`blog-image ${className}`}
      {...props}
    />
  );
};

/**
 * Hero Banner Component - Specialized for hero banners
 */
export const HeroBanner = ({ src, alt, className = '', ...props }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={800}
      height={400}
      type="banner"
      priority={true}
      className={`hero-banner ${className}`}
      {...props}
    />
  );
};

export default OptimizedImage; 