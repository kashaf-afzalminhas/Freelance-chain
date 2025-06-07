import React, { createContext, useState, useEffect, useContext } from 'react';
import { initSocket, getSocket, disconnectSocket } from './services/socket';

export const AuthContext = createContext();

// Add useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatWithUser, setChatWithUser] = useState(null);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(storedIsAdmin);

        if (!token) {
          console.warn('No token found in localStorage');
          setCurrentUser(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/auth/current-user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAdmin');
            setCurrentUser(null);
            setIsAdmin(false);
            setError('Session expired. Please sign in again.');
          } else {
            throw new Error(`Failed to fetch current user: ${response.status}`);
          }
          return;
        }

        const user = await response.json();
        console.log('Fetched Current User:', user);
        setCurrentUser(user);

        // Initialize socket connection only if not already initialized and not admin
        if (!isSocketInitialized && user._id && !storedIsAdmin) {
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
        setIsAdmin(false);
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
    isSocketInitialized,
    isAdmin,
    setIsAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;