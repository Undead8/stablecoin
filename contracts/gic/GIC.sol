pragma solidity ^0.4.24;

import "../stablecoin/Pausable.sol";
import "../stablecoin/Authorizable.sol";


contract GIC is Pausable, Authorizable {
    address public currencyContractAddress;

    mapping (uint256 => uint256) public currentRates;

// Constructor should get the token name and token symbol from currencyContract
    constructor(address _currencyContract) {
        currencyContract = _currencyContract;

    }

}
