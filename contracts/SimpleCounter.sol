// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;



contract SimpleCounter {
    uint256 public counter;


    function setCounter(uint256 x) public {
        counter = x;
    }
    
    function getCounter() public view returns (uint256) {
        return counter;
    }
}
