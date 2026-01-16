import React, { useEffect, useState } from 'react';
import { getUserConversations } from '../services/api';
import UserCard from './UserCard';
import SearchBar from './SearchBar';
import { format } from 'date-fns';
import { getSocket } from '../services/socket';
import { cn } from '../lib/utils';

const RecentChats = ({
  currentUserId,
  onSelectConversation,
  selectedConversationId,
  users,
  addToast,
}) => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await getUserConversations(currentUserId);
        setConversations(response.data);
        setFilteredConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        addToast && addToast({
          title: 'Error',
          description: 'Failed to fetch conversations',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId && users.length > 0) {
      fetchConversations();
    }
  }, [currentUserId, users, addToast]);

  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (message) => {
      if (message.isReceiver || (message.isSender && message.senderId === currentUserId)) {
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv._id === message.conversationId) {
              const unreadCount =
                selectedConversationId === conv._id
                  ? 0
                  : message.isReceiver ? (conv.unreadCount || 0) + 1 : conv.unreadCount || 0;

              return {
                ...conv,
                lastMessage: message,
                unreadCount,
                updatedAt: message.createdAt,
              };
            }
            return conv;
          })
        );
      }
    };

    socket.on('getMessage', handleNewMessage);

    return () => {
      socket.off('getMessage', handleNewMessage);
    };
  }, [currentUserId, selectedConversationId]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter((conv) => {
        const otherUserId = conv.participants.find(id => id !== currentUserId);
        const otherUser = users.find(u => u._id === otherUserId);
        return otherUser && otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations, users, currentUserId]);

  useEffect(() => {
    if (selectedConversationId) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === selectedConversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    }
  }, [selectedConversationId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    }

    if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'MMM d');
    }

    return format(date, 'MM/dd/yyyy');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header with search */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-heading font-bold text-accent mb-3">Recent Messages</h2>
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search conversations..."
          className="w-full"
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
            <p className="font-body text-gray-600">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-gray-300 mb-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="font-heading text-lg text-gray-600 mb-1">No conversations found</h3>
            <p className="font-body text-gray-500">
              {searchQuery ? 'Try a different search' : 'Start a new conversation'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => {
              const otherUserId = conversation.participants.find(id => id !== currentUserId);
              const otherUser = users.find(u => u._id === otherUserId);

              const timestamp = conversation.lastMessage?.createdAt
                ? formatTimestamp(conversation.lastMessage.createdAt)
                : formatTimestamp(conversation.updatedAt);

              return (
                <UserCard
                  key={conversation._id}
                  user={otherUser || { name: 'Unknown', role: '' }}
                  selected={selectedConversationId === conversation._id}
                  lastMessage={typeof conversation.lastMessage === 'string' ? conversation.lastMessage : (conversation.lastMessage?.text || 'Start a conversation...')}
                  timestamp={timestamp}
                  unreadCount={conversation.unreadCount}
                  onClick={() => onSelectConversation({ ...conversation, user: otherUser })}
                  className={cn(
                    "transition-colors duration-200",
                    selectedConversationId === conversation._id 
                      ? "bg-primary/10" 
                      : "hover:bg-gray-50"
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentChats;