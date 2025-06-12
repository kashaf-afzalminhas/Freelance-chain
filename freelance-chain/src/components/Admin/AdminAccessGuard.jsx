import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminAccessGuard = ({ children }) => {
  const navigate = useNavigate();
  const { account, connectWallet, isConnected } = useWeb3();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [account]);

    const checkExistingVerification = () => {
    const verifiedAdmin = localStorage.getItem('verifiedAdmin');
    const verifiedWallet = localStorage.getItem('verifiedWallet');
    const authToken = localStorage.getItem('authToken');
    
    if (verifiedAdmin && verifiedWallet === account && authToken) {
      setIsAdmin(true);
      setIsVerifying(false);
      return true;
    }
    return false;
  };

  const handleWalletConnection = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet');
      navigate('/');
    }
  };

  const verifyAdminStatus = async (walletAddress) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          walletAddress
        }
      });

      if (response.data.success && response.data.isAdmin) {
        localStorage.setItem('verifiedAdmin', 'true');
        localStorage.setItem('verifiedWallet', walletAddress);
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin verification error:', error);
      // If token is invalid or expired, clear stored data
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('verifiedAdmin');
        localStorage.removeItem('verifiedWallet');
      }
      return false;
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const checkAdminAccess = async () => {
    setIsVerifying(true);

    // First check if we have stored verification
    if (checkExistingVerification()) {
      setIsVerifying(false);
        return;
      }

    // If no wallet is connected, prompt connection
    if (!isConnected) {
            await handleWalletConnection();
          return;
        }

    // Verify admin status
    const isVerified = await verifyAdminStatus(account);
    
    if (!isVerified) {
      toast.error('Access denied: Admin privileges required');
      navigate('/');
        return;
      }

    setIsVerifying(false);
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return children;
};

export default AdminAccessGuard; 