pragma solidity ^0.4.24;


contract Ownable {
    address public owner;
    uint256 public ownerApprovalValue;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event newOwnerApprovalValue(uint256 value);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyOwnerAboveValue(uint256 value) {
        require(msg.sender == owner || value <= ownerApprovalValue);
        _;
    }

    function setOwnerApprovalValue(uint256 _value) public onlyOwner {
        ownerApprovalValue = _value;
        emit newOwnerApprovalValue(_value);
    }

    function transferContractOwnership(address _newOwner) public onlyOwner {
        _transferOwnership(_newOwner);
    }

    function _transferOwnership(address _newOwner) internal {
        require(_newOwner != address(0));
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}
