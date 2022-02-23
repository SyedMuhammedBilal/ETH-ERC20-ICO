const TestToken = artifacts.require("TestToken");

module.exports = function (deployer) {
  deployer.deploy(TestToken, "TestToken", "TST", "Test Finance v1.0", 1000000000, 18);
};
