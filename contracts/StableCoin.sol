pragma solidity ^0.4.24;

import './openzeppelin/Pausable.sol';
import "./Authorizable.sol";
import "./Cooldownable.sol";

contract StableCoin is Pausable, Authorizable, Cooldownable {
    string public name;
    string public symbol;
    uint8 public decimals = 2;
    uint256 public totalSupply;
    uint256 public minimumRedeemValue;

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;
    mapping (uint256 => bool) internal depositMinted; // Maybe should be internal instead of public
    mapping (address => bytes32) internal redeemDigest; // Maybe should be internal instead of public

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Redeem(address indexed from, uint256 value);
    event MinimumRedeemValue(uint256 _value);

    constructor(string tokenName, string tokenSymbol) public {
        name = tokenName;
        symbol = tokenSymbol;
    }

    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != 0x0, "Cannot transfer to 0x0 address.");
        require(balanceOf[_from] >= _value, "Insufficient balance.");
        require(balanceOf[_to] + _value > balanceOf[_to], "Overflow.");
        require(balanceOf[_from] - _value >= valueInCooldown(_from), "Cooldown must expire before transfering value in cooldown.");
        uint256 previousBalances = balanceOf[_from] + balanceOf[_to];
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns (bool success) {
        require(_value <= allowance[_from][msg.sender], "Insufficient allowance.");
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool success) { // Should cooldown stop approve^
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowRedeem(address _target, bytes32 _digest) public onlyAuthorized whenNotPaused returns (bool success) {
        redeemDigest[_target] = _digest;
        return true;
    }

    function setMinimumRedeemValue(uint256 _value) public onlyAuthorized whenNotPaused returns (bool success) {
        minimumRedeemValue = _value;
        emit MinimumRedeemValue(_value);
        return true;
    }

    function redeem(uint256 _value, bytes32 _password) public whenNotPaused returns (bool success) {
        require(redeemDigest[msg.sender].length > 0, "Redeem must be approved by an authorized address.");
        require(keccak256(_password) == redeemDigest[msg.sender], "Wrong password.");
        require(_value >= minimumRedeemValue, "Redeem value must be above minimum.");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance.");
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Redeem(msg.sender, _value);
        return true;
    }

    function mintToken(address _to, uint256 _value, uint256 _depositNumber, uint256 _cooldownInMinutes) public onlyAuthorized whenNotPaused returns (bool success) {
        require(!depositMinted[_depositNumber], "Deposit has already been minted.");
        require(_to != 0x0, "Cannot mint to 0x0 address.");
        require(balanceOf[_to] + _value > balanceOf[_to], "Overflow.");
        require(valueInCooldown(_to) == 0, "Cooldown must be expired.");
        setCooldown(_to, _value, _cooldownInMinutes);
        balanceOf[_to] += _value;
        totalSupply += _value;
        depositMinted[_depositNumber] = true;
        emit Transfer(0, this, _value);
        emit Transfer(this, _to, _value);
        return true;
    }

    function reverseMintage(address _from, uint256 _value, uint256 _depositNumber) public onlyAuthorized returns (bool success) {
        require(valueInCooldown(_from) >= _value, "Reverse value exceeds value in cooldown.");
        depositMinted[_depositNumber] = false;
        totalSupply -= _value;
        balanceOf[_from] -= _value;
        setCooldown(_from, 0, 0);
        emit Transfer(_from, this, _value);
        emit Transfer(this, 0, _value);
        return true;
    }

    function destroyContract() public payable onlyOwner whenPaused {
        selfdestruct(owner);
    }
}
