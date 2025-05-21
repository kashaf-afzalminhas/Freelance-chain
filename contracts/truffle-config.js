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
        providerOrUrl: `https://mainnet.infura.io/v3/91fb08bbf29b4b68a8b2b0db5a8fa2db`
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