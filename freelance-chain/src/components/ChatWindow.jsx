import React, { useEffect, useState, useRef } from 'react';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { getMessagesByConversation, sendMessage, getUserById } from '../services/api';
import { getSocket, sendSocketMessage } from '../services/socket';

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
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(msg => 
            msg._id === message._id || 
            (msg.text === message.text && msg.senderId === message.senderId)
          );
          if (messageExists) return prev;
          
          return [...prev, {
            ...message,
            _id: Date.now().toString(), // Temporary ID for socket messages
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b flex items-center gap-3">
        <div>
          <h2 className="font-semibold">{userDetails.name || 'User'}</h2>
          <p className="text-sm text-gray-500">Role: {userDetails.role || 'N/A'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
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
              <TypingIndicator username={otherUser.name} className="mt-2" />
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-3 border-t">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;