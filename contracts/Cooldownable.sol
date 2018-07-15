pragma solidity ^0.4.24;


contract Cooldownable {

    struct TokenInCooldown {
        uint256 cooldownExpiration;
        uint256 value;
    }

    mapping (address => TokenInCooldown) internal cooldownOf;

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

    function setCooldown(address _target, uint256 _value, uint256 _minutes) internal {
        require(_minutes <= 7200, "Max cooldown is 7200 minutes");
        cooldownOf[_target] = TokenInCooldown(now + _minutes * 1 minutes, _value);
    }
}
