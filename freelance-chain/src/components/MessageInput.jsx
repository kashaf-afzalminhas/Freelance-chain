import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Send } from 'lucide-react';

const MessageInput = ({
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
  className,
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2 bg-white border rounded-lg p-2",
        disabled && "opacity-60",
        className
      )}
    >
      <input
        type="text"
        className="flex-1 bg-transparent border-none outline-none p-2"
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />

      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={cn(
          "p-2 rounded-full",
          message.trim() && !disabled 
            ? "bg-primary text-white" 
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        )}
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default MessageInput;

