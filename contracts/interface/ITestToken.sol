// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITestToken {
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function transfer(address _to, uint256 _value) external returns (bool);
}