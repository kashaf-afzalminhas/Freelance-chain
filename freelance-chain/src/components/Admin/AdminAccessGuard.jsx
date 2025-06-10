import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

// Make sure this matches exactly with the backend ADMIN_WALLET_ADDRESS
const ADMIN_WALLET_ADDRESS = '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc';

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
        const normalizedAdminAddress = ADMIN_WALLET_ADDRESS.toLowerCase().trim();
        const normalizedUserAddress = account?.toLowerCase().trim();

        if (!normalizedUserAddress) {
          toast.error('No wallet address detected');
          if (isMounted.current) setIsChecking(false);
          navigate('/');
          return;
        }

        if (normalizedUserAddress !== normalizedAdminAddress) {
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
          const response = await api.get('/admin/verify', {
            params: {
              walletAddress: normalizedUserAddress
            }
          });

          if (!response.data.success || !response.data.isAdmin) {
            throw new Error('Admin verification failed');
          }

          localStorage.setItem('isAdmin', 'true');
          if (isMounted.current) {
            setIsVerified(true);
            setIsChecking(false);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Error verifying admin status');
          if (isMounted.current) setIsChecking(false);
          navigate('/');
        }
      } catch (error) {
        toast.error('Error checking admin access');
        if (isMounted.current) setIsChecking(false);
        navigate('/');
      }
    };

    // Only run if not already verified and not currently checking
    if (!isVerified && isChecking) {
      verifyAdminAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isConnected, hasAttemptedConnect]);

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