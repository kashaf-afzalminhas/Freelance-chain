const { Web3 } = require('web3');
const ContractFactoryABI = require('../build/contracts/ContractFactory.json');
const FreelanceContractABI = require('../build/contracts/FreelanceContract.json');

const web3 = new Web3(process.env.ETHEREUM_NODE_URL);
const contractFactoryAddress = process.env.CONTRACT_FACTORY_ADDRESS;
const contractFactory = new web3.eth.Contract(ContractFactoryABI, contractFactoryAddress);

module.exports = {
  web3,
  contractFactory,
  FreelanceContractABI
};