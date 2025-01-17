pragma solidity ^0.4.24;

import "./derived/StableCoin.sol";


contract GicContractABI {

    function issueGic(address, uint256, uint256) public returns (bool) {}
}


contract Gicable is StableCoin {

    // Many GIC contracts may be linked to a single Gicable contract.
    mapping (address => bool) internal gicContractAddresses;

    constructor(string _tokenName, string _tokenSymbol) StableCoin(_tokenName, _tokenSymbol) public {}

    function approveGicContractAddress(address _gicContractAddress, bool _approved) public onlyOwner returns (bool success) {
        gicContractAddresses[_gicContractAddress] = _approved;
        return true;
    }

    function payForGic(address _purchaser, uint256 _amount, uint256 _termIndex) public returns (bool success) {
        require(gicContractAddresses[msg.sender] == true, "Must be called by gicContract.");
        // Uncomment the following to require approved addresses only. 
        /* 
        require(
            redeemDigest[_purchaser].length > 0,
            "Purchase must be approved by an authorized address."
        ); 
        */
        _transfer(_purchaser, msg.sender, _amount);
        GicContractABI gicContract = GicContractABI(msg.sender);
        gicContract.issueGic(_purchaser, _amount, _termIndex);
        return true;      
    }

    function payForRedemption(address _redeemer, uint256 _faceValue, uint256 _interestsValue) public returns (bool success) {
        require(balanceOf[msg.sender] >= _faceValue, "Insufficient balance.");
        require(balanceOf[_redeemer] + _faceValue + _interestsValue > balanceOf[_redeemer], "Overflow.");
        // Uncomment the following to require approved addresses only. 
        /* 
        require(
            redeemDigest[_redeemer].length > 0,
            "Redemption must be approved by an authorized address."
        ); 
        */
        balanceOf[msg.sender] -= _faceValue;
        uint256 totalValue = _faceValue + _interestsValue;
        balanceOf[_redeemer] += totalValue;
        totalSupply += _interestsValue;
        return true;
    }
}
