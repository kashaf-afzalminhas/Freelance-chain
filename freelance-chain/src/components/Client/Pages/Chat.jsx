

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
    return (
      <div className="flex items-center justify-center h-screen font-body text-primary">
        Loading...
      </div>
    );
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
    <div className="flex h-screen bg-gray-50">
      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg shadow-lg font-body ${
                toast.variant === 'destructive' ? 'bg-red-100 text-red-800' : 'bg-primary text-white'
              }`}
            >
              <h3 className="font-bold font-heading">{toast.title}</h3>
              <p>{toast.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-white w-full md:w-96 lg:w-80 border-r border-gray-200 ${
          isMobile && showChatMobile ? 'hidden' : 'flex flex-col'
        }`}
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 text-center font-heading text-lg md:text-base ${
              activeTab === 'recent' 
                ? 'border-b-2 border-accent text-accent font-bold' 
                : 'text-gray-600 hover:text-primary'
            } transition-colors duration-200`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Chats
          </button>
          <button
            className={`flex-1 py-4 text-center font-heading text-lg md:text-base ${
              activeTab === 'users' 
                ? 'border-b-2 border-accent text-accent font-bold' 
                : 'text-gray-600 hover:text-primary'
            } transition-colors duration-200`}
            onClick={() => setActiveTab('users')}
          >
            All Users
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
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
        className={`flex-1 flex flex-col ${
          isMobile && !showChatMobile ? 'hidden' : 'flex'
        } bg-gray-50`}
      >
        {selectedConversation && selectedUser ? (
          <>
            {isMobile && (
              <button 
                className="p-3 bg-primary text-white flex items-center gap-2 font-heading"
                onClick={handleBackToList}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to conversations
              </button>
            )}
            <ChatWindow
              conversationId={selectedConversation._id}
              currentUser={currentUser}
              otherUser={selectedUser}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-300 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-heading text-gray-600 mb-2">No conversation selected</h3>
            <p className="font-body text-center max-w-md">
              {activeTab === 'recent' 
                ? 'Select a recent conversation or switch to "All Users" to start a new chat'
                : 'Select a user to start a conversation'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;