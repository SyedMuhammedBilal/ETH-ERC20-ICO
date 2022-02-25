// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TestToken.sol";
import "./interface/ITestTokenCrowdSale.sol";

contract TestTokenCrowdSale is ITestTokenCrowdSale {

    address admin;
    uint256 public tokenPrice;
    uint256 public tokenSold;
    TestToken public tokenContract;

    constructor(TestToken _tokenContract, uint256 _tokenPrice) {
        admin = payable(address(this));
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == _numberOfTokens * tokenPrice);
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokenSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }   

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        selfdestruct(payable(admin));
    }   
}