// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


struct A {
    uint256 a;
    address b;
    string neki;
}

contract SimpleCounter {
    uint256 public counter;

    event N (
        address indexed add,
        A a
    );

    function setCounter(uint256 x, address token, uint256 amount, address target) public {
        counter = x;
        IERC20(token).transfer(target, amount);
    }
    
    function getCounter() public view returns (uint256) {
        return counter;
    }
}
