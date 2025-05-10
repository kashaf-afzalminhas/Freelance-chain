const JobContract = artifacts.require("JobContract");

module.exports = function(deployer) {
  deployer.deploy(JobContract);
};