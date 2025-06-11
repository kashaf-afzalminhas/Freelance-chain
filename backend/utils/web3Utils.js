const { ethers } = require('ethers');
require('dotenv').config(); // Ensure dotenv is loaded to read environment variables

// TODO: Initialize your provider and signer here
// This is a placeholder file. Replace with your actual web3 initialization.

let provider;
let signer;

const initializeWeb3 = async () => {
    try {
        // Initialize provider
        // Use the PROVIDER_URL from environment variables
        const rpcUrl = process.env.RPC_URL;
        if (!rpcUrl) {
            throw new Error('RPC_URL environment variable not set');
        }
        provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        // Wait for the provider to be ready
        await provider.ready;
        console.log('Web3 provider initialized, connected to network:', provider.network.name);
        
        // Initialize signer using a private key from environment variables
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('PRIVATE_KEY environment variable not set. Signer cannot be initialized.');
        }
        signer = new ethers.Wallet(privateKey, provider);
        console.log('Web3 signer initialized for address:', await signer.getAddress());

        console.log('Web3 utilities initialized successfully.');

    } catch (error) {
        console.error('Failed to initialize Web3 utilities:', error);
        // Depending on your application's needs, you might want to exit or handle this differently
        // process.exit(1); // Example: Exit if web3 initialization fails
        throw error; // Re-throw the error to be caught by the .catch() below
    }
};

// Initialize immediately (or call this from your server setup, ensuring dotenv is loaded before this)
initializeWeb3().catch(error => console.error('Unhandled error during Web3 initialization:', error));

const getProvider = () => {
    if (!provider) throw new Error('Web3 provider not available. Initialization failed or not complete.');
    return provider;
};

const getSigner = () => {
    if (!signer) throw new Error('Web3 signer not available. Ensure initialization is complete and PRIVATE_KEY is configured.');
    return signer;
};

module.exports = {
    initializeWeb3,
    getProvider,
    getSigner,
}; 