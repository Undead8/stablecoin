var Gicable = artifacts.require("Gicable");
var GicContract = artifacts.require("GicContract");


/*
module.exports = function(deployer) {
	deployer.deploy(GicContract, "USD Stable GIC", "USDS-GIC", "0x627306090abab3a6e1400e9345bc60c78a8bef57");
};
*/

/*
module.exports = function(deployer) {
	deployer.deploy(Gicable, "USD Stable", "USDS");
};
*/


module.exports = function(deployer) {
  deployer.deploy(Gicable, "USD Stable", "USDS").then(function() {
  	return deployer.deploy(GicContract, "USD Stable GIC", "USDS-GIC", Gicable.address);
  });
};

