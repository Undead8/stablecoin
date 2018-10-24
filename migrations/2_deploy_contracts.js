var StableCoin = artifacts.require("StableCoin");

module.exports = function(deployer) {
  deployer.deploy(StableCoin, "CAD Stable", "CADS");
};
