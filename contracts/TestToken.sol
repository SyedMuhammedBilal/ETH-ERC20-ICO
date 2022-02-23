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
    mapping (address => mapping (address => uint256)) public allowance;  

    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _standard,
        uint256 _totalSupply, 
        uint256 _decimals
    ) {
        name = _name;
        symbol = _symbol;
        standard = _standard;
        totalSupply = _totalSupply;
        decimals = _decimals;
        balanceOf[msg.sender] = _totalSupply;
    }

    /**
       * @param _to address The address which you want to transfer to
       * @param _value uint256 The amoung of token to be spent
    */
    function transfer(address _to, uint256 _value) public override returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Not enough balance");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
        * @param _spender address The address which will spend the funds
        * @param _value uint256 The amoung of token to be spent
    */
    function approve(address _spender, uint256 _value) public override returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
        * @param _from address The address which you want to send tokens from
        * @param _to address The address which you want to transfer to
        * @param _value uint256 The amount of tokens to be transferred
    */
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);   

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

}