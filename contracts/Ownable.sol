pragma solidity ^0.4.24;


contract Ownable {
    address public owner;
    uint256 public ownerApprovalThreshold;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event newOwnerApprovalThreshold(uint256 threshold);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyOwnerAboveThreshold(uint256 value) {
        require(msg.sender == owner || value <= ownerApprovalThreshold);
        _;
    }

    function setOwnerApprovalThreshold(uint256 _threshold) public onlyOwner {
        ownerApprovalThreshold = _threshold;
        emit newOwnerApprovalThreshold(_threshold);
    }

    function transferContractOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0));
        owner = _newOwner;
        emit OwnershipTransferred(owner, _newOwner);
    }
}
