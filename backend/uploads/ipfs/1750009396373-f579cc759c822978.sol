// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract JobContract {
    enum Status { 
        Created,           // 0 - Contract just created
        ClientSigned,      // 1 - Client signed and deposited funds
        BothSigned,        // 2 - Both parties signed
        WorkSubmitted,     // 3 - Freelancer submitted work
        Completed,         // 4 - Work approved and payment released
        Disputed,          // 5 - Dispute raised
        Refunded          // 6 - Refunded to client
    }

    struct Contract {
        address client;
        address freelancer;
        uint256 bidAmount;
        uint256 deadline;
        string jobTitle;
        string jobDescription;
        Status status;
        bool clientSigned;
        bool freelancerSigned;
        string workSubmissionHash;
        bool fundsDeposited;
        uint256 createdAt;
    }

    address public admin;
    bool public adminInitialized;
    Contract[] public contracts;
    uint256 public immutable disputeFee = 0.1 ether; // 0.1 VANRY
    uint256 public immutable platformFeePercent = 5; // 5% platform fee

    mapping(uint256 => uint256) public escrowBalances;
    mapping(address => bool) public isAdmin;

    event ContractCreated(uint256 indexed contractId, address indexed client, address indexed freelancer);
    event ClientSigned(uint256 indexed contractId, uint256 amount);
    event FreelancerSigned(uint256 indexed contractId);
    event WorkSubmitted(uint256 indexed contractId, string workHash);
    event WorkApproved(uint256 indexed contractId);
    event WorkRejected(uint256 indexed contractId, string reason);
    event PaymentReleased(uint256 indexed contractId, uint256 freelancerAmount, uint256 platformFee);
    event RefundIssued(uint256 indexed contractId, uint256 amount);
    event DisputeRaised(uint256 indexed contractId, address raisedBy);
    event DisputeResolved(uint256 indexed contractId, uint256 clientAmount, uint256 freelancerAmount, address resolvedBy);
    event ContractCompleted(uint256 indexed contractId);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    modifier onlyParties(uint256 _contractId) {
        require(_contractId < contracts.length, "Contract does not exist");
        require(
            msg.sender == contracts[_contractId].client || 
            msg.sender == contracts[_contractId].freelancer,
            "Not a party to this contract"
        );
        _;
    }

    modifier onlyClient(uint256 _contractId) {
        require(_contractId < contracts.length, "Contract does not exist");
        require(msg.sender == contracts[_contractId].client, "Only client can call this");
        _;
    }

    modifier onlyFreelancer(uint256 _contractId) {
        require(_contractId < contracts.length, "Contract does not exist");
        require(msg.sender == contracts[_contractId].freelancer, "Only freelancer can call this");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
        adminInitialized = true;
    }

    function initializeAdmin(address _admin) external {
        require(!adminInitialized, "Admin already initialized");
        admin = _admin;
        adminInitialized = true;
    }

    function createContract(
        address _freelancer,
        uint256 _bidAmount,
        uint256 _deadline,
        string memory _jobTitle,
        string memory _jobDescription
    ) external returns (uint256) {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Client cannot be freelancer");
        require(_bidAmount > 0, "Bid amount must be positive");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(bytes(_jobTitle).length > 0, "Job title cannot be empty");

        Contract memory newContract = Contract({
            client: msg.sender,
            freelancer: _freelancer,
            bidAmount: _bidAmount,
            deadline: _deadline,
            jobTitle: _jobTitle,
            jobDescription: _jobDescription,
            status: Status.Created,
            clientSigned: false,
            freelancerSigned: false,
            workSubmissionHash: "",
            fundsDeposited: false,
            createdAt: block.timestamp
        });

        contracts.push(newContract);
        uint256 contractId = contracts.length - 1;
        
        emit ContractCreated(contractId, msg.sender, _freelancer);
        return contractId;
    }

    // Step 1: Client signs and deposits funds
    function clientSignAndDeposit(uint256 _contractId) external payable onlyClient(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status == Status.Created, "Contract not in Created status");
        require(!contractItem.clientSigned, "Client already signed");
        require(!contractItem.fundsDeposited, "Funds already deposited");
        require(msg.value == contractItem.bidAmount, "Incorrect amount sent");
        
        contractItem.clientSigned = true;
        contractItem.fundsDeposited = true;
        contractItem.status = Status.ClientSigned;
        escrowBalances[_contractId] = msg.value;

        emit ClientSigned(_contractId, msg.value);
    }

    // Step 2: Freelancer signs (after client has signed and deposited)
    function freelancerSign(uint256 _contractId) external onlyFreelancer(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status == Status.ClientSigned, "Client must sign and deposit first");
        require(contractItem.clientSigned, "Client must sign first");
        require(contractItem.fundsDeposited, "Funds must be deposited first");
        require(!contractItem.freelancerSigned, "Freelancer already signed");

        contractItem.freelancerSigned = true;
        contractItem.status = Status.BothSigned;

        emit FreelancerSigned(_contractId);
    }

    // Step 3: Freelancer submits work
    function submitWork(uint256 _contractId, string memory _workHash) external onlyFreelancer(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(
            contractItem.status == Status.BothSigned || 
            contractItem.status == Status.WorkSubmitted,
            "Contract must be in BothSigned or WorkSubmitted status"
        );
        require(bytes(_workHash).length > 0, "Work hash cannot be empty");

        contractItem.workSubmissionHash = _workHash;
        contractItem.status = Status.WorkSubmitted;
        
        emit WorkSubmitted(_contractId, _workHash);
    }

    // Step 4a: Client approves work
    function approveWork(uint256 _contractId) external onlyClient(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status == Status.WorkSubmitted, "Work not submitted");
        require(escrowBalances[_contractId] >= contractItem.bidAmount, "Insufficient escrow funds");

        uint256 totalAmount = escrowBalances[_contractId];
        uint256 platformFee = (totalAmount * platformFeePercent) / 100;
        uint256 freelancerAmount = totalAmount - platformFee;

        escrowBalances[_contractId] = 0;
        contractItem.status = Status.Completed;

        // Transfer payment to freelancer
        payable(contractItem.freelancer).transfer(freelancerAmount);
        
        // Transfer platform fee to owner
        if (platformFee > 0) {
            payable(msg.sender).transfer(platformFee);
        }

        emit WorkApproved(_contractId);
        emit PaymentReleased(_contractId, freelancerAmount, platformFee);
    }

    // Step 4b: Client rejects work (optional - for dispute flow)
    function rejectWork(uint256 _contractId, string memory _reason) external onlyClient(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status == Status.WorkSubmitted, "Work not submitted");
        require(bytes(_reason).length > 0, "Rejection reason required");

        contractItem.status = Status.Disputed;
        emit WorkRejected(_contractId, _reason);
    }

    // Dispute mechanism
    function raiseDispute(uint256 _contractId) external payable onlyParties(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(
            contractItem.status == Status.WorkSubmitted || 
            contractItem.status == Status.BothSigned,
            "Contract must be in active state"
        );
        require(msg.value == disputeFee, "Incorrect dispute fee");
        require(block.timestamp <= contractItem.deadline + 7 days, "Dispute period expired");

        contractItem.status = Status.Disputed;
        escrowBalances[_contractId] += msg.value; // Store dispute fee in escrow

        emit DisputeRaised(_contractId, msg.sender);
    }

    function resolveDispute(
        uint256 _contractId,
        uint256 clientShareBasisPoints,
        uint256 freelancerShareBasisPoints
    ) external onlyAdmin {
        require(clientShareBasisPoints + freelancerShareBasisPoints <= 10000, "Invalid shares distribution");
        
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status == Status.Disputed, "Contract not in dispute");
        require(contractItem.fundsDeposited, "No funds to distribute");
        
        uint256 totalAmount = escrowBalances[_contractId];
        uint256 platformFee = (contractItem.bidAmount * platformFeePercent) / 100;
        uint256 remainingAmount = totalAmount - platformFee;
        
        uint256 clientAmount = (remainingAmount * clientShareBasisPoints) / 10000;
        uint256 freelancerAmount = remainingAmount - clientAmount;
        
        // Reset escrow balance before transfers to prevent reentrancy
        escrowBalances[_contractId] = 0;
        contractItem.status = Status.Completed;
        
        // Transfer funds
        if (clientAmount > 0) {
            payable(contractItem.client).transfer(clientAmount);
        }
        if (freelancerAmount > 0) {
            payable(contractItem.freelancer).transfer(freelancerAmount);
        }
        if (platformFee > 0) {
            payable(admin).transfer(platformFee);
        }
        
        emit DisputeResolved(
            _contractId,
            clientAmount,
            freelancerAmount,
            msg.sender
        );
        emit ContractCompleted(_contractId);
    }

    // Refund mechanism (if deadline passed and no work submitted)
    function requestRefund(uint256 _contractId) external onlyClient(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status != Status.Completed, "Contract already completed");
        require(contractItem.status != Status.Disputed, "Contract in dispute");
        require(block.timestamp > contractItem.deadline, "Deadline not passed");
        require(contractItem.fundsDeposited, "No funds to refund");

        uint256 amount = escrowBalances[_contractId];
        escrowBalances[_contractId] = 0;
        
        payable(contractItem.client).transfer(amount);

        contractItem.status = Status.Completed;
        emit RefundIssued(_contractId, amount);
        emit ContractCompleted(_contractId);
    }

    // View functions
    function getContract(uint256 _contractId) external view returns (
        address client,
        address freelancer,
        uint256 bidAmount,
        uint256 deadline,
        string memory jobTitle,
        string memory jobDescription,
        Status status,
        string memory workSubmissionHash,
        bool fundsDeposited,
        bool clientSigned,
        bool freelancerSigned,
        uint256 createdAt
    ) {
        require(_contractId < contracts.length, "Contract does not exist");
        Contract memory contractItem = contracts[_contractId];
        return (
            contractItem.client,
            contractItem.freelancer,
            contractItem.bidAmount,
            contractItem.deadline,
            contractItem.jobTitle,
            contractItem.jobDescription,
            contractItem.status,
            contractItem.workSubmissionHash,
            contractItem.fundsDeposited,
            contractItem.clientSigned,
            contractItem.freelancerSigned,
            contractItem.createdAt
        );
    }

    function getContractCount() external view returns (uint256) {
        return contracts.length;
    }

    function getEscrowBalance(uint256 _contractId) external view returns (uint256) {
        require(_contractId < contracts.length, "Contract does not exist");
        return escrowBalances[_contractId];
    }

    // Emergency functions
    function withdrawStuckFunds() external {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Fallback function to receive ETH
    receive() external payable {}

    function addAdmin(address _admin) external {
        require(msg.sender == admin, "Only contract owner can add admins");
        isAdmin[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) external {
        require(msg.sender == admin, "Only contract owner can remove admins");
        isAdmin[_admin] = false;
        emit AdminRemoved(_admin);
    }

    // Add new function for admin to force refund if no dispute resolution
    function adminForceRefund(uint256 _contractId) external onlyAdmin {
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status == Status.Disputed, "Contract not in dispute");
        require(contractItem.fundsDeposited, "No funds to refund");

        uint256 amount = escrowBalances[_contractId];
        escrowBalances[_contractId] = 0;
        
        payable(contractItem.client).transfer(amount);

        contractItem.status = Status.Refunded;
        emit RefundIssued(_contractId, amount);
        emit ContractCompleted(_contractId);
    }
}