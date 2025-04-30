import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../../AuthContext';
import RecentChats from '../../../components/RecentChats';
import UsersList from '../../../components/UserList';
import ChatWindow from '../../../components/ChatWindow';
import { User, ConversationWithUser } from '../../../types/index';
import { getAllUsers, createConversation, getConversationBetweenUsers } from '../../../services/api';
import { getSocket } from '../../../services/socket';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message) => {
    setToasts((prevToasts) => [...prevToasts, message]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1));
    }, 3000);
  }, []);

  return { toasts, addToast };
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const ChatPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const { toasts, addToast } = useToast();
  const isMobile = useIsMobile();
  const currentUserId = currentUser?._id;

  useEffect(() => {
    if (!currentUserId) return;

    const loadUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error loading users:', error);
        addToast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [currentUserId, addToast]);

  // Handle socket messages
  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.isReceiver || (message.isSender && message.senderId === currentUserId)) {
        if (selectedConversation?._id === message.conversationId) {
          setSelectedConversation(prev => ({
            ...prev,
            lastMessage: message,
            updatedAt: message.createdAt
          }));
        }
      }
    };

    socket.on('getMessage', handleNewMessage);

    return () => {
      socket.off('getMessage', handleNewMessage);
    };
  }, [currentUserId, selectedConversation]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleSelectConversation = (conversationData) => {
    const conversation = new ConversationWithUser(
      conversationData._id,
      conversationData.members,
      conversationData.createdAt,
      conversationData.updatedAt,
      conversationData.lastMessage,
      conversationData.unreadCount,
      conversationData.user
    );
    setSelectedConversation(conversation);
    setSelectedUser(conversation.user);
    if (isMobile) setShowChatMobile(true);
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      if (!currentUserId || currentUserId.length !== 24) {
        console.error('Invalid currentUser ID:', currentUserId);
        addToast({
          title: 'Error',
          description: 'Invalid user ID',
          variant: 'destructive',
        });
        return;
      }

      // Check if a conversation exists between the current user and the selected user
      const response = await getConversationBetweenUsers(currentUserId, user._id);

      if (response.data) {
        // If a conversation exists, set it as the selected conversation
        const conversation = new ConversationWithUser(
          response.data._id,
          response.data.members,
          response.data.createdAt,
          response.data.updatedAt,
          response.data.lastMessage,
          response.data.unreadCount,
          user
        );
        setSelectedConversation(conversation);
      } else {
        // If no conversation exists, create a new one
        const newConvResponse = await createConversation(currentUserId, user._id);
        const conversation = new ConversationWithUser(
          newConvResponse.data._id,
          newConvResponse.data.members,
          newConvResponse.data.createdAt,
          newConvResponse.data.updatedAt,
          newConvResponse.data.lastMessage,
          newConvResponse.data.unreadCount,
          user
        );
        setSelectedConversation(conversation);
      }

      if (isMobile) setShowChatMobile(true); // Show chat window on mobile
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      addToast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  const handleBackToList = () => setShowChatMobile(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-full md:w-80 border-r ${
          isMobile && showChatMobile ? 'hidden' : 'flex flex-col'
        }`}
      >
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === 'recent' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Chats
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === 'users' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('users')}
          >
            All Users
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'recent' ? (
            <RecentChats
              currentUserId={currentUserId}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?._id}
              users={users}
            />
          ) : (
            <UsersList
              currentUserId={currentUserId}
              onSelectUser={handleSelectUser}
              selectedUserId={selectedUser?._id}
            />
          )}
        </div>
      </div>

      {/* Chat window */}
      <div
        className={`flex-1 ${
          isMobile && !showChatMobile ? 'hidden' : 'flex flex-col'
        }`}
      >
        {selectedConversation && selectedUser ? (
          <>
            {isMobile && (
              <button className="p-2 bg-gray-200 text-gray-700" onClick={handleBackToList}>
                ← Back to list
              </button>
            )}
            <ChatWindow
              conversationId={selectedConversation._id}
              currentUser={currentUser}
              otherUser={selectedUser}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;