pragma solidity ^0.4.24;


contract Cooldownable {

    struct TokenInCooldown {
        uint256 cooldownExpiration;
        uint256 value;
    }

    mapping (address => TokenInCooldown) internal cooldownOf;

    function valueInCooldown(address _target) public view returns (uint256 value) {
        if (now <= cooldownOf[_target].cooldownExpiration) {
            return cooldownOf[_target].value;
        } else {
            return 0;
        }

    }

    function timeLeftInCooldown(address _target) public view returns (uint256 time) {
        if (now <= cooldownOf[_target].cooldownExpiration) {
            return cooldownOf[_target].cooldownExpiration - now;
        } else {
            return 0;
        }
    }

    function setCooldown(address _target, uint256 _value, uint256 _minutes) internal {
        require(_minutes <= 7200, "Max cooldown is 7200 minutes");
        cooldownOf[_target] = TokenInCooldown(now + _minutes * 1 minutes, _value);
    }
}
