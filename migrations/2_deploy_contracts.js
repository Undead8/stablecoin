var StableCoin = artifacts.require("./StableCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(StableCoin, "Testtoken", "tkn");
};
