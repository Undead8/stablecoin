pragma solidity ^0.4.24;


contract Cooldownable {

    struct TokenInCooldown {
        uint256 cooldownExpiration;
        uint256 value;
    }

    mapping (address => TokenInCooldown) public cooldownOf; // Should we show valueInCooldown instead?

    function valueInCooldown(address _target) internal view returns (uint256 value) {
        TokenInCooldown memory _tokenInCooldown = cooldownOf[_target];

        if (now <= _tokenInCooldown.cooldownExpiration) {
            return _tokenInCooldown.value;
        } else {
            return 0;
        }
    }

    function setCooldown(address _target, uint256 _value, uint256 _minutes) internal {
        require(_minutes <= 7200, "Max cooldown is 7200 minutes");
        cooldownOf[_target] = TokenInCooldown(_value, now + _minutes * 1 minutes);
    }
}
