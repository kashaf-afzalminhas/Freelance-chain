import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/useWeb3';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

// Array of admin wallet addresses
const ADMIN_WALLET_ADDRESSES = [
  '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1',
  '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc'
];

const AdminAccessGuard = ({ children }) => {
  const { account, isConnected, connectWallet } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);
  const isMounted = useRef(true);
  const connectionAttempts = useRef(0);
  const verificationTimeout = useRef(null);
  const previousPath = useRef(location.pathname);

  // Check if user is already verified
  useEffect(() => {
    const checkExistingVerification = () => {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      const adminUser = localStorage.getItem('adminUser');
      const token = localStorage.getItem('authToken');
      
      if (isAdmin && adminUser && token) {
        setIsVerified(true);
        setIsChecking(false);
        if (location.pathname === '/signin') {
          navigate('/admin/dashboard', { replace: true });
        }
      }
    };

    checkExistingVerification();
  }, [location.pathname, navigate]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (verificationTimeout.current) {
        clearTimeout(verificationTimeout.current);
      }
    };
  }, []);

  const handleWalletConnection = async () => {
    try {
      const connectedAddress = await connectWallet();
      if (!connectedAddress) {
        throw new Error('Failed to connect wallet');
      }
      return connectedAddress;
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet. Please try again.');
      throw error;
    }
  };

  const verifyAdminStatus = async (walletAddress) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.get('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          walletAddress: walletAddress.toLowerCase().trim()
        }
      });

      if (!response.data.success || !response.data.isAdmin) {
        throw new Error(response.data.message || 'Admin verification failed');
      }

      // Set admin state in localStorage
      localStorage.setItem('isAdmin', 'true');
      if (response.data.user) {
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('adminStateChanged'));

      return true;
    } catch (error) {
      console.error('Admin verification error:', error);
      throw error;
    }
  };

  const handleNavigation = (path) => {
    if (path === previousPath.current) {
      return;
    }
    previousPath.current = path;
    navigate(path, { replace: true });
  };

  const checkAdminAccess = async () => {
    try {
      // If already verified, no need to check again
      if (isVerified) {
        return;
      }

      // Handle wallet connection
      if (!isConnected || !account) {
        if (!hasAttemptedConnect && connectionAttempts.current === 0) {
          setHasAttemptedConnect(true);
          connectionAttempts.current += 1;
          
          try {
            await handleWalletConnection();
            // After connecting, let the effect run again with the new account
            return;
          } catch (error) {
            if (isMounted.current) {
              setIsChecking(false);
              handleNavigation('/');
            }
            return;
          }
        } else {
          if (isMounted.current) {
            setIsChecking(false);
            handleNavigation('/');
          }
          return;
        }
      }

      // Only proceed with verification if we have an account
      const normalizedUserAddress = account.toLowerCase().trim();
      
      // Check if the connected wallet is in the admin list
      const isAdminWallet = ADMIN_WALLET_ADDRESSES.some(
        adminAddress => adminAddress.toLowerCase().trim() === normalizedUserAddress
      );

      if (!isAdminWallet) {
        toast.error('Access denied: Invalid admin wallet address');
        if (isMounted.current) {
          setIsChecking(false);
          handleNavigation('/');
        }
        return;
      }

      // Verify admin status with backend
      await verifyAdminStatus(normalizedUserAddress);

      if (isMounted.current) {
        setIsVerified(true);
        setIsChecking(false);
        
        // Force immediate navigation to admin dashboard
        if (location.pathname === '/signin') {
          window.location.href = '/admin/dashboard';
        }
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      
      // Handle specific error cases
      if (error.message === 'Authentication required') {
        toast.error('Please sign in first');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please sign in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminUser');
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('adminStateChanged'));
      } else {
        toast.error(error.message || 'Error verifying admin status');
      }

      if (isMounted.current) {
        setIsChecking(false);
        handleNavigation('/');
      }
    }
  };

  useEffect(() => {
    // Clear any existing timeout
    if (verificationTimeout.current) {
      clearTimeout(verificationTimeout.current);
    }

    // Only run if not already verified and not currently checking
    if (!isVerified && isChecking) {
      // Add a small delay to ensure wallet connection is ready
      verificationTimeout.current = setTimeout(() => {
        checkAdminAccess();
      }, 1000);
    }

    return () => {
      if (verificationTimeout.current) {
        clearTimeout(verificationTimeout.current);
      }
    };
  }, [account, isConnected, hasAttemptedConnect, isVerified, location.pathname]);

  // If checking, show loading state
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Admin Access</h2>
          <p className="text-gray-600 mb-6">Please wait while we verify your admin status...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // If not verified, don't render anything (already navigated away)
  if (!isVerified) {
    return null;
  }

  // If verified, render children
  return children;
};

export default AdminAccessGuard; 