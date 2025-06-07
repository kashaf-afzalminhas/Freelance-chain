const JobContract = artifacts.require("JobContract");

contract("JobContract", (accounts) => {
  let jobContract;
  const [owner, client, freelancer, other] = accounts;
  const bidAmount = web3.utils.toWei("1", "ether");
  const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days from now

  before(async () => {
    jobContract = await JobContract.new();
  });

  it("should create a new contract", async () => {
    const tx = await jobContract.createContract(
      freelancer,
      bidAmount,
      deadline,
      "Website Development",
      "Build a responsive website",
      { from: client }
    );

    const contractId = tx.logs[0].args.contractId.toNumber();
    const contract = await jobContract.getContract(contractId);

    assert.equal(contract.client, client, "Client address mismatch");
    assert.equal(contract.freelancer, freelancer, "Freelancer address mismatch");
    assert.equal(contract.jobTitle, "Website Development", "Job title mismatch");
  });

  it("should deposit funds into escrow", async () => {
    // First create contract
    await jobContract.createContract(
      freelancer,
      bidAmount,
      deadline,
      "Logo Design",
      "Design a company logo",
      { from: client }
    );

    // Deposit funds
    await jobContract.depositFunds(0, {
      from: client,
      value: bidAmount
    });

    const contract = await jobContract.getContract(0);
    assert.equal(
      contract.fundsDeposited,
      bidAmount,
      "Funds not deposited correctly"
    );
  });

  it("should complete full workflow", async () => {
    // 1. Create contract
    await jobContract.createContract(
      freelancer,
      bidAmount,
      deadline,
      "Smart Contract",
      "Develop a smart contract",
      { from: client }
    );

    // 2. Deposit funds
    await jobContract.depositFunds(1, {
      from: client,
      value: bidAmount
    });

    // 3. Client signs
    await jobContract.signContract(1, { from: client });

    // 4. Freelancer signs
    await jobContract.signContract(1, { from: freelancer });

    // 5. Submit work
    const workHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
    await jobContract.submitWork(1, workHash, { from: freelancer });

    // 6. Approve work
    await jobContract.approveWork(1, { from: client });

    // Verify status
    const contract = await jobContract.getContract(1);
    assert.equal(contract.status, 4, "Contract not completed"); // 4 = Completed
  });

  it("should handle disputes", async () => {
    // Create contract
    await jobContract.createContract(
      freelancer,
      bidAmount,
      deadline,
      "Bug Fixes",
      "Fix critical bugs",
      { from: client }
    );

    // Deposit funds
    await jobContract.depositFunds(2, {
      from: client,
      value: bidAmount
    });

    // Raise dispute
    const disputeFee = await jobContract.disputeFee();
    await jobContract.raiseDispute(2, {
      from: freelancer,
      value: disputeFee
    });

    // Verify status
    const contract = await jobContract.getContract(2);
    assert.equal(contract.status, 5, "Contract not in dispute"); // 5 = Disputed
  });
});