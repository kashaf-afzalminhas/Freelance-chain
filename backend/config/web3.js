// config/web3.js
const FreelanceAgreement = artifacts.require("FreelanceAgreement");
const web3 = new Web3(process.env.PROVIDER_URL);
const factory = new web3.eth.Contract(FreelanceAgreementFactoryABI, process.env.FACTORY_ADDRESS);
module.exports = { web3, contractFactory: factory };