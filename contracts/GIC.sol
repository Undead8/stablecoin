pragma solidity ^0.4.24;

import "./shared/Pausable.sol";
import "./shared/Authorizable.sol";


contract GIC is Pausable, Authorizable {
    address public currencyContract;

    mapping (uint256 => uint256) public currentRates;

// Constructor should get the token name and token symbol from currencyContract
    constructor(address _currencyContract) {
        currencyContract = _currencyContract;

    }

}
