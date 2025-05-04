// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FreelanceContract.sol";

contract ContractFactory {
    address[] public deployedContracts;
    
    event ContractCreated(address contractAddress, address client, address freelancer);
    
    function createContract(
        address _freelancer,
        FreelanceContract.Milestone[] memory _milestones,
        uint256 _totalAmount
    ) external returns (address) {
        FreelanceContract newContract = new FreelanceContract(
            msg.sender,
            _freelancer,
            _milestones,
            _totalAmount
        );
        
        deployedContracts.push(address(newContract));
        emit ContractCreated(address(newContract), msg.sender, _freelancer);
        
        return address(newContract);
    }
    
    function getDeployedContracts() external view returns (address[] memory) {
        return deployedContracts;
    }
}