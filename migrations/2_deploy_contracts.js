const TestToken = artifacts.require("TestToken");
const TestTokenCrowdSale = artifacts.require("TestTokenCrowdSale");

module.exports = function (deployer) {
  deployer.deploy(
    TestToken,
    "TestToken",
    "TST",
    "Test Finance v1.0",
    1000000000,
    18
  ).then(function() {
    let tokenPrice = 10000000000000000;
    return deployer.deploy(
      TestTokenCrowdSale,
      TestToken.address,
      tokenPrice
    )
  })
};

