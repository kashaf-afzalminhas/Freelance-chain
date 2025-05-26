// config/web3.js
const Web3 = require('web3');
const FreelanceAgreement = artifacts.require("FreelanceAgreement");

// Initialize Web3 with fallback options
const initWeb3 = () => {
  try {
    // Try to connect to the provider URL from environment variables
    if (process.env.PROVIDER_URL) {
      console.log('Connecting to Ethereum network:', process.env.PROVIDER_URL);
      const web3 = new Web3(process.env.PROVIDER_URL);
      
      // Test the connection
      web3.eth.net.isListening()
        .then(() => console.log('Successfully connected to Ethereum network'))
        .catch(err => {
          console.error('Failed to connect to Ethereum network:', err);
          throw err;
        });
      
      return web3;
    } else {
      throw new Error('PROVIDER_URL not set in environment variables');
    }
  } catch (error) {
    console.error('Error initializing Web3:', error);
    throw error;
  }
};

// Initialize contract factory
const initContractFactory = (web3) => {
  try {
    if (!process.env.FACTORY_ADDRESS) {
      throw new Error('FACTORY_ADDRESS not set in environment variables');
    }

    const factory = new web3.eth.Contract(
      FreelanceAgreement.abi,
      process.env.FACTORY_ADDRESS
    );

    return factory;
  } catch (error) {
    console.error('Error initializing contract factory:', error);
    throw error;
  }
};

// Initialize Web3 and contract factory
const web3 = initWeb3();
const contractFactory = initContractFactory(web3);

module.exports = { web3, contractFactory };