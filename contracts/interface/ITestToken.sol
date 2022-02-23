// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITestToken {
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function transfer(address _to, uint256 _value) external returns (bool);
    function approve(address _spender, uint256 _value) external returns (bool);
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);

}