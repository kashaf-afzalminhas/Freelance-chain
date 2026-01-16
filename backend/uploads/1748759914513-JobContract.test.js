const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JobContract", function () {
    let jobContract;
  let owner, client, freelancer, other;
    const bidAmount = ethers.utils.parseEther("1.0"); // 1 VANRY
    const disputeFee = ethers.utils.parseEther("0.1"); // 0.1 VANRY

    beforeEach(async function () {
    [owner, client, freelancer, other] = await ethers.getSigners();
    
        const JobContract = await ethers.getContractFactory("JobContract");
        jobContract = await JobContract.deploy();
        await jobContract.deployed();
    });

    describe("Contract Creation", function () {
        it("Should create a new contract successfully", async function () {
            const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
            
            const tx = await jobContract.connect(client).createContract(
                freelancer.address,
                bidAmount,
                deadline,
                "Web Development",
                "Build a website"
            );

            const receipt = await tx.wait();
            const event = receipt.events.find(e => e.event === 'ContractCreated');
            
            expect(event.args.contractId).to.equal(0);
            expect(event.args.client).to.equal(client.address);
            expect(event.args.freelancer).to.equal(freelancer.address);

            const contract = await jobContract.getContract(0);
            expect(contract.status).to.equal(0); // Created status
            expect(contract.clientSigned).to.be.false;
            expect(contract.freelancerSigned).to.be.false;
            expect(contract.fundsDeposited).to.be.false;
        });

        it("Should reject invalid contract creation", async function () {
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            
            // Should reject zero address freelancer
            await expect(
                jobContract.connect(client).createContract(
                    ethers.constants.AddressZero,
                    bidAmount,
                    deadline,
                    "Web Development",
                    "Build a website"
                )
            ).to.be.revertedWith("Invalid freelancer address");

            // Should reject same address for client and freelancer
            await expect(
                jobContract.connect(client).createContract(
                    client.address,
                    bidAmount,
                    deadline,
                    "Web Development",
                    "Build a website"
                )
            ).to.be.revertedWith("Client cannot be freelancer");

            // Should reject zero bid amount
            await expect(
                jobContract.connect(client).createContract(
                    freelancer.address,
                    0,
                    deadline,
                    "Web Development",
                    "Build a website"
                )
            ).to.be.revertedWith("Bid amount must be positive");
        });
    });

    describe("Contract Signing Flow", function () {
        let contractId;
        
        beforeEach(async function () {
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            const tx = await jobContract.connect(client).createContract(
                freelancer.address,
                bidAmount,
                deadline,
                "Web Development", 
                "Build a website"
            );
            const receipt = await tx.wait();
            contractId = receipt.events[0].args.contractId;
        });

        it("Should allow client to sign and deposit funds", async function () {
            await expect(
                jobContract.connect(client).clientSignAndDeposit(contractId, { value: bidAmount })
            ).to.emit(jobContract, 'ClientSigned')
             .withArgs(contractId, bidAmount);

            const contract = await jobContract.getContract(contractId);
            expect(contract.status).to.equal(1); // ClientSigned status
            expect(contract.clientSigned).to.be.true;
            expect(contract.fundsDeposited).to.be.true;
            
            const escrowBalance = await jobContract.getEscrowBalance(contractId);
            expect(escrowBalance).to.equal(bidAmount);
        });

        it("Should reject incorrect deposit amount", async function () {
            const incorrectAmount = ethers.utils.parseEther("0.5");
            
            await expect(
                jobContract.connect(client).clientSignAndDeposit(contractId, { value: incorrectAmount })
            ).to.be.revertedWith("Incorrect amount sent");
        });

        it("Should allow freelancer to sign after client", async function () {
            // First client signs and deposits
            await jobContract.connect(client).clientSignAndDeposit(contractId, { value: bidAmount });
            
            // Then freelancer signs
            await expect(
                jobContract.connect(freelancer).freelancerSign(contractId)
            ).to.emit(jobContract, 'FreelancerSigned')
             .withArgs(contractId);

            const contract = await jobContract.getContract(contractId);
            expect(contract.status).to.equal(2); // BothSigned status
            expect(contract.freelancerSigned).to.be.true;
        });

        it("Should reject freelancer signing before client", async function () {
            await expect(
                jobContract.connect(freelancer).freelancerSign(contractId)
            ).to.be.revertedWith("Client must sign and deposit first");
        });
    });

    describe("Work Submission and Approval", function () {
        let contractId;
        
        beforeEach(async function () {
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            const tx = await jobContract.connect(client).createContract(
      freelancer.address,
                bidAmount,
      deadline,
                "Web Development",
                "Build a website"
            );
            const receipt = await tx.wait();
            contractId = receipt.events[0].args.contractId;
            
            // Complete signing process
            await jobContract.connect(client).clientSignAndDeposit(contractId, { value: bidAmount });
            await jobContract.connect(freelancer).freelancerSign(contractId);
        });

        it("Should allow freelancer to submit work", async function () {
            const workHash = "QmHash123456789";
            
            await expect(
                jobContract.connect(freelancer).submitWork(contractId, workHash)
            ).to.emit(jobContract, 'WorkSubmitted')
             .withArgs(contractId, workHash);

            const contract = await jobContract.getContract(contractId);
            expect(contract.status).to.equal(3); // WorkSubmitted status
            expect(contract.workSubmissionHash).to.equal(workHash);
        });

        it("Should reject work submission before both parties sign", async function () {
            // Create new contract without full signing
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            const tx = await jobContract.connect(client).createContract(
                freelancer.address,
                bidAmount,
                deadline,
                "Another Job",
                "Another description"
            );
            const receipt = await tx.wait();
            const newContractId = receipt.events[0].args.contractId;
            
            await expect(
                jobContract.connect(freelancer).submitWork(newContractId, "QmHash")
            ).to.be.revertedWith("Contract must be in BothSigned status");
        });

        it("Should allow client to approve work and release payment", async function () {
            // Submit work first
            const workHash = "QmHash123456789";
            await jobContract.connect(freelancer).submitWork(contractId, workHash);
            
            const freelancerBalanceBefore = await freelancer.getBalance();
            const ownerBalanceBefore = await owner.getBalance();
            
            await expect(
                jobContract.connect(client).approveWork(contractId)
            ).to.emit(jobContract, 'WorkApproved')
             .withArgs(contractId)
             .and.to.emit(jobContract, 'PaymentReleased');

            const contract = await jobContract.getContract(contractId);
            expect(contract.status).to.equal(4); // Completed status
            
            // Check balances (freelancer should receive 95%, owner 5%)
            const freelancerBalanceAfter = await freelancer.getBalance();
            const ownerBalanceAfter = await owner.getBalance();
            
            const expectedFreelancerPayment = bidAmount.mul(95).div(100);
            const expectedPlatformFee = bidAmount.mul(5).div(100);
            
            expect(freelancerBalanceAfter.sub(freelancerBalanceBefore))
                .to.equal(expectedFreelancerPayment);
            expect(ownerBalanceAfter.sub(ownerBalanceBefore))
                .to.equal(expectedPlatformFee);
        });

        it("Should allow client to reject work", async function () {
            // Submit work first
            const workHash = "QmHash123456789";
            await jobContract.connect(freelancer).submitWork(contractId, workHash);
            
            const rejectionReason = "Work doesn't meet requirements";
            
            await expect(
                jobContract.connect(client).rejectWork(contractId, rejectionReason)
            ).to.emit(jobContract, 'WorkRejected')
             .withArgs(contractId, rejectionReason);

            // Status should remain WorkSubmitted
            const contract = await jobContract.getContract(contractId);
            expect(contract.status).to.equal(3); // WorkSubmitted status
        });
    });

    describe("Dispute Resolution", function () {
        let contractId;
        
        beforeEach(async function () {
    const deadline = Math.floor(Date.now() / 1000) + 86400;
            const tx = await jobContract.connect(client).createContract(
      freelancer.address,
                bidAmount,
      deadline,
                "Web Development",
                "Build a website"
            );
            const receipt = await tx.wait();
            contractId = receipt.events[0].args.contractId;
            
            // Complete signing and work submission
            await jobContract.connect(client).clientSignAndDeposit(contractId, { value: bidAmount });
            await jobContract.connect(freelancer).freelancerSign(contractId);
            await jobContract.connect(freelancer).submitWork(contractId, "QmHash123");
        });

        it("Should allow raising dispute by client", async function () {
            await expect(
                jobContract.connect(client).raiseDispute(contractId, { value: disputeFee })
            ).to.emit(jobContract, 'DisputeRaised')
             .withArgs(contractId, client.address);

            const contract = await jobContract.getContract(contractId);
            expect(contract.status).to.equal(5); // Disputed status
        });

        it("Should allow raising dispute by freelancer", async function () {
            await expect(
                jobContract.connect(freelancer).raiseDispute(contractId, { value: disputeFee })
            ).to.emit(jobContract, 'DisputeRaised')
             .withArgs(contractId, freelancer.address);

            const contract = await jobContract.getContract(contractId);
            expect(contract.status).to.equal(5); // Disputed status
        });

        it("Should reject dispute with incorrect fee", async function () {
            const incorrectFee = ethers.utils.parseEther("0.05");
            
            await expect(
                jobContract.connect(client).raiseDispute(contractId, { value: incorrectFee })
            ).to.be.revertedWith("Incorrect dispute fee");
        });

        it("Should allow owner to resolve dispute", async function () {
            // Raise dispute first
            await jobContract.connect(client).raiseDispute(contractId, { value: disputeFee });
            
            const clientShare = bidAmount.div(2); // 50% to client
            const freelancerShare = bidAmount.div(2); // 50% to freelancer
            
            await expect(
                jobContract.connect(owner).resolveDispute(contractId, clientShare, freelancerShare)
            ).to.emit(jobContract, 'DisputeResolved')
             .withArgs(contractId, clientShare, freelancerShare);

            const contract = await jobContract.getContract(contractId);
            expect(contract.status).to.equal(4); // Completed status
        });
    });

    describe("Refund Mechanism", function () {
        let contractId;
        
        beforeEach(async function () {
            // Get current block timestamp and add buffer for deadline
            const currentBlock = await ethers.provider.getBlock("latest");
            const currentTimestamp = currentBlock.timestamp;
            const deadline = currentTimestamp + 7200; // 2 hours from current block time
            
            const tx = await jobContract.connect(client).createContract(
      freelancer.address,
                bidAmount,
                deadline,
                "Web Development",
                "Build a website"
            );
            const receipt = await tx.wait();
            contractId = receipt.events[0].args.contractId;
            
            // Client signs and deposits
            await jobContract.connect(client).clientSignAndDeposit(contractId, { value: bidAmount });
        });

        it("Should allow refund after deadline passes", async function () {
            // Fast forward time by 2 hours + buffer (7300 seconds)
            await ethers.provider.send("evm_increaseTime", [7300]);
            await ethers.provider.send("evm_mine"); // Mine a new block with updated timestamp
            
            const clientBalanceBefore = await client.getBalance();
            
            const tx = await jobContract.connect(client).requestRefund(contractId);
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
            
            await expect(tx)
                .to.emit(jobContract, 'RefundIssued')
                .withArgs(contractId, bidAmount);

            const clientBalanceAfter = await client.getBalance();
            const contract = await jobContract.getContract(contractId);
            
            expect(contract.status).to.equal(4); // Completed status (refunded)
            expect(clientBalanceAfter.add(gasUsed).sub(clientBalanceBefore))
                .to.equal(bidAmount);
        });

        it("Should reject refund before deadline", async function () {
            await expect(
                jobContract.connect(client).requestRefund(contractId)
            ).to.be.revertedWith("Deadline not passed");
        });

        it("Should reject refund if already completed", async function () {
            // Fast forward time
            await ethers.provider.send("evm_increaseTime", [7300]);
    await ethers.provider.send("evm_mine");

            // Request refund once
            await jobContract.connect(client).requestRefund(contractId);
            
            // Try to refund again
            await expect(
                jobContract.connect(client).requestRefund(contractId)
            ).to.be.revertedWith("Contract already completed");
        });
    });

    describe("Access Control", function () {
        let contractId;
        
        beforeEach(async function () {
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            const tx = await jobContract.connect(client).createContract(
                freelancer.address,
                bidAmount,
                deadline,
                "Web Development",
                "Build a website"
            );
            const receipt = await tx.wait();
            contractId = receipt.events[0].args.contractId;
        });

        it("Should reject unauthorized access to client functions", async function () {
            await expect(
                jobContract.connect(other).clientSignAndDeposit(contractId, { value: bidAmount })
            ).to.be.revertedWith("Only client can call this");
        });

        it("Should reject unauthorized access to freelancer functions", async function () {
            await expect(
                jobContract.connect(other).freelancerSign(contractId)
            ).to.be.revertedWith("Only freelancer can call this");
        });

        it("Should reject unauthorized access to owner functions", async function () {
            await expect(
                jobContract.connect(client).setDisputeFee(disputeFee.mul(2))
            ).to.be.revertedWith("Only owner can call this");
        });
    });

    describe("Edge Cases", function () {
        it("Should handle non-existent contract ID", async function () {
            await expect(
                jobContract.getContract(999)
            ).to.be.revertedWith("Contract does not exist");
        });

        it("Should return correct contract count", async function () {
            expect(await jobContract.getContractCount()).to.equal(0);
            
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            await jobContract.connect(client).createContract(
                freelancer.address,
                bidAmount,
                deadline,
                "Job 1",
                "Description 1"
            );
            
            expect(await jobContract.getContractCount()).to.equal(1);
        });
    });

    describe("Platform Fee Management", function () {
        it("Should allow owner to set platform fee", async function () {
            await jobContract.connect(owner).setPlatformFeePercent(3);
            // Test that the fee is applied correctly in a payment
            
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            const tx = await jobContract.connect(client).createContract(
                freelancer.address,
                bidAmount,
                deadline,
                "Web Development",
                "Build a website"
            );
            const receipt = await tx.wait();
            const contractId = receipt.events[0].args.contractId;
            
            await jobContract.connect(client).clientSignAndDeposit(contractId, { value: bidAmount });
            await jobContract.connect(freelancer).freelancerSign(contractId);
            await jobContract.connect(freelancer).submitWork(contractId, "QmHash");
            
            const ownerBalanceBefore = await owner.getBalance();
            await jobContract.connect(client).approveWork(contractId);
            const ownerBalanceAfter = await owner.getBalance();
            
            const expectedFee = bidAmount.mul(3).div(100);
            expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.equal(expectedFee);
        });

        it("Should reject platform fee greater than 10%", async function () {
            await expect(
                jobContract.connect(owner).setPlatformFeePercent(15)
            ).to.be.revertedWith("Platform fee cannot exceed 10%");
        });
    });

    describe("Workflow Edge Cases", function () {
        it("Should prevent double submission of work", async function () {
            // Complete full workflow
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            const tx = await jobContract.connect(client).createContract(
                freelancer.address,
                bidAmount,
                deadline,
                "Web Development",
                "Build a website"
            );
            const receipt = await tx.wait();
            const contractId = receipt.events[0].args.contractId;
            
            await jobContract.connect(client).clientSignAndDeposit(contractId, { value: bidAmount });
            await jobContract.connect(freelancer).freelancerSign(contractId);
            
            // First submission should work
            await jobContract.connect(freelancer).submitWork(contractId, "QmHash1");
            
            // Second submission should fail
            await expect(
                jobContract.connect(freelancer).submitWork(contractId, "QmHash2")
            ).to.be.revertedWith("Contract must be in BothSigned status");
        });

        it("Should prevent approval of unsubmitted work", async function () {
            const deadline = Math.floor(Date.now() / 1000) + 86400;
            const tx = await jobContract.connect(client).createContract(
                freelancer.address,
                bidAmount,
                deadline,
                "Web Development",
                "Build a website"
            );
            const receipt = await tx.wait();
            const contractId = receipt.events[0].args.contractId;
            
            await jobContract.connect(client).clientSignAndDeposit(contractId, { value: bidAmount });
            await jobContract.connect(freelancer).freelancerSign(contractId);
            
            await expect(
                jobContract.connect(client).approveWork(contractId)
            ).to.be.revertedWith("Work not submitted");
        });
  });
});