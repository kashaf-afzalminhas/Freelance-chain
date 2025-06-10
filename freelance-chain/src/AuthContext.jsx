import React, { createContext, useState, useEffect, useContext } from 'react';
import { initSocket, getSocket, disconnectSocket } from './services/socket';
import { useNavigate } from 'react-router-dom';
import { api } from './services/api';

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
  const navigate = useNavigate();

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    setCurrentUser(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken');
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(storedIsAdmin);

        if (!token) {
          console.warn('No token found in localStorage');
          setCurrentUser(null);
          setIsLoading(false);
          return;
        }

        try {
          const response = await api.get('/auth/current-user');
          const user = response.data;
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
          if (error.response?.status === 401) {
            clearAuthData();
            setError('Session expired. Please sign in again.');
            navigate('/signin');
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError(error.message);
        clearAuthData();
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [isSocketInitialized, navigate]);

  const value = {
    currentUser,
    setCurrentUser,
    chatWithUser,
    setChatWithUser,
    isLoading,
    error,
    isAdmin,
    setIsAdmin,
    clearAuthData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;