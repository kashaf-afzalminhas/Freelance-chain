import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { initSocket, getSocket, disconnectSocket } from './services/socket';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from './services/api';
 
// Admin wallet addresses
const ADMIN_WALLET_ADDRESSES = [
  '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1',
  '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc',
  '0x126eeCBCe83e22DA5F46dC2bE670994DB2CD2a8d'
];
 
// Create context
export const AuthContext = createContext();
 
// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 
// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatWithUser, setChatWithUser] = useState(null);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
 
  // List of public paths that don't require authentication
  const publicPaths = ['/', '/signin', '/signup', '/jobs', '/browse-projects', '/jobs/', '/projects/'];
 
  // Function to check if current route is public
  const isPublicRoute = useCallback(() => {
    return publicPaths.some(path => location.pathname.startsWith(path));
  }, [location.pathname]);
 
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    setCurrentUser(null);
    setIsAdmin(false);
    if (isSocketInitialized) {
      disconnectSocket();
      setIsSocketInitialized(false);
    }
  }, [isSocketInitialized]);
 
  const verifyAdminStatus = useCallback(async (user) => {
    try {
      if (!user || !user.walletAddress) {
        console.error('Invalid user data for admin verification');
        return false;
      }
 
      // Check if the wallet address is in the admin list first
      const isAdminWallet = ADMIN_WALLET_ADDRESSES.some(
        adminAddress => adminAddress.toLowerCase() === user.walletAddress.toLowerCase()
      );
 
      if (!isAdminWallet) {
        console.log('Wallet is not in admin list');
        setIsAdmin(false);
        localStorage.setItem('isAdmin', 'false');
        return false;
      }
 
      // Get the current token
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found for admin verification');
        return false;
      }
 
      const response = await api.get('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-admin-wallet': user.walletAddress.toLowerCase()
        },
        params: {
          walletAddress: user.walletAddress.toLowerCase()
        }
      });
      if (response.data.success && response.data.isAdmin) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        if (response.data.user) {
          localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        }
        return true;
      } else {
        setIsAdmin(false);
        localStorage.setItem('isAdmin', 'false');
        return false;
      }
    } catch (error) {
      console.error('Error verifying admin status:', error);
      if (error.response?.status === 403) {
        setIsAdmin(false);
        localStorage.setItem('isAdmin', 'false');
      }
      return false;
    }
  }, []);
 
  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(storedIsAdmin);
 
      if (!token) {
        console.log('No token found in localStorage - user is not authenticated');
        setCurrentUser(null);
        setIsLoading(false);
        setIsInitialized(true);
        return;
      }
 
      const response = await api.get('/auth/current-user');
      const user = response.data;
      console.log('Fetched Current User:', user);
      setCurrentUser(user);
 
      // Verify admin status
      const isAdminUser = await verifyAdminStatus(user);
      // Initialize socket connection only if not admin and not already initialized
      if (!isAdminUser && !isSocketInitialized) {
        try {
          const socket = initSocket(user._id);
          if (socket) {
            setIsSocketInitialized(true);
            socket.on('connect', () => {
              console.log('🔗 Socket connected:', socket.id);
            });
 
            socket.on('disconnect', () => {
              console.warn('❌ Socket disconnected');
            });
          }
        } catch (socketError) {
          console.warn('Socket initialization error:', socketError);
        }
      }
    } catch (error) {
      console.error('Error in fetchCurrentUser:', error);
      if (error.response?.status === 401) {
        clearAuthData();
        setError('Session expired. Please sign in again.');
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [clearAuthData, isAdmin, isInitialized, isSocketInitialized, verifyAdminStatus]);
 
  // Handle authentication state and redirects
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const isPublicPath = isPublicRoute();
 
    if (!token && !isPublicPath) {
      console.log('No token found and on protected route, redirecting to signin');
      navigate('/signin');
    } else if (token) {
      console.log('Token found, fetching current user');
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [navigate, location.pathname, isPublicRoute, fetchCurrentUser]);
 
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
    verifyAdminStatus,
    isInitialized
  };
 
  return (
<AuthContext.Provider value={value}>
      {children}
</AuthContext.Provider>
  );
};