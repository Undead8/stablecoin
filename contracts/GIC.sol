pragma solidity ^0.4.24;

import "./shared/Pausable.sol";
import "./shared/Authorizable.sol";


contract StableCoin {
    function payForGic(address _purchaser, uint256 _amount, uint256 _term) public returns (bool success) {}

    function payForRedemption(address _redeemer, uint256 _faceValue, uint256 _interestsValue) public returns (bool success) {}
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
    uint256 internal currentGicId = 1;

    mapping (address => uint256[]) public gicIdOf;
    mapping (uint256 => address) internal holderOfGic;
    mapping (uint256 => GIC) internal gicStruct;
    mapping (uint256 => uint256) internal rateForTerm;

    constructor(address _currencyContractAddress) {
        currencyContract = StableCoin(_currencyContractAddress);
        name = currencyContract.name() + " GIC";
        symbol = currencyContract.symbol + "GIC";
    }

    function setCurrencyContract(address _currencyContractAddress) public onlyOwner returns (bool success) {
        currencyContract = StableCoin(_currencyContractAddress);
    }

    function requestGic(uint256 _amount, uint256 _term) public returns (bool success) {
        // require that _term be one of the provided terms
        currencyContract.payForGic(msg.sender, _amount, _term);
        return true;
    }

    function issueGic(address _purchaser, uint256 _amount, uint256 _term) public returns (bool success) {
        require(msg.sender == address(currencyContract), "Must be called by currencyContract.");
        gicStruct[currentGicId] = GIC(_amount, now, now + _term, rateForTerm[_term]); // now is not safe, must fix that issue!
        holderOfGic[currentGicId] = _purchaser;
        gicIdOf[_purchaser].push(currentGicId);
        currentGicId += 1;
        return true;
    }

    function redeemGic(uint256 _gicId) public returns (bool success) {
        GIC memory redeemedGic = gicStruct[_gicId];

        require(msg.sender == holderOfGic[_gicId], "Msg.sender does not own this GIC.");
        require(redeemedGic.timeOfMaturity < now, "GIC has not reached maturity."); // now is not safe, must fix that issue!
        holderOfGic[_gicId] = 0;
        gicStruct[_gicId] = 0;
        uint256 interestsValue = 1; // CALCULATE INTERESTS VALUE HERE
        currencyContract.payForRedemption(msg.sender, redeemedGic.faceValue, interestsValue);
        return true;
    }
}


/*

GIC – variables
mapping(address => GICstruct[]) --- Mapper tous les GIC d’une addresse dans un array.
 
--- Sinon, le mapiing peut référer à uint256, qui se trouve à être l’ID du GIC. L’ID du GIC est un key dd’un autre mapping qui a comme value le GIC struct associé.
 
GIC - requestGIC(term, value)
Cette fonction call le stablecoin contract et transmet comme paramètre (purchaser, value, term)
 
Stablecoin - payGIC(purchaser, value, term)
Cette fonction burn les tokens et call GIC si succès. Transmet comme paramètre (purchaser, value, term).
 
Stablecoin – setGICContract(address)
Only by owner. Changes the variable GICContract.
 
GIC - issueGIC(purchaser, value, term)
Crée le GIC struct et l'assigne au purchaser. Peut être callé par le contrat stablecoin OU owner en cas d'urgence.
 
GIC - destroyGIC(GICid)
Peut détruire le GIC en cas d'urgence. onlyAuthorized
Ne pas oublier de le retirer dans le mapping.
 
GIC - gicStruct
maturityDate, interestRate, holder, faceValue
 
GIC – setCurrencyContract(address)
Only by owner. Changes the variable currencyContract.
 
GIC – redeemGIC(GICId)
Using safemath, calculate the face value + interests.
Détruire le GIC.
Call stablecoin et transmet comme parametre (holder, redeemAmount)
Ne pas oublier de le retirer dans le mapping.
 
Stablecoin - ??
Fonction pour minter les token pour redeemAmount
*/
