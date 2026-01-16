import React from 'react';
import { cn } from '../lib/utils';

const TypingIndicator = ({ username, className }) => {
  return (
    <div className={cn("flex items-center text-gray-500 italic text-sm", className)}>
      <div className="flex items-center gap-1 mr-2">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-0"></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300"></div>
      </div>
      <span>{username ? `${username} is typing...` : 'Someone is typing...'}</span>
    </div>
  );
};

export default TypingIndicator;
