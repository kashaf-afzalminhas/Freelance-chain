// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract UserRoles {

enum Role { None, Client, Freelancer }

mapping(address => Role) public roles;

event RoleSelected(address indexed user, Role role);

function selectRole(Role _role) external {

require(_role == Role.Client || _role == Role.Freelancer, "Invalid role");

roles[msg.sender] = _role;

emit RoleSelected(msg.sender, _role);

}

function getRole(address _user) external view returns (Role) {

return roles[_user];

}

}