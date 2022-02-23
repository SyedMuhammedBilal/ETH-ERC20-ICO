// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interface/ITestToken.sol";

contract TestToken is ITestToken {
    string public name;
    string public symbol;
    string public standard;
    uint256 public totalSupply;
    uint256 public decimals;

    mapping (address => uint256) public balanceOf;    

    constructor(string memory _name, string memory _symbol, string memory _standard, uint256 _totalSupply, uint256 _decimals) {
        name = _name;
        symbol = _symbol;
        standard = _standard;
        totalSupply = _totalSupply;
        decimals = _decimals;
        balanceOf[msg.sender] = _totalSupply;
    }

    function transfer(address _to, uint256 _value) public override returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Not enough balance");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}