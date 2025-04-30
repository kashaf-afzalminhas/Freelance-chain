import React, { createContext, useState, useEffect } from 'react';
import { initSocket, getSocket, disconnectSocket } from './services/socket';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State for authenticated user
  const [chatWithUser, setChatWithUser] = useState(null); // State for the user to chat with
  const [isSocketInitialized, setIsSocketInitialized] = useState(false); // Track socket initialization

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found. Redirecting to SignIn...');
          return;
        }

        const response = await fetch('http://localhost:5000/auth/current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch current user');
        }

        const user = await response.json();
        console.log('Fetched Current User:', user);
        setCurrentUser(user);

        // Initialize socket connection only if not already initialized
        if (!isSocketInitialized) {
          const socket = initSocket(user._id);
          setIsSocketInitialized(true);

          // Set up socket listeners
          socket.on('connect', () => {
            console.log('🔗 Socket connected:', socket.id);
          });

          socket.on('disconnect', () => {
            console.warn('❌ Socket disconnected');
          });

          // Cleanup function
          return () => {
            socket.off('connect');
            socket.off('disconnect');
            disconnectSocket();
          };
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, [isSocketInitialized]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, chatWithUser, setChatWithUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;