import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

// Array of admin wallet addresses
const ADMIN_WALLET_ADDRESSES = [
  '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1',
  '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc'
];

export const useAdminWallet = () => {
  const { account, isConnected } = useWeb3();
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  
  useEffect(() => {
    if (!isConnected || !account) {
      setIsAdmin(false);
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminUser');
      return;
    }

    const checkAdminStatus = async () => {
      const normalizedUserAddress = account.toLowerCase().trim();
      const isAdminWallet = ADMIN_WALLET_ADDRESSES.some(
        adminAddress => adminAddress.toLowerCase().trim() === normalizedUserAddress
      );
      
      // Only update state if it's different
      if (isAdmin !== isAdminWallet) {
        setIsAdmin(isAdminWallet);
        if (!isAdminWallet) {
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminUser');
        }
      }
    };

    checkAdminStatus();
  }, [account, isConnected, isAdmin]);

  const connectAdminWallet = async () => {
    // This is now handled by AdminAccessGuard
    return null;
  };

  const disconnectAdminWallet = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
  };

  return {
    isAdmin,
    connectAdminWallet,
    disconnectAdminWallet
  };
}; 