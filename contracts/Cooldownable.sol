pragma solidity ^0.4.24;


contract Cooldownable {

    struct TokenInCooldown {
        uint256 cooldownExpiration;
        uint256 value;
    }

    mapping (address => TokenInCooldown) public cooldownOf;

    function valueInCooldown(address _target) internal view returns (uint256 value) {
        TokenInCooldown memory _tokenInCooldown = cooldownOf[_target];

        if (now <= _tokenInCooldown.cooldownExpiration) {
            return _tokenInCooldown.value;
        } else {
            return 0;
        }
    }

    function setCooldown(address _target, uint192 _value, uint256 _minutes) internal {
        cooldownOf[_target] = TokenInCooldown(_value, now + _minutes * 1 minutes);
    }
}
