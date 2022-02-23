let TestToken = artifacts.require('./TestToken.sol');

contract('TestToken', function(accounts) {
    let tokenInstance;
    
    it('sets the values upon deployment', function() {
        return TestToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000000, 'sets the total supply to 01 Billion');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 1000000000, 'sets inital supply to admin account')
        })
    })
})