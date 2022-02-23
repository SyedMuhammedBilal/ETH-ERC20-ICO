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
    });
    
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
    });

    it('transfers token ownership', function() {
        return TestToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 9999999999999)
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer(accounts[1], 25000, { from: accounts[0] });
        }).then(function(transactionHash) {
            assert.equal(transactionHash.logs.length, 1, 'triggers one event');
            assert.equal(transactionHash.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(transactionHash.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(transactionHash.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(transactionHash.logs[0].args._value, 25000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 25000, 'adds number of token to receiver address');
        })
    });
});