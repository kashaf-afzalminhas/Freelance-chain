// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FreelanceContract is ReentrancyGuard, Ownable {
    enum ContractState { Created, Funded, InProgress, Completed, Disputed, Cancelled }
    enum MilestoneState { Pending, Submitted, Approved, Rejected }
    
    struct Milestone {
        string description;
        uint256 amount;
        uint256 deadline;
        MilestoneState state;
    }
    
    address public client;
    address public freelancer;
    uint256 public totalAmount;
    uint256 public amountReleased;
    ContractState public state;
    Milestone[] public milestones;
    
    event ContractFunded(uint256 amount);
    event MilestoneSubmitted(uint256 milestoneIndex);
    event MilestoneApproved(uint256 milestoneIndex, uint256 amount);
    event PaymentReleased(address recipient, uint256 amount);
    event ContractCompleted();
    event DisputeRaised(address by);
    
    constructor(
        address _client,
        address _freelancer,
        Milestone[] memory _milestones,
        uint256 _totalAmount
    ) {
        client = _client;
        freelancer = _freelancer;
        totalAmount = _totalAmount;
        
        for (uint i = 0; i < _milestones.length; i++) {
            milestones.push(_milestones[i]);
        }
        
        transferOwnership(_client);
    }
    
    function fundContract() external payable onlyOwner {
        require(state == ContractState.Created, "Contract not in correct state");
        require(msg.value == totalAmount, "Incorrect funding amount");
        
        state = ContractState.Funded;
        emit ContractFunded(msg.value);
    }
    
    function submitMilestone(uint256 milestoneIndex) external {
        require(msg.sender == freelancer, "Only freelancer can submit");
        require(state == ContractState.Funded || state == ContractState.InProgress, "Contract not active");
        require(milestoneIndex < milestones.length, "Invalid milestone");
        require(milestones[milestoneIndex].state == MilestoneState.Pending, "Milestone not pending");
        
        milestones[milestoneIndex].state = MilestoneState.Submitted;
        state = ContractState.InProgress;
        emit MilestoneSubmitted(milestoneIndex);
    }
    
    function approveMilestone(uint256 milestoneIndex) external nonReentrant onlyOwner {
        require(milestoneIndex < milestones.length, "Invalid milestone");
        require(milestones[milestoneIndex].state == MilestoneState.Submitted, "Milestone not submitted");
        
        milestones[milestoneIndex].state = MilestoneState.Approved;
        uint256 amount = milestones[milestoneIndex].amount;
        
        (bool success, ) = freelancer.call{value: amount}("");
        require(success, "Payment failed");
        
        amountReleased += amount;
        emit MilestoneApproved(milestoneIndex, amount);
        emit PaymentReleased(freelancer, amount);
        
        if (amountReleased == totalAmount) {
            state = ContractState.Completed;
            emit ContractCompleted();
        }
    }
    
    function rejectMilestone(uint256 milestoneIndex) external onlyOwner {
        require(milestoneIndex < milestones.length, "Invalid milestone");
        require(milestones[milestoneIndex].state == MilestoneState.Submitted, "Milestone not submitted");
        
        milestones[milestoneIndex].state = MilestoneState.Rejected;
    }
    
    function raiseDispute() external {
        require(msg.sender == client || msg.sender == freelancer, "Not a party to contract");
        require(state == ContractState.Funded || state == ContractState.InProgress, "Contract not active");
        
        state = ContractState.Disputed;
        emit DisputeRaised(msg.sender);
    }
    
    function cancelContract() external onlyOwner {
        require(state == ContractState.Created || state == ContractState.Funded, "Contract not cancellable");
        
        if (state == ContractState.Funded) {
            uint256 balance = address(this).balance;
            (bool success, ) = client.call{value: balance}("");
            require(success, "Refund failed");
        }
        
        state = ContractState.Cancelled;
    }
}