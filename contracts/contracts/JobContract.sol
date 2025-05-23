// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract JobContract {
    enum Status { Created, ClientSigned, FreelancerSigned, WorkSubmitted, Completed, Disputed }

    struct Contract {
        address client;
        address freelancer;
        uint256 bidAmount;
        uint256 deadline;
        string jobTitle;
        string jobDescription;
        Status status;
        bool clientApproved;
        bool freelancerApproved;
        string workSubmissionHash;
        uint256 fundsDeposited;
    }

    Contract[] public contracts;
    address public owner;
    uint256 public disputeFee = 0.01 ether; // Fee for raising a dispute

    // Escrow balances tracking
    mapping(uint256 => uint256) public escrowBalances;

    event ContractCreated(uint256 contractId);
    event Signed(uint256 contractId, address signer);
    event FundsDeposited(uint256 contractId, uint256 amount);
    event WorkSubmitted(uint256 contractId, string workHash);
    event WorkApproved(uint256 contractId, address approver);
    event PaymentReleased(uint256 contractId, uint256 amount, address recipient);
    event RefundIssued(uint256 contractId, uint256 amount, address recipient);
    event ContractCompleted(uint256 contractId);
    event DisputeRaised(uint256 contractId, address raisedBy, uint256 fee);

    modifier onlyParties(uint256 _contractId) {
        require(
            msg.sender == contracts[_contractId].client || 
            msg.sender == contracts[_contractId].freelancer,
            "Not a party to this contract"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Allows owner to update dispute fee
    function setDisputeFee(uint256 _newFee) external onlyOwner {
        disputeFee = _newFee;
    }

    function createContract(
        address _freelancer,
        uint256 _bidAmount,
        uint256 _deadline,
        string memory _jobTitle,
        string memory _jobDescription
    ) external returns (uint256) {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_bidAmount > 0, "Bid amount must be positive");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        Contract memory newContract = Contract({
            client: msg.sender,
            freelancer: _freelancer,
            bidAmount: _bidAmount,
            deadline: _deadline,
            jobTitle: _jobTitle,
            jobDescription: _jobDescription,
            status: Status.Created,
            clientApproved: false,
            freelancerApproved: false,
            workSubmissionHash: "",
            fundsDeposited: 0
        });

        contracts.push(newContract);
        uint256 contractId = contracts.length - 1;
        emit ContractCreated(contractId);
        return contractId;
    }

    // Client deposits funds into escrow
    function depositFunds(uint256 _contractId) external payable {
        Contract storage contractItem = contracts[_contractId];
        require(msg.sender == contractItem.client, "Only client can deposit funds");
        require(msg.value == contractItem.bidAmount, "Must deposit exact bid amount");
        require(contractItem.fundsDeposited == 0, "Funds already deposited");
        
        contractItem.fundsDeposited = msg.value;
        escrowBalances[_contractId] = msg.value;
        emit FundsDeposited(_contractId, msg.value);
    }

    function signContract(uint256 _contractId) external onlyParties(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        
        if (msg.sender == contractItem.client) {
            require(contractItem.fundsDeposited > 0, "Client must deposit funds first");
            contractItem.clientApproved = true;
        } else {
            contractItem.freelancerApproved = true;
        }

        if (contractItem.clientApproved && contractItem.freelancerApproved) {
            contractItem.status = Status.FreelancerSigned;
        } else if (contractItem.clientApproved) {
            contractItem.status = Status.ClientSigned;
        }

        emit Signed(_contractId, msg.sender);
    }

    function submitWork(uint256 _contractId, string memory _workHash) external onlyParties(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(msg.sender == contractItem.freelancer, "Only freelancer can submit work");
        require(contractItem.status == Status.FreelancerSigned, "Contract not fully signed");
        require(bytes(_workHash).length > 0, "Work hash cannot be empty");

        contractItem.workSubmissionHash = _workHash;
        contractItem.status = Status.WorkSubmitted;
        emit WorkSubmitted(_contractId, _workHash);
    }

    function approveWork(uint256 _contractId) external onlyParties(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(msg.sender == contractItem.client, "Only client can approve work");
        require(contractItem.status == Status.WorkSubmitted, "Work not submitted");
        require(escrowBalances[_contractId] >= contractItem.bidAmount, "Insufficient escrow funds");

        uint256 amount = escrowBalances[_contractId];
        escrowBalances[_contractId] = 0;
        
        // Transfer funds to freelancer
        (bool success, ) = payable(contractItem.freelancer).call{value: amount}("");
        require(success, "Payment transfer failed");

        contractItem.status = Status.Completed;
        emit PaymentReleased(_contractId, amount, contractItem.freelancer);
        emit WorkApproved(_contractId, msg.sender);
        emit ContractCompleted(_contractId);
    }

    function raiseDispute(uint256 _contractId) external payable onlyParties(_contractId) {
        require(msg.value == disputeFee, "Incorrect dispute fee");
        
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status != Status.Completed, "Contract already completed");
        require(block.timestamp <= contractItem.deadline + 7 days, "Dispute period expired");

        contractItem.status = Status.Disputed;
        
        // Transfer dispute fee to owner
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Dispute fee transfer failed");

        emit DisputeRaised(_contractId, msg.sender, msg.value);
    }

    // Owner can resolve dispute by splitting funds
    function resolveDispute(
        uint256 _contractId,
        uint256 clientShare,
        uint256 freelancerShare
    ) external onlyOwner {
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status == Status.Disputed, "Contract not in dispute");
        require(
            clientShare + freelancerShare == escrowBalances[_contractId],
            "Shares must equal escrow balance"
        );

        uint256 escrowAmount = escrowBalances[_contractId];
        escrowBalances[_contractId] = 0;

        if (clientShare > 0) {
            (bool successClient, ) = payable(contractItem.client).call{value: clientShare}("");
            require(successClient, "Client refund failed");
        }

        if (freelancerShare > 0) {
            (bool successFreelancer, ) = payable(contractItem.freelancer).call{value: freelancerShare}("");
            require(successFreelancer, "Freelancer payment failed");
        }

        contractItem.status = Status.Completed;
        emit ContractCompleted(_contractId);
    }

    // Client can get refund if deadline passes without submission
    function requestRefund(uint256 _contractId) external onlyParties(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(msg.sender == contractItem.client, "Only client can request refund");
        require(contractItem.status != Status.Completed, "Contract already completed");
        require(block.timestamp > contractItem.deadline, "Deadline not passed");
        require(escrowBalances[_contractId] > 0, "No funds to refund");

        uint256 amount = escrowBalances[_contractId];
        escrowBalances[_contractId] = 0;
        
        (bool success, ) = payable(contractItem.client).call{value: amount}("");
        require(success, "Refund transfer failed");

        contractItem.status = Status.Completed;
        emit RefundIssued(_contractId, amount, contractItem.client);
        emit ContractCompleted(_contractId);
    }

    function getContract(uint256 _contractId) external view returns (
        address client,
        address freelancer,
        uint256 bidAmount,
        uint256 deadline,
        string memory jobTitle,
        string memory jobDescription,
        Status status,
        string memory workSubmissionHash,
        uint256 fundsDeposited
    ) {
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
            contractItem.fundsDeposited
        );
    }

    // Emergency withdrawal for owner (only if contract has stuck funds)
    function withdrawStuckFunds() external onlyOwner {
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}