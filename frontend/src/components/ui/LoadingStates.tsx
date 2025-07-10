
import React from 'react';

// Skeleton loader for cards
export const BookmakerCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      </div>

      <div className="bg-gray-100 rounded-lg p-3 mb-4">
        <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-12"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

// Loading spinner component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin`}></div>
  );
};

// Page loading overlay
export const PageLoadingOverlay: React.FC<{ isLoading: boolean; message?: string }> = ({ 
  isLoading, 
  message = 'Loading...' 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Content loading placeholder
export const ContentPlaceholder: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        ></div>
      ))}
    </div>
  );
};
