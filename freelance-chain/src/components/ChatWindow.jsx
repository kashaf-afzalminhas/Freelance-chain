import React, { useEffect, useState, useRef } from 'react';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { getMessagesByConversation, sendMessage, getUserById } from '../services/api';
import { getSocket, sendSocketMessage } from '../services/socket';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const ChatWindow = ({ conversationId, currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [userDetails, setUserDetails] = useState(otherUser);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await getMessagesByConversation(conversationId);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleNewMessage = (message) => {
      if (message.conversationId === conversationId) {
        setMessages(prev => {
          const messageExists = prev.some(msg => 
            msg._id === message._id || 
            (msg.text === message.text && msg.senderId === message.senderId)
          );
          if (messageExists) return prev;
          
          return [...prev, {
            ...message,
            _id: Date.now().toString(),
            senderId: message.senderId
          }];
        });
        setIsTyping(false);
      }
    };

    const handleTyping = (data) => {
      if (data.userId === otherUser._id && data.conversationId === conversationId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on('getMessage', handleNewMessage);
    socket.on('userTyping', handleTyping);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('getMessage', handleNewMessage);
        socketRef.current.off('userTyping', handleTyping);
      }
    };
  }, [conversationId, otherUser._id]);

  useEffect(() => {
    if (!otherUser.name || !otherUser.role) {
      getUserById(otherUser._id)
        .then(res => setUserDetails(res.data))
        .catch(() => setUserDetails(otherUser));
    } else {
      setUserDetails(otherUser);
    }
  }, [otherUser]);

  const handleSendMessage = async (text) => {
    try {
      const tempId = Date.now().toString();
      const newMessage = {
        _id: tempId,
        conversationId,
        senderId: currentUser._id,
        text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newMessage]);

      const response = await sendMessage({
        conversationId,
        senderId: currentUser._id,
        text,
      });

      setMessages(prev =>
        prev.map(msg =>
          msg._id === tempId
            ? { ...response.data, sender: currentUser._id }
            : msg
        )
      );

      sendSocketMessage(
        currentUser._id,
        otherUser._id,
        text,
        conversationId
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-primary text-white flex items-center gap-3">
        <Link 
          to={`/profile/public/${otherUser._id}`}
          className="relative shrink-0"
        >
          <Avatar 
            src={`http://localhost:5000${userDetails.profileImage}`}
            alt={userDetails.name || 'User'}
            className="w-10 h-10"
          />
          {/* Online status indicator */}
          {userDetails.status === 'online' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </Link>
        <div>
          <Link 
            to={`/profile/public/${otherUser._id}`}
            className="font-heading text-lg font-bold hover:underline"
          >
            {userDetails.name || 'User'}
          </Link>
          <p className="font-body text-sm text-white/90">
            {userDetails.role || 'N/A'} • {isTyping ? 'typing...' : 'online'}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse font-body text-gray-500">
              Loading messages...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center p-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-heading text-lg text-gray-600 mb-1">No messages yet</h3>
            <p className="font-body text-gray-500 max-w-md">
              Start the conversation with {userDetails.name || 'your contact'}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center my-2">
              <span className="inline-block px-2 py-1 text-xs font-body text-gray-500 bg-gray-100 rounded-full">
                {new Date(messages[0]?.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {messages.map(message => (
              <ChatBubble
                key={message._id}
                message={message.text}
                timestamp={message.createdAt}
                isCurrentUser={message.senderId === currentUser._id}
                status="read"
              />
            ))}
            
            {isTyping && (
              <TypingIndicator username={otherUser.name} />
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          className="border border-gray-300 rounded-full focus:ring-2 focus:ring-highlight focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default ChatWindow;