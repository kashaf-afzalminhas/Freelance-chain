import React, { createContext, useState, useEffect } from 'react';
import { initSocket, getSocket, disconnectSocket } from './services/socket';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatWithUser, setChatWithUser] = useState(null);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken');
        console.log('Token from localStorage:', token); // Debug log

        if (!token) {
          console.warn('No authToken found in localStorage');
          setCurrentUser(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/auth/current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            setCurrentUser(null);
            setError('Session expired. Please sign in again.');
          } else {
            throw new Error(`Failed to fetch current user: ${response.status}`);
          }
          return;
        }

        const user = await response.json();
        console.log('Fetched Current User:', user);
        setCurrentUser(user);

        // Initialize socket connection only if not already initialized
        if (!isSocketInitialized && user._id) {
          const socket = initSocket(user._id);
          setIsSocketInitialized(true);

          socket.on('connect', () => {
            console.log('🔗 Socket connected:', socket.id);
          });

          socket.on('disconnect', () => {
            console.warn('❌ Socket disconnected');
          });

          return () => {
            socket.off('connect');
            socket.off('disconnect');
            disconnectSocket();
          };
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError(error.message);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [isSocketInitialized]);

  const value = {
    currentUser,
    setCurrentUser,
    chatWithUser,
    setChatWithUser,
    isLoading,
    error,
    isSocketInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;