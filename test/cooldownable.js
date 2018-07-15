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

  it("should return the cooldown value when in cooldown", async function () {
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

  it("should return the seconds left in coolddown when in cooldown", async function () {
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

  it("should return value at zero when cooldown is expired", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[3];
    let value = await Math.floor(Math.random() * 100000000) + 1;
    let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
    let cooldown = await Math.floor(Math.random() * 6000) + 60;

    await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
    await timeTravel(cooldown * 60 + 1);
    let valueInCooldown = await stable.valueInCooldown.call(receiver);

    assert.equal(valueInCooldown, 0, "The cooldown value of address is not 0")
  });

  it("should return seconds at zero when cooldown is expired", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[4];
    let value = await Math.floor(Math.random() * 100000000) + 1;
    let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
    let cooldown = await Math.floor(Math.random() * 6000) + 60;

    await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
    await timeTravel(cooldown * 60 + 1);
    let seconds = await stable.secondsLeftInCooldown.call(receiver).then(result => result.toNumber());

    assert.equal(seconds, 0, "The cooldown seconds left of address is not 0")
  });

  it("should throw if cooldown is set to more than 7200 minutes", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[5];
    let value = await Math.floor(Math.random() * 100000000) + 1;
    let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
    let cooldown = await Math.floor(Math.random() * 10000) + 7201;

    try {
      await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
    } catch (e) {
      return true;
    }
    throw new Error("It did not throw")
  });

  it("should have a cooldown value of zero when not set", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[6];
    let value = await Math.floor(Math.random() * 100000000) + 1;
    let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
    let cooldown = await Math.floor(Math.random() * 10000) + 7201;

    let valueInCooldown = await stable.valueInCooldown.call(receiver);

    assert.equal(valueInCooldown, 0, "The cooldown value of address is not 0")
  });

  it("should return zero seconds when not set", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[6];
    let value = await Math.floor(Math.random() * 100000000) + 1;
    let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
    let cooldown = await Math.floor(Math.random() * 10000) + 7201;

    let seconds = await stable.secondsLeftInCooldown.call(receiver).then(result => result.toNumber());

    assert.equal(seconds, 0, "The cooldown seconds left of address is not 0")
  });
});