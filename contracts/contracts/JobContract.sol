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
    }

    Contract[] public contracts;
    address public owner;

    event ContractCreated(uint256 contractId);
    event Signed(uint256 contractId, address signer);
    event WorkSubmitted(uint256 contractId, string workHash);
    event WorkApproved(uint256 contractId, address approver);
    event ContractCompleted(uint256 contractId);
    event DisputeRaised(uint256 contractId, address raisedBy);

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

    function createContract(
        address _freelancer,
        uint256 _bidAmount,
        uint256 _deadline,
        string memory _jobTitle,
        string memory _jobDescription
    ) external returns (uint256) {
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
            workSubmissionHash: ""
        });

        contracts.push(newContract);
        uint256 contractId = contracts.length - 1;
        emit ContractCreated(contractId);
        return contractId;
    }

    function signContract(uint256 _contractId) external onlyParties(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        
        if (msg.sender == contractItem.client) {
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

        contractItem.workSubmissionHash = _workHash;
        contractItem.status = Status.WorkSubmitted;
        emit WorkSubmitted(_contractId, _workHash);
    }

    function approveWork(uint256 _contractId) external onlyParties(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(msg.sender == contractItem.client, "Only client can approve work");
        require(contractItem.status == Status.WorkSubmitted, "Work not submitted");

        contractItem.status = Status.Completed;
        emit WorkApproved(_contractId, msg.sender);
        emit ContractCompleted(_contractId);
    }

    function raiseDispute(uint256 _contractId) external onlyParties(_contractId) {
        Contract storage contractItem = contracts[_contractId];
        require(contractItem.status != Status.Completed, "Contract already completed");

        contractItem.status = Status.Disputed;
        emit DisputeRaised(_contractId, msg.sender);
    }

    function getContract(uint256 _contractId) external view returns (
        address client,
        address freelancer,
        uint256 bidAmount,
        uint256 deadline,
        string memory jobTitle,
        string memory jobDescription,
        Status status,
        string memory workSubmissionHash
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
            contractItem.workSubmissionHash
        );
    }
}