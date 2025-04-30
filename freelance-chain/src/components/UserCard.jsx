import React from 'react';
import Avatar from './Avatar';
import { cn } from '../lib/utils';

const UserCard = ({
  user,
  selected = false,
  onClick,
  lastMessage,
  timestamp,
  unreadCount = 0,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center p-3 gap-3 cursor-pointer rounded-md transition-colors',
        selected ? 'bg-primary/10' : 'hover:bg-gray-100',
        className
      )}
      onClick={onClick}
    >
      {/* <Avatar 
        src={user.profilePicture} 
        alt={user.username} 
        status={user.status} 
      /> */}
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium text-sm truncate">{user.name || 'Unknown'}</h3>
          {timestamp && (
            <span className="text-xs text-gray-500 ml-1 shrink-0">{timestamp}</span>
          )}
        </div>
        
        {lastMessage && (
          <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
        )}
      </div>
      
      {unreadCount > 0 && (
        <div className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </div>
  );
};

export default UserCard;
