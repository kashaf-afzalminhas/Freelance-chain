// truffle-config.js
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic: process.env.MNEMONIC,
        providerOrUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
      }),
      network_id: 11155111,
      gas: 5000000
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: { optimizer: { enabled: true, runs: 200 } }
    }
  }
};