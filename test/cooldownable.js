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
    let value = await Math.floor(Math.random() * 100000000) + 1;
    let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
    let cooldown = await Math.floor(Math.random() * 6000) + 60;

    await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});

    let valueInCooldown = await stable.valueInCooldown.call(receiver);

    assert.equal(valueInCooldown, value, "The cooldown value of address is returned incorrectly")
  });

  it("should return the seconds left in cooldown of address", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[2];
    let value = await Math.floor(Math.random() * 100000000) + 1;
    let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
    let cooldown = await Math.floor(Math.random() * 6000) + 60;

    await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});

    let seconds = await stable.secondsLeftInCooldown.call(receiver).then(result => result.toNumber());

    assert.isAbove(seconds, 0, "Seconds left are not above 0") ||
    assert.isAtMost(seconds, cooldown * 60, "Seconds left are higher than cooldown")
  });

});
