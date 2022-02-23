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
            return tokenInstance.transfer.call(accounts[1], 25000, { from: accounts[0] })
        }).then(function(success) {
            assert.equal(success, true, 'it should return true');
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

    it('approves tokens for delegated transfer', function() {
        return TestToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 25000);
        }).then(function(success) {
            assert.equal(success, true, 'it should returns true');
            return tokenInstance.approve(accounts[1], 25000, { from: accounts[0] });
        }).then(function(transactionHash) {
            assert.equal(transactionHash.logs.length, 1, 'triggers one event');
            assert.equal(transactionHash.logs[0].event, 'Approval', 'should be the "Approval" event');
            assert.equal(transactionHash.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
            assert.equal(transactionHash.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(transactionHash.logs[0].args._value, 25000, 'logs the transfer amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 25000, 'stores the allowance for delegated transfer');
        })
    });

    it('handles delegated token transfers', function () {
        return TestToken.deployed().then(function(instance) {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
        }).then(function(transactionHash) {
            return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
        }).then(function(transactionHash) {
            return tokenInstance.transferFrom(fromAccount, toAccount, 200, { from: spendingAccount })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(success) {
          assert.equal(success, true);
          return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(receipt) {
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
          assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
          assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
          assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
          return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
          return tokenInstance.balanceOf(toAccount);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
          return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance) {
          assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
    })
});