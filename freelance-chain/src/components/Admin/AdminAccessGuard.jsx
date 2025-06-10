import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
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
  const [isChecking, setIsChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        // Only try to connect wallet once
        if (!isConnected && !hasAttemptedConnect) {
          setHasAttemptedConnect(true);
          const connectedAddress = await connectWallet();
          if (!connectedAddress) {
            toast.error('Please connect your wallet to access the admin panel');
            if (isMounted.current) setIsChecking(false);
            navigate('/');
            return;
          }
        }

        // Normalize addresses for comparison
        const normalizedUserAddress = account?.toLowerCase().trim();

        if (!normalizedUserAddress) {
          toast.error('No wallet address detected');
          if (isMounted.current) setIsChecking(false);
          navigate('/');
          return;
        }

        // Check if the connected wallet is in the admin list
        const isAdminWallet = ADMIN_WALLET_ADDRESSES.some(
          adminAddress => adminAddress.toLowerCase().trim() === normalizedUserAddress
        );

        if (!isAdminWallet) {
          toast.error('Access denied: Invalid admin wallet address');
          if (isMounted.current) setIsChecking(false);
          navigate('/');
          return;
        }

        // Check if user has admin role in the database
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Authentication required');
          if (isMounted.current) setIsChecking(false);
          navigate('/');
          return;
        }

        try {
          console.log('Verifying admin access with:', {
            walletAddress: normalizedUserAddress,
            token: token ? 'Token exists' : 'No token'
          });

          const response = await api.get('/api/admin/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              walletAddress: normalizedUserAddress
            }
          });

          console.log('Admin verification response:', response.data);

          if (!response.data.success || !response.data.isAdmin) {
            throw new Error(response.data.message || 'Admin verification failed');
          }

          localStorage.setItem('isAdmin', 'true');
          if (response.data.user) {
            localStorage.setItem('adminUser', JSON.stringify(response.data.user));
          }

          if (isMounted.current) {
            setIsVerified(true);
            setIsChecking(false);
          }
        } catch (error) {
          console.error('Admin verification error:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          
          toast.error(error.response?.data?.message || 'Error verifying admin status');
          if (isMounted.current) {
            setIsChecking(false);
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        toast.error('Error checking admin access');
        if (isMounted.current) {
          setIsChecking(false);
          navigate('/');
        }
      }
    };

    // Only run if not already verified and not currently checking
    if (!isVerified && isChecking) {
      verifyAdminAccess();
    }
  }, [account, isConnected, hasAttemptedConnect, navigate]);

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

  if (!isVerified) {
    return null; // Already navigated away or error shown
  }

  return children;
};

export default AdminAccessGuard; 