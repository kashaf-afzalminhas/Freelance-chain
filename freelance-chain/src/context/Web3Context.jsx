import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Create context
const Web3Context = createContext();

// Provider component
export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize provider
  const initProvider = () => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      return web3Provider;
    } else {
      console.error("MetaMask not detected!");
      return null;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      const provider = initProvider();
      if (!provider) return;

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      // Update state
      setAccount(accounts[0]);
      setSigner(signer);
      setNetwork(network);
      setIsConnected(true);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        setAccount(newAccounts[0] || null);
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return accounts[0];
    } catch (error) {
      console.error("Wallet connection error:", error);
      return null;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setNetwork(null);
    setIsConnected(false);
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  };

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = initProvider();
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const network = await provider.getNetwork();
          setAccount(accounts[0]);
          setSigner(signer);
          setNetwork(network);
          setIsConnected(true);
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        network,
        isConnected,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook for easy access
export const useWeb3 = () => useContext(Web3Context);
