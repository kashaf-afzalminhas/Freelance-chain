import React, { useEffect, useState } from 'react';
import { getUserConversations } from '../services/api';
import UserCard from './UserCard';
import SearchBar from './SearchBar';
import { format } from 'date-fns';
import { getSocket } from '../services/socket';

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
  }, [currentUserId, users]);

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3">
        <h2 className="text-lg font-semibold mb-3">Recent Messages</h2>
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search conversations..."
          className="mb-3"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            <p>No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
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
                lastMessage={conversation.lastMessage?.text || 'Start a conversation...'}
                timestamp={timestamp}
                unreadCount={conversation.unreadCount}
                onClick={() => onSelectConversation({ ...conversation, user: otherUser })}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentChats;