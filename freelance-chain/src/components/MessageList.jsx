import React, { useEffect, useRef } from 'react';
import { emitMessageRead } from '../socket';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const MessageList = ({ messages, currentUser, chatUsers }) => {
  const scrollRef = useRef();
  const messagesEndRef = useRef();

  // Emit read receipts
  useEffect(() => {
    messages.forEach((msg) => {
      if (!msg.readBy?.includes(currentUser._id)) {
        emitMessageRead(msg._id, currentUser._id);
      }
    });
  }, [messages, currentUser]);

  // Auto-scroll with intersection observer for better performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'nearest'
            });
          }, 50);
        }
      },
      { threshold: 0.1 }
    );

    if (messagesEndRef.current) {
      observer.observe(messagesEndRef.current);
    }

    return () => {
      if (messagesEndRef.current) {
        observer.unobserve(messagesEndRef.current);
      }
    };
  }, [messages]);

  const getSenderName = (senderId) => {
    const user = chatUsers.find(user => user._id === senderId);
    return user?.name || 'Unknown';
  };

  const getSenderProfileImage = (senderId) => {
    const user = chatUsers.find(user => user._id === senderId);
    return user?.profileImage ? `http://localhost:5000${user.profileImage}` : null;
  };

  return (
    <div className="flex flex-col space-y-3 p-4 overflow-y-auto h-full">
      {messages.map((msg, index) => {
        const isCurrentUser = String(msg.senderId) === String(currentUser._id);
        const showSenderName = !isCurrentUser && 
          (index === 0 || messages[index-1].senderId !== msg.senderId);

        return (
          <div
            key={`${msg._id}-${index}`}
            className={cn(
              "flex flex-col max-w-[80%]",
              isCurrentUser ? "ml-auto items-end" : "mr-auto items-start"
            )}
            ref={index === messages.length - 1 ? messagesEndRef : null}
          >
            {showSenderName && (
              <div className="flex items-center gap-2 mb-1">
                <Link 
                  to={`/profile/public/${msg.senderId}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {getSenderProfileImage(msg.senderId) ? (
                    <img 
                      src={getSenderProfileImage(msg.senderId)} 
                      alt={getSenderName(msg.senderId)}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs">
                      {getSenderName(msg.senderId).charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-gray-600 font-heading">
                    {getSenderName(msg.senderId)}
                  </span>
                </Link>
              </div>
            )}
            
            <div className={cn(
              "rounded-2xl px-4 py-2",
              "whitespace-pre-wrap break-words",
              "shadow-sm",
              isCurrentUser 
                ? "bg-primary text-white rounded-br-none" 
                : "bg-gray-100 text-gray-800 rounded-bl-none",
              "transition-colors duration-200"
            )}>
              <p className="font-body">{msg.text || msg.content}</p>
            </div>

            <div className={cn(
              "flex items-center mt-1 text-xs",
              isCurrentUser ? "text-gray-400" : "text-gray-500",
              "font-body"
            )}>
              {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
              {isCurrentUser && (
                <span className="ml-1">
                  {msg.readBy?.length > 1 ? (
                    <span className="text-accent">✓✓</span>
                  ) : (
                    <span>✓</span>
                  )}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageList;