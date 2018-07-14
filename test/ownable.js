const StableCoin = artifacts.require("./StableCoin.sol");

contract("Ownable", function(accounts) {

  it("should have creater as original owner", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let owner = await stable.owner();
    assert.equal(owner, sender, "Owner is not creator")
  });

  it("should transfer ownership", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[1];

    await stable.transferContractOwnership(receiver, {from: sender});

    let newOwner = await stable.owner();

    assert.equal(newOwner, receiver, "Not the right new owner")
  });

  it("should throw if transfer ownership is not sent by owner", async function () {
    let stable = await StableCoin.deployed();
    let previousOwner = await stable.owner();
    let sender = await accounts[5];
    let receiver = await accounts[1];

    try {
      await stable.transferContractOwnership(receiver, {from: sender});
    } catch (e) {
      return true;
    }
    throw new Error("Owner changed")
  });

});
