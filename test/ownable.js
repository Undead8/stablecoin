const StableCoin = artifacts.require("./StableCoin.sol");

contract("Ownable", function(accounts) {

  it("should have creater as original owner", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let owner = await stable.owner();
    assert.equal(owner, sender, "Owner is not creator")
  });

  it("should set approvable value by owner", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[0];
    let firstApprovalThreshold = await Math.floor(Math.random() * 100000000) + 1;
    let secondApprovalThreshold = await Math.floor(Math.random() * 100000000) + 1;

    await stable.setOwnerApprovalThreshold(firstApprovalThreshold, {from: sender});
    let firstApprovalResult = await stable.ownerApprovalThreshold();

    await stable.setOwnerApprovalThreshold(secondApprovalThreshold, {from: sender});
    let secondApprovalResult = await stable.ownerApprovalThreshold();

    assert.equal(firstApprovalResult, firstApprovalThreshold, "Not the right value") ||
    assert.equal(secondApprovalResult, secondApprovalThreshold, "Not the right value")
  });

  it("should throw if transfer approval value is not sent by owner", async function () {
    let stable = await StableCoin.deployed();
    let sender = await accounts[5];
    let receiver = await accounts[1];
    let approvalThreshold = await Math.floor(Math.random() * 100000000) + 1;

    try {
      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: sender});
    } catch (e) {
      return true;
    }
    throw new Error("ApprovalThreshold changed")
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
    let sender = await accounts[6];
    let receiver = await accounts[1];

    try {
      await stable.transferContractOwnership(receiver, {from: sender});
    } catch (e) {
      return true;
    }
    throw new Error("Owner changed")
  });

});
