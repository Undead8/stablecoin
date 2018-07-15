const StableCoin = artifacts.require("./StableCoin.sol");

const timeTravel = function (time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time], // 86400 is num seconds in day
      id: new Date().getTime()
    }, (err, result) => {
      if(err){ return reject(err) }
        return resolve(result)
    });
  })
}

contract("Cooldownable", function(accounts) {

  it("should return the cooldown value of address", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[1];
    let value = await 100000;
    let depositNumber = await 1234567890;
    let cooldown = await 60;

    await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
    // await timeTravel(50)

    let valueInCooldown = await stable.valueInCooldown.call(receiver);

    assert.equal(valueInCooldown - 1, 0, "The cooldown value of address is returned correctly")
  });
});

// THIS TEST DOES NOT WORK
