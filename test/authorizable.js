const StableCoin = artifacts.require("./StableCoin.sol");

contract("Authorizable", function(accounts) {

  it("should authorize and remove addresses", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let receiver = await accounts[1];

    await stable.addAuthorizedAddress(receiver, {from: sender});

    let authorizedStatusBefore = await stable.authorized.call(receiver)

    await stable.removeAuthorizedAddress(receiver, {from: sender});

    let authorizedStatusAfter = await stable.authorized.call(receiver)

    assert.isTrue(authorizedStatusBefore, "The address was not authorized") &&
    assert.isFalse(authorizedStatusAfter, "The address was not removed")
  });

  it("should throw if addAuthorizedAddress is not sent by owner", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[5];
    let receiver = await accounts[1];

    try {
      await stable.addAuthorizedAddress(receiver, {from: sender});
    } catch (e) {
      return true;
    }
    throw new Error("addAuthorizedAddress worked")
  });

  it("should throw if removeAuthorizedAddress is not sent by owner", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[5];
    let receiver = await accounts[1];

    try {
      await stable.removeAuthorizedAddress(receiver, {from: sender});
    } catch (e) {
      return true;
    }
    throw new Error("removeAuthorizedAddress worked")
  });

});
