import React from 'react';
import { cn } from '../lib/utils';

const Avatar = ({ 
  src, 
  alt = 'User', 
  status,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500'
  };

  return (
    <div className="relative inline-block">
      <div 
        className={cn(
          "relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span className="text-gray-600 font-medium">
            {alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            statusColors[status],
            size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
