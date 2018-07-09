pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Authorizable is Ownable {

    mapping(address => bool) public authorized;

    modifier onlyAuthorized() {
        require(authorized[msg.sender] || owner == msg.sender);
        _;
    }

    function addAuthorizedAddress(address toAdd) onlyOwner public {
        require(toAdd != 0);
        authorized[toAdd] = true;
    }

    function removeAuthorizedAddress(address toRemove) onlyOwner public {
        require(toRemove != 0);
        require(toRemove != msg.sender);
        authorized[toRemove] = false;
    }

}
