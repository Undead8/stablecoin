pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Authorizable is Ownable {

    mapping(address => bool) public authorized;

    event Authorize(address indexed _to, bool indexed _authorized);

    modifier onlyAuthorized() {
        require(authorized[msg.sender] || owner == msg.sender, "Must be authorized.");
        _;
    }

    function addAuthorizedAddress(address _toAdd) onlyOwner public returns (bool success) {
        require(_toAdd != 0);
        authorized[_toAdd] = true;
        emit Authorize(_toAdd, true);
        return true;
    }

    function removeAuthorizedAddress(address _toRemove) onlyOwner public returns (bool success) {
        require(_toRemove != 0);
        require(_toRemove != msg.sender);
        authorized[_toRemove] = false;
        emit Authorize(_toRemove, false);
        return true;
    }
}
