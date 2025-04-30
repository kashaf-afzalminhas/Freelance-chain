import React, { useEffect, useRef } from 'react';
import { emitMessageRead } from '../socket';

const MessageList = ({ messages, currentUser, chatUsers }) => {
  const scrollRef = useRef();

  // Emit read receipts
  useEffect(() => {
    messages.forEach((msg) => {
      if (!msg.readBy.includes(currentUser._id)) {
        emitMessageRead(msg._id, currentUser._id);
      }
    });
  }, [messages, currentUser]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
        setTimeout(() => {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Add a slight delay to ensure DOM updates
    }
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div
          key={`${msg._id}-${index}`}
          className={`message-item ${String(msg.senderId) === String(currentUser._id) ? 'sent' : 'received'}`}
        >
          <p>{msg.text || msg.content}</p>
          <span className="timestamp">{new Date(msg.timestamp || msg.createdAt).toLocaleTimeString()}</span>
        </div>
      ))}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageList;
