import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '../../utils/contract';

// Create context
const Web3Context = createContext();

// Provider component
export const Web3Provider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isAuthorizedSigner, setIsAuthorizedSigner] = useState(false);

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

  const checkSignerAuthorization = async (address) => {
    if (!provider || !address) return false;
    try {
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      const isAuthorized = await contract.authorizedSigners(address);
      setIsAuthorizedSigner(isAuthorized);
      return isAuthorized;
    } catch (error) {
      console.error('Error checking signer authorization:', error);
      return false;
    }
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
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any'); // Use 'any' to let MetaMask handle network

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
          // This error code indicates that the chain has not been added to MetaMask
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
        return; // Stop execution here, page will reload
      }

      setAccount(account);
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true);
      setChainId(network.chainId); // Set chainId after successful connection/switch

      // Check authorization only after connected and on correct network
      checkSignerAuthorization(account);

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
  };

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
      // Convert hex to number for comparison
      const chainIdNum = parseInt(hexChainId, 16);
      setChainId(chainIdNum); // Update chainId state immediately
      // If the new chain is not Vanguard, disconnect
      if (chainIdNum !== VANGUARD_CHAIN_ID_NUM) {
          console.log('Switched to wrong network, disconnecting...');
          disconnectWallet();
      } else {
          // If switched to Vanguard, reconnect to update provider/signer
          console.log('Switched to Vanguard network, reconnecting...');
          connectWallet();
      }
    };

    if (window.ethereum) {
      // Initial check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            // If accounts are found, check network and connect
            window.ethereum.request({ method: 'eth_chainId' })
              .then(hexChainId => {
                const currentChainId = parseInt(hexChainId, 16);
                if (currentChainId === VANGUARD_CHAIN_ID_NUM) {
                  connectWallet(); // Connect if already on Vanguard
                } else {
                   // Optionally, prompt to switch here or handle in connectWallet
                   console.log('Wallet connected but on wrong network.');
                   // The connectWallet function will handle the switch/add prompt when called by user action
                }
              })
              .catch(console.error);
          } else {
              setIsConnected(false); // No accounts found
          }
        })
        .catch(console.error);

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

    }

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        account,
        provider,
        signer,
        chainId,
        isAuthorizedSigner,
        connectWallet,
        disconnectWallet,
        checkSignerAuthorization,
        VANGUARD_CHAIN_ID_NUM // Export for external checks if needed
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook for easy access
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
