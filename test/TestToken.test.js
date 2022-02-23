let TestToken = artifacts.require('./TestToken.sol');

contract('TestToken', function(accounts) {
    let tokenInstance;

    it('initialize with correct values', function() {
        return TestToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'TestToken', 'should have the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'TST', 'should have correct symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'Test Finance v1.0', 'should have correct standard of token');
            return tokenInstance.decimals();
        }).then(function(decimals) {
            assert.equal(decimals, 18, 'should have correct decimals');
        })
    })
    
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