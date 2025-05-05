// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelancePlatform {
    // Structs
    struct Proposal {
        uint256 id;
        address freelancer;
        address client;
        string description;
        uint256 bidAmount;
        uint256 duration; // in days
        ProposalStatus status;
    }

    struct Contract {
        uint256 id;
        uint256 proposalId;
        address freelancer;
        address client;
        uint256 amount;
        uint256 deadline;
        ContractStatus status;
        string deliverables;
        bool workSubmitted;
        bool clientApproved;
    }

    struct Review {
        address reviewer;
        address reviewee;
        uint256 rating;
        string comment;
        uint256 timestamp;
    }

    // Enums
    enum ProposalStatus { Pending, Accepted, Rejected, Negotiating }
    enum ContractStatus { Created, Funded, InProgress, Completed, Disputed }

    // State Variables
    uint256 public nextProposalId = 1;
    uint256 public nextContractId = 1;
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Contract) public contracts;
    mapping(address => uint256[]) public clientProposals;
    mapping(address => uint256[]) public freelancerProposals;
    mapping(address => uint256[]) public clientContracts;
    mapping(address => uint256[]) public freelancerContracts;
    mapping(address => Review[]) public reviews;
    mapping(address => uint256) public reputation; // Simple reputation score

    // Events
    event ProposalSubmitted(uint256 indexed proposalId, address indexed freelancer, address indexed client);
    event ProposalStatusChanged(uint256 indexed proposalId, ProposalStatus status);
    event ContractCreated(uint256 indexed contractId, uint256 indexed proposalId);
    event EscrowFunded(uint256 indexed contractId, uint256 amount);
    event WorkSubmitted(uint256 indexed contractId, string deliverables);
    event WorkApproved(uint256 indexed contractId);
    event RevisionRequested(uint256 indexed contractId);
    event PaymentReleased(uint256 indexed contractId, uint256 amount);
    event ReviewAdded(address indexed reviewee, address indexed reviewer, uint256 rating);

    // Modifiers
    modifier onlyClient(uint256 proposalId) {
        require(msg.sender == proposals[proposalId].client, "Only client can perform this action");
        _;
    }

    modifier onlyFreelancer(uint256 proposalId) {
        require(msg.sender == proposals[proposalId].freelancer, "Only freelancer can perform this action");
        _;
    }

    modifier onlyContractClient(uint256 contractId) {
        require(msg.sender == contracts[contractId].client, "Only contract client can perform this action");
        _;
    }

    modifier onlyContractFreelancer(uint256 contractId) {
        require(msg.sender == contracts[contractId].freelancer, "Only contract freelancer can perform this action");
        _;
    }

    modifier proposalExists(uint256 proposalId) {
        require(proposalId > 0 && proposalId < nextProposalId, "Proposal does not exist");
        _;
    }

    modifier contractExists(uint256 contractId) {
        require(contractId > 0 && contractId < nextContractId, "Contract does not exist");
        _;
    }

    // Functions

    // Submit a new proposal
    function submitProposal(
        address client,
        string memory description,
        uint256 bidAmount,
        uint256 duration
    ) external {
        require(client != address(0), "Invalid client address");
        require(client != msg.sender, "Cannot submit proposal to yourself");
        require(bidAmount > 0, "Bid amount must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");

        uint256 proposalId = nextProposalId++;
        proposals[proposalId] = Proposal({
            id: proposalId,
            freelancer: msg.sender,
            client: client,
            description: description,
            bidAmount: bidAmount,
            duration: duration,
            status: ProposalStatus.Pending
        });

        clientProposals[client].push(proposalId);
        freelancerProposals[msg.sender].push(proposalId);

        emit ProposalSubmitted(proposalId, msg.sender, client);
    }

    // Client accepts, rejects, or negotiates a proposal
    function respondToProposal(
        uint256 proposalId,
        ProposalStatus status
    ) external onlyClient(proposalId) proposalExists(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Pending, "Proposal already responded to");

        proposal.status = status;

        if (status == ProposalStatus.Accepted) {
            // Create a new contract when proposal is accepted
            createContract(proposalId);
        }

        emit ProposalStatusChanged(proposalId, status);
    }

    // Create a new contract from an accepted proposal
    function createContract(uint256 proposalId) internal {
        Proposal memory proposal = proposals[proposalId];
        
        uint256 contractId = nextContractId++;
        contracts[contractId] = Contract({
            id: contractId,
            proposalId: proposalId,
            freelancer: proposal.freelancer,
            client: proposal.client,
            amount: proposal.bidAmount,
            deadline: block.timestamp + (proposal.duration * 1 days),
            status: ContractStatus.Created,
            deliverables: "",
            workSubmitted: false,
            clientApproved: false
        });

        clientContracts[proposal.client].push(contractId);
        freelancerContracts[proposal.freelancer].push(contractId);

        emit ContractCreated(contractId, proposalId);
    }

    // Client funds the escrow
    function fundEscrow(uint256 contractId) external payable contractExists(contractId) onlyContractClient(contractId) {
        Contract storage contractData = contracts[contractId];
        require(contractData.status == ContractStatus.Created, "Contract must be in Created state");
        require(msg.value == contractData.amount, "Amount must match contract value");

        contractData.status = ContractStatus.Funded;

        emit EscrowFunded(contractId, msg.value);
    }

    // Freelancer submits work
    function submitWork(uint256 contractId, string memory deliverables) 
        external 
        contractExists(contractId) 
        onlyContractFreelancer(contractId) 
    {
        Contract storage contractData = contracts[contractId];
        require(contractData.status == ContractStatus.Funded, "Contract must be funded first");
        require(bytes(deliverables).length > 0, "Deliverables cannot be empty");

        contractData.deliverables = deliverables;
        contractData.workSubmitted = true;
        contractData.status = ContractStatus.InProgress;

        emit WorkSubmitted(contractId, deliverables);
    }

    // Client approves work
    function approveWork(uint256 contractId) 
        external 
        contractExists(contractId) 
        onlyContractClient(contractId) 
    {
        Contract storage contractData = contracts[contractId];
        require(contractData.workSubmitted, "Work must be submitted first");
        require(!contractData.clientApproved, "Work already approved");

        contractData.clientApproved = true;
        contractData.status = ContractStatus.Completed;

        // Release payment to freelancer
        releasePayment(contractId);

        emit WorkApproved(contractId);
    }

    // Client requests revision
    function requestRevision(uint256 contractId) 
        external 
        contractExists(contractId) 
        onlyContractClient(contractId) 
    {
        Contract storage contractData = contracts[contractId];
        require(contractData.workSubmitted, "Work must be submitted first");
        require(!contractData.clientApproved, "Work already approved");

        contractData.workSubmitted = false;

        emit RevisionRequested(contractId);
    }

    // Release payment to freelancer
    function releasePayment(uint256 contractId) internal {
        Contract storage contractData = contracts[contractId];
        require(contractData.clientApproved, "Work must be approved first");
        require(address(this).balance >= contractData.amount, "Insufficient contract balance");

        payable(contractData.freelancer).transfer(contractData.amount);

        emit PaymentReleased(contractId, contractData.amount);
    }

    // Leave a review
    function leaveReview(
        address reviewee,
        uint256 rating,
        string memory comment
    ) external {
        require(reviewee != address(0), "Invalid reviewee address");
        require(reviewee != msg.sender, "Cannot review yourself");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        reviews[reviewee].push(Review({
            reviewer: msg.sender,
            reviewee: reviewee,
            rating: rating,
            comment: comment,
            timestamp: block.timestamp
        }));

        // Update reputation (simple average)
        uint256 totalRating = 0;
        uint256 reviewCount = reviews[reviewee].length;
        
        for (uint256 i = 0; i < reviewCount; i++) {
            totalRating += reviews[reviewee][i].rating;
        }
        
        reputation[reviewee] = totalRating / reviewCount;

        emit ReviewAdded(reviewee, msg.sender, rating);
    }

    // Helper functions to get proposals and contracts
    function getClientProposals(address client) external view returns (uint256[] memory) {
        return clientProposals[client];
    }

    function getFreelancerProposals(address freelancer) external view returns (uint256[] memory) {
        return freelancerProposals[freelancer];
    }

    function getClientContracts(address client) external view returns (uint256[] memory) {
        return clientContracts[client];
    }

    function getFreelancerContracts(address freelancer) external view returns (uint256[] memory) {
        return freelancerContracts[freelancer];
    }

    function getReviews(address user) external view returns (Review[] memory) {
        return reviews[user];
    }

    function getUserReputation(address user) external view returns (uint256) {
        return reputation[user];
    }
}