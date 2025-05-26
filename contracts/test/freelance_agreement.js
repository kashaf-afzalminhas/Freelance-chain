// test/freelance_test.js
const ContractFactory = artifacts.require("ContractFactory");

contract("FreelanceAgreement", (accounts) => {
  let factory;
  const [client, freelancer] = accounts;

  before(async () => {
    factory = await ContractFactory.new();
  });

  it("should create a new agreement", async () => {
    const milestones = [{
      description: "Test Milestone",
      amount: web3.utils.toWei("1", "ether"),
      deadline: Math.floor(Date.now() / 1000) + 3600
    }];
    
    const tx = await factory.createContract(
      freelancer,
      milestones,
      web3.utils.toWei("1", "ether"),
      { from: client, value: web3.utils.toWei("1", "ether") }
    );
    
    assert.ok(tx.receipt.status, "Transaction failed");
  });
});