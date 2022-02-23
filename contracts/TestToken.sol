// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestToken {
    string public name;
    string public symbol;
    string public standard;
    uint256 public totalSupply;

    mapping (address => uint256) public balanceOf;    

    constructor(string memory _name, string memory _symbol, string memory _standard, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        standard = _standard;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
    }

}