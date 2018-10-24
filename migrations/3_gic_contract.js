var Gicable = artifacts.require("Gicable");
var GicContract = artifacts.require("GicContract");

module.exports = function(deployer) {
  deployer.deploy(Gicable, "USD Stable", "USDS").then(function() {
  	return deployer.deploy(GicContract, "USD Stable GIC", "USDS-GIC", Gicable.address);
  });
};
