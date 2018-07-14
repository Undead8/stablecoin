const StableCoin = artifacts.require("./StableCoin.sol");

contract("Pausable", function(accounts) {

  it("should be unpaused at creation", async function () {
    let stable = await StableCoin.deployed();
    let pausedStatus = await stable.paused.call()

    assert.isFalse(pausedStatus, "The contract was not unpaused")
  });

  it("should pause and unpause", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];

    await stable.pauseContract({from: sender});

    let pausedStatusBefore = await stable.paused.call()

    await stable.unpauseContract({from: sender});

    let pausedStatusAfter = await stable.paused.call()

    assert.isTrue(pausedStatusBefore, "The contract was not paused") &&
    assert.isFalse(pausedStatusAfter, "The contract was not unpaused")
  });

  contract("When Unpaused", function(accounts) {

    it("should throw if pauseContract is not sent by owner", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[5];

      try {
        await stable.pauseContract({from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("pauseContract worked")
    });

    it("should throw if unpauseContract is already unpaused", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[0];

      try {
        await stable.unpauseContract({from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("unpauseContract worked")
    });
  });

  contract("When Paused", function(accounts) {

    it("should throw if unpauseContract is not sent by owner", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[5];
      let owner = await accounts[0]

      await stable.pauseContract({from: owner});

      try {
        await stable.unpauseContract({from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("unpauseContract worked")
    });

    it("should throw if pauseContract is already paused", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[0];

      try {
        await stable.pauseContract({from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("pauseContract worked")
    });
  })
});
