pragma solidity ^0.4.24;

import "./Ownable.sol";


contract Cooldownable is Ownable {

    struct TokenInCooldown {
        uint256 cooldownExpiration;
        uint256 value;
    }

    uint256 public minimumCooldown;

    mapping (address => TokenInCooldown) internal cooldownOf;

    event newMinimumCooldown(uint256 minutes);

    function setMinimumCooldown(uint256 _minutes) public onlyOwner {
        minimumCooldown = _minutes;
        emit newMinimumCooldown(_minutes);
    }

    function valueInCooldown(address _target) public view returns (uint256 value) {
        uint256 expiration = cooldownOf[_target].cooldownExpiration;
        uint256 cooldownValue = cooldownOf[_target].value;

        if (now < expiration) {
            return cooldownValue;
        } else {
            return 0;
        }
    }

    function secondsLeftInCooldown(address _target) public view returns (uint256 time) {
        uint256 expiration = cooldownOf[_target].cooldownExpiration;

        if (now < expiration) {
            return expiration - now;
        } else {
            return 0;
        }
    }

    function overwriteCooldown(address _target, uint256 _value, uint256 _minutes) public onlyOwner {
        setCooldown(_target, _value, _minutes);
    }

    function setCooldown(address _target, uint256 _value, uint256 _minutes) internal {
        require(msg.sender == owner || _minutes >= minimumCooldown, "Cooldown is lower than minimum cooldown.");
        cooldownOf[_target] = TokenInCooldown(now + _minutes * 1 minutes, _value);
    }
}
