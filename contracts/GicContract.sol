pragma solidity ^0.4.24;

import "./derived/Pausable.sol";
import "./derived/Authorizable.sol";


contract GicableABI {

    function payForGic(address, uint256, uint256) public returns (bool) {}

    function payForRedemption(address, uint256, uint256) public returns (bool) {}
}


contract GicContract is Pausable, Authorizable {
    GicableABI public currencyContract;

    struct GIC {
        uint256 faceValue;
        uint256 timeOfIssue;
        uint256 timeOfMaturity;
        uint256 interestRate;
    }

    string public name;
    string public symbol;
    uint8 public decimals = 2;
    
    uint256[8] public availableTermsInDays;
    uint256[8] public ratesInBasisPoints;

    mapping (address => uint256[]) public gicIdOf;
    
    uint256 internal currentGicId = 1;
    mapping (uint256 => address) internal holderOfGic;
    mapping (uint256 => GIC) internal gicStruct;

    // I should add EVENTS here

    constructor(string _tokenName, string _tokenSymbol, address _currencyContractAddress) public {
        name = _tokenName;
        symbol = _tokenSymbol;
        currencyContract = GicableABI(_currencyContractAddress);
    }

    function setCurrencyContract(address _currencyContractAddress) public onlyOwner returns (bool success) {
        currencyContract = GicableABI(_currencyContractAddress);
        return true;
    }

    function setTermsAndRates(uint256[8] _terms, uint256[8] _rates) public onlyAuthorized returns (bool success) {
        availableTermsInDays = _terms;
        ratesInBasisPoints = _rates;
        return true;
    }

    // Requesting a GIC from the currencyContract directly would also work, but it would make the GIC issuance process less upgradable.
    function requestGic(uint256 _amount, uint256 _termIndex) public whenNotPaused returns (bool success) {
        currencyContract.payForGic(msg.sender, _amount, _termIndex);
        return true;
    }

    function issueGic(address _purchaser, uint256 _amount, uint256 _termIndex) public whenNotPaused returns (bool success) {
        require(address(currencyContract) == msg.sender || owner == msg.sender, "Must be called by currencyContract or owner.");

        gicStruct[currentGicId] = GIC(_amount, now, now + availableTermsInDays[_termIndex] * 1 days, ratesInBasisPoints[_termIndex]); // now is not safe, must fix that issue!
        holderOfGic[currentGicId] = _purchaser;
        gicIdOf[_purchaser].push(currentGicId);
        currentGicId += 1;
        return true;
    }

    function redeemGic(uint256 _gicId) public whenNotPaused returns (bool success) {
        GIC memory redeemedGic = gicStruct[_gicId];

        require(holderOfGic[_gicId] == msg.sender, "Msg.sender does not own this GIC.");
        require(redeemedGic.timeOfMaturity < now, "GIC has not reached maturity."); // now is not safe, must fix that issue!
        delete holderOfGic[_gicId];
        delete gicStruct[_gicId];
        uint256 interestsValue = 1; // CALCULATE INTERESTS VALUE HERE
        currencyContract.payForRedemption(msg.sender, redeemedGic.faceValue, interestsValue);
        return true;
    }

    function destroyContract() public payable onlyOwner whenPaused { selfdestruct(owner); }
}
