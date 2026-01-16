import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '../../utils/contract';
import { useAuth } from '../AuthContext';

// Create context with default values
export const Web3Context = createContext({
  account: null,
  provider: null,
  signer: null,
  network: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

// Provider component
export const Web3Provider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isAuthorizedSigner, setIsAuthorizedSigner] = useState(false);
  const [network, setNetwork] = useState(null);
  
  // Safely get auth context
  let auth = null;
  try {
    auth = useAuth();
  } catch (error) {
    console.log('Auth context not available:', error.message);
  }

  // Define both hex and numeric versions
  const VANGUARD_CHAIN_ID_HEX = '0x13308'; // Hex string for MetaMask (78600)
  const VANGUARD_CHAIN_ID_NUM = 78600; // Numeric for comparisons
  
  const VANGUARD_NETWORK = {
    chainId: VANGUARD_CHAIN_ID_HEX,
    chainName: 'Vanguard Testnet',
    nativeCurrency: {
      name: 'Vanguard',
      symbol: 'VG',
      decimals: 18
    },
    rpcUrls: ['https://rpc-vanguard.vanarchain.com'],
    blockExplorerUrls: ['https://explorer-vanguard.vanarchain.com']
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Create a provider with Vanguard network settings and ENS disabled
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

      // Get the signer
      const signer = provider.getSigner();

      // Check if we're on the correct network
      const network = await provider.getNetwork();
      if (network.chainId !== VANGUARD_CHAIN_ID_NUM) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: VANGUARD_CHAIN_ID_HEX }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [VANGUARD_NETWORK],
              });
            } catch (addError) {
              throw new Error('Failed to add Vanguard network to MetaMask');
            }
          } else {
            throw new Error('Failed to switch to Vanguard network');
          }
        }
        // After switching or adding, refresh to ensure provider is updated
        window.location.reload();
        return;
      }

      setAccount(account);
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true);
      setChainId(network.chainId);
      setNetwork(network);

      // Save wallet connection state
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', account);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsAuthorizedSigner(false);
    setNetwork(null);
    
    // Clear wallet connection state
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('verifiedAdmin');
    localStorage.removeItem('verifiedWallet');
    
    // Remove all event listeners
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
    
    // If auth context is available and user is logged in, log them out
    if (auth?.user) {
      auth.logout();
    }
  };

  // Check for saved wallet connection on mount
  useEffect(() => {
    const savedWalletConnected = localStorage.getItem('walletConnected');
    const savedWalletAddress = localStorage.getItem('walletAddress');
    
    if (savedWalletConnected === 'true' && savedWalletAddress) {
      connectWallet().catch(console.error);
    }
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        // Re-check authorization for the new account
        checkSignerAuthorization(accounts[0]);
      }
    };

    const handleChainChanged = (hexChainId) => {
      const chainIdNum = parseInt(hexChainId, 16);
      setChainId(chainIdNum);
      if (chainIdNum !== VANGUARD_CHAIN_ID_NUM) {
        console.log('Switched to wrong network, disconnecting...');
        disconnectWallet();
      } else {
        console.log('Switched to Vanguard network, reconnecting...');
        connectWallet();
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const value = {
    isConnected,
    account,
    provider,
    signer,
    chainId,
    isAuthorizedSigner,
    connectWallet,
    disconnectWallet,
    VANGUARD_CHAIN_ID_NUM,
    network
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
