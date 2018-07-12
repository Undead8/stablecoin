pragma solidity ^0.4.24;

import "./Ownable.sol";


contract Pausable is Ownable {
    event Pause();
    event Unpause();

    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pauseContract() public onlyOwner whenNotPaused {
        paused = true;
        emit Pause();
    }

    function unpauseContract() public onlyOwner whenPaused {
        paused = false;
        emit Unpause();
    }
}
