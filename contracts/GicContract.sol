pragma solidity ^0.4.24;

import "./derived/Pausable.sol";
import "./derived/Authorizable.sol";


contract StableCoin {

    string public name;
    string public symbol;

    function payForGic(address, uint256, uint256) public pure returns (bool) {}

    function payForRedemption(address, uint256, uint256) public pure returns (bool) {}
}


contract GicContract is Pausable, Authorizable {
    StableCoin public currencyContract;

    struct GIC {
        uint256 faceValue;
        uint256 timeOfIssue;
        uint256 timeOfMaturity;
        uint256 interestRate;
    }

    string public name;
    string public symbol;
    uint8 public decimals = 2;

    mapping (address => uint256[]) public gicIdOf;

    uint256 internal currentGicId = 1;
    uint256[7] internal availableTerms;
    mapping (uint256 => address) internal holderOfGic;
    mapping (uint256 => GIC) internal gicStruct;
    mapping (uint256 => uint256) internal rateForTerm;

    constructor(string _tokenName, string _tokenSymbol, address _currencyContractAddress) public {
        name = _tokenName;
        symbol = _tokenSymbol;
        currencyContract = StableCoin(_currencyContractAddress);
    }

    function setCurrencyContract(address _currencyContractAddress) public onlyOwner returns (bool success) {
        currencyContract = StableCoin(_currencyContractAddress);
        return true;
    }

    function setTermsAndRates(uint256[7] _terms, uint256[7] _rates) public onlyAuthorized returns (bool success) {
        // First, clear rateForTerm mapping by using the current terms in availableTerms.
        // Then, iterate between the first and seconds array to craete the mapping (or dont do a mapping at all?)
    }

    function requestGic(uint256 _amount, uint256 _term) public whenNotPaused returns (bool success) {
        require(rateForTerm[_term] > 0, "This term is not available.");
        currencyContract.payForGic(msg.sender, _amount, _term);
        return true;
    }

    function issueGic(address _purchaser, uint256 _amount, uint256 _term) public whenNotPaused returns (bool success) {
        require(msg.sender == address(currencyContract), "Must be called by currencyContract.");
        gicStruct[currentGicId] = GIC(_amount, now, now + _term, rateForTerm[_term]); // now is not safe, must fix that issue!
        holderOfGic[currentGicId] = _purchaser;
        gicIdOf[_purchaser].push(currentGicId);
        currentGicId += 1;
        return true;
    }

    function redeemGic(uint256 _gicId) public whenNotPaused returns (bool success) {
        GIC memory redeemedGic = gicStruct[_gicId];

        require(msg.sender == holderOfGic[_gicId], "Msg.sender does not own this GIC.");
        require(redeemedGic.timeOfMaturity < now, "GIC has not reached maturity."); // now is not safe, must fix that issue!
        delete holderOfGic[_gicId];
        delete gicStruct[_gicId];
        uint256 interestsValue = 1; // CALCULATE INTERESTS VALUE HERE
        currencyContract.payForRedemption(msg.sender, redeemedGic.faceValue, interestsValue);
        return true;
    }
}
