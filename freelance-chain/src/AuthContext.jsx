import React, { createContext, useState, useEffect, useContext } from 'react';
import { initSocket, getSocket, disconnectSocket } from './services/socket';
import { useNavigate } from 'react-router-dom';
import { api } from './services/api';

// Create context
const AuthContext = createContext();

// Custom hook for using auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
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
    localStorage.removeItem('adminUser');
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const verifyAdminStatus = async (user) => {
    try {
      console.log('Verifying admin status for user:', user);
      
      if (!user || !user.walletAddress) {
        console.error('Invalid user data for admin verification');
        return false;
      }

      const response = await api.get('/api/admin/verify', {
        params: {
          walletAddress: user.walletAddress
        }
      });
      
      console.log('Admin verification response:', response.data);
      
      const isAdminUser = response.data.success && response.data.isAdmin;
      setIsAdmin(isAdminUser);
      localStorage.setItem('isAdmin', isAdminUser.toString());
      
      if (isAdminUser && response.data.user) {
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
      
      return isAdminUser;
    } catch (error) {
      console.error('Error verifying admin status:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setIsAdmin(false);
      localStorage.setItem('isAdmin', 'false');
      return false;
    }
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

          // Verify admin status
          const isAdminUser = await verifyAdminStatus(user);
          
          // Initialize socket connection only if not already initialized and not admin
          if (!isSocketInitialized && user._id && !isAdminUser) {
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
          console.error('Error in fetchCurrentUser:', error);
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
    clearAuthData,
    verifyAdminStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Named exports
export { useAuth, AuthContext };
export default AuthProvider;