pragma solidity ^0.4.24;

import './openzeppelin/Pausable.sol';
import "./Authorizable.sol";
import "./Cooldownable.sol";

contract StableCoin is Pausable, Authorizable, Cooldownable {
    string public name;
    string public symbol;
    uint8 public decimals = 2;
    uint256 public totalSupply;

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;
    mapping (uint256 => bool) internal depositMinted; // Maybe should be internal instead of public

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Redeem(address indexed from, uint256 value);

    constructor(string tokenName, string tokenSymbol) public {
        name = tokenName;
        symbol = tokenSymbol;
    }

    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != 0x0, "Cannot transfer to 0x0 address.");
        require(balanceOf[_from] >= _value, "Insufficient balance.");
        require(balanceOf[_to] + _value > balanceOf[_to], "Overflow.");
        require(balanceOf[_from] - _value >= valueInCooldown(_from), "You must wait for cooldown expiration before transfering value in cooldown.");
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

    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function redeem(uint256 _value) public whenNotPaused returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance.");
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Redeem(msg.sender, _value);
        return true;
    }

    function mintToken(address _to, uint256 _value, uint _depositNumber, uint256 _cooldownInMinutes) public onlyAuthorized whenNotPaused returns (bool success) {
        require(!depositMinted[_depositNumber], "Deposit has already been minted.");
        setCooldown(_to, _value, _cooldownInMinutes);
        balanceOf[_to] += _value;
        totalSupply += _value;
        depositMinted[_depositNumber] = true;
        emit Transfer(0, this, _value);
        emit Transfer(this, _to, _value);
        return true;
    }

    function destroyContract() public payable onlyOwner {
        selfdestruct(owner);
    }

    /**
     * Destroy tokens from other account
     *
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`.
     *
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    /* function burnFrom(address _from, uint256 _value) public returns (bool success) {
    require(balanceOf[_from] >= _value);                // Check if the targeted balance is enough
    require(_value <= allowance[_from][msg.sender]);    // Check allowance
    balanceOf[_from] -= _value;                         // Subtract from the targeted balance
    allowance[_from][msg.sender] -= _value;             // Subtract from the sender's allowance
    totalSupply -= _value;                              // Update totalSupply
    emit Burn(_from, _value);
    return true;
    }
    */
}
