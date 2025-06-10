import { useState, useEffect } from 'react';
import { useWeb3 } from './useWeb3';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ADMIN_WALLET_ADDRESS = '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc';

export const useAdminWallet = () => {
  const { account, connect, disconnect, isConnected } = useWeb3();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isConnected || !account) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Normalize addresses for comparison
        const normalizedAdminAddress = ADMIN_WALLET_ADDRESS.toLowerCase();
        const normalizedUserAddress = account.toLowerCase();

        const isAdminWallet = normalizedUserAddress === normalizedAdminAddress;
        
        if (isAdminWallet) {
          // Verify admin status with backend
          const token = localStorage.getItem('authToken');
          if (token) {
            const response = await axios.get('http://localhost:5000/api/admin/verify', {
              headers: {
                'Authorization': `Bearer ${token}`
              },
              params: {
                walletAddress: normalizedUserAddress
              }
            });

            if (response.data.isAdmin) {
              setIsAdmin(true);
              localStorage.setItem('isAdmin', 'true');
            } else {
              setIsAdmin(false);
              localStorage.removeItem('isAdmin');
              toast.error('Access denied: Invalid admin wallet');
              disconnect();
            }
          } else {
            setIsAdmin(false);
            localStorage.removeItem('isAdmin');
            toast.error('Please sign in first');
            disconnect();
          }
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdmin');
          toast.error('Access denied: Invalid admin wallet');
          disconnect();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        localStorage.removeItem('isAdmin');
        toast.error('Error verifying admin status');
        disconnect();
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [account, isConnected, disconnect]);

  const connectAdminWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectAdminWallet = () => {
    disconnect();
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return {
    isAdmin,
    isLoading,
    connectAdminWallet,
    disconnectAdminWallet,
    account
  };
}; 