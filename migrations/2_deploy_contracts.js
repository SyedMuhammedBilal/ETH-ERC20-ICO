const TestToken = artifacts.require("TestToken");

module.exports = function (deployer) {
  deployer.deploy(TestToken, "TestToken", "TST", "Test Finance", 1000000000);
};
