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

contract("StableCoin", function(accounts) {

  contract("PublicVariables", function(accounts) {

    it("should have the right name", async function () {
      let stable = await StableCoin.deployed();
      let name = await stable.name();
      assert.equal(name, "Testtoken", "Testtoken was not the name")
    });

    it("should have the right symbol", async function () {
      let stable = await StableCoin.deployed();
      let symbol = await stable.symbol();
      assert.equal(symbol, "tkn", "tkn was not the symbol")
    });

    it("should have the right number of decimals", async function () {
      let stable = await StableCoin.deployed();
      let decimals = await stable.decimals();
      assert.equal(decimals, 2, "decimals was not 2")
    });

    it("should have 0 totalSupply at creation", async function () {
      let stable = await StableCoin.deployed();
      let totalSupply = await stable.totalSupply();
      assert.equal(totalSupply, 0, "totalSupply was not 0")
    });

    it("should have 0 minimumRedeemValue at creation", async function () {
      let stable = await StableCoin.deployed();
      let minimumRedeemValue = await stable.minimumRedeemValue();
      assert.equal(minimumRedeemValue, 0, "minimumRedeemValue was not 0")
    });
  });

  contract("#mintToken", function(accounts) {

    it("should mint the tokens by owner", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[0];
      let receiver = await accounts[1];
      let approvalThreshold = await 10000000000;
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 1;

      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: sender});
      await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});

      let mintedTokens = await stable.balanceOf.call(receiver);

      assert.equal(mintedTokens, value, "Tokens not minted correctly")
    });

    it("should mint the tokens by authorized", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0]
      let sender = await accounts[1];
      let receiver = await accounts[2];
      let approvalThreshold = await 10000000000;
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 1;

      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: owner});
      await stable.addAuthorizedAddress(sender, {from: owner});
      await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});

      let mintedTokens = await stable.balanceOf.call(receiver);

      assert.equal(mintedTokens, value, "Tokens not minted correctly")
    });

    it("should throw if minted by address not authorized", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[2];
      let receiver = await accounts[3];
      let approvalThreshold = await 10000000000;
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 1;

      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: owner});

      try {
        await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should mint the tokens above value by owner", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0]
      let receiver = await accounts[4];
      let approvalThreshold = await Math.floor(Math.random() * 100000000) + 1; 
      let value = await Math.floor(Math.random() * 1000000000) + approvalThreshold + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 1;

      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: owner});
      await stable.mintToken(receiver, value, depositNumber, cooldown, {from: owner});

      let mintedTokens = await stable.balanceOf.call(receiver);

      assert.equal(mintedTokens, value, "Tokens not minted correctly")
    });

    it("should throw if minted value is above value by owner and not sent by owner", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[5];
      let receiver = await accounts[6];
      let approvalThreshold = await Math.floor(Math.random() * 100000000) + 1; 
      let value = await Math.floor(Math.random() * 1000000000) + approvalThreshold + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 1;

      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: owner});
      await stable.addAuthorizedAddress(sender, {from: owner});

      try {
        await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    }); 

    it("should throw if deposit was already minted", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[0];
      let receiver = await accounts[7];
      let approvalThreshold = await 10000000000;
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await 0;

      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: owner});
      await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});

      try {
        await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should throw if account is in cooldown", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[0];
      let receiver = await accounts[8];
      let approvalThreshold = await 10000000000;
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let firstDepositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let secondDepositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 6000) + 1000;

      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: owner});
      await stable.mintToken(receiver, value, firstDepositNumber, cooldown, {from: sender});
      await timeTravel(60);

      try {
        await stable.mintToken(receiver, value, secondDepositNumber, 0, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should throw if contract is paused", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[0];
      let receiver = await accounts[9];
      let approvalThreshold = await 10000000000;
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 1;

      await stable.setOwnerApprovalThreshold(approvalThreshold, {from: owner});
      await stable.pauseContract({from: sender});

      try {
        await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });
  });

  contract("#reverseMintage", function(accounts) {

    it("should reverse mintage by owner", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[0];
      let receiver = await accounts[1];
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 60;

      await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
      let receiverBalanceBefore = await stable.balanceOf.call(receiver);
      let totalSupplyBefore = await stable.totalSupply.call();
      let valueInCooldownBefore = await stable.valueInCooldown.call(receiver);
      let depositStatusBefore = await stable.depositMinted.call(depositNumber);

      timeTravel(Math.floor(Math.random() * 5200));
      await stable.reverseMintage(receiver, depositNumber, {from: sender});
      let receiverBalanceAfter = await stable.balanceOf.call(receiver);
      let totalSupplyAfter = await stable.totalSupply.call();
      let valueInCooldownAfter = await stable.valueInCooldown.call(receiver);
      let depositStatusAfter = await stable.depositMinted.call(depositNumber);

      assert.equal(receiverBalanceBefore, value, "Tokens not minted correctly") ||
      assert.equal(receiverBalanceAfter, 0, "Token not reversed correctly") ||
      assert.equal(totalSupplyBefore, value, "Tokens not assigned to total supply") ||
      assert.equal(totalSupplyAfter, 0, "Tokens not removed from total supply") ||
      assert.equal(valueInCooldownBefore, value, "Value in cooldown before incorrect") ||
      assert.equal(valueInCooldownAfter, 0, "Value in cooldown after incorrect") ||
      assert.isTrue(depositStatusBefore, "Deposit status not true") ||
      assert.isFalse(depositStatusAfter, "Deposit status not false")
    });

/*
    it("should mint the tokens by authorized", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0]
      let sender = await accounts[1];
      let receiver = await accounts[2];
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 60;

      await stable.addAuthorizedAddress(sender, {from: owner});
      await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});

      let mintedTokens = await stable.balanceOf.call(receiver);

      assert.equal(mintedTokens, value, "Tokens not minted correctly")
    });

    it("should throw if minted by address not authorized", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[2];
      let receiver = await accounts[3];
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 60;

      try {
        await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should throw if deposit was already minted", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[0];
      let receiver = await accounts[4];
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await 0;

      await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});

      try {
        await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should throw if account is in cooldown", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[0];
      let receiver = await accounts[5];
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let firstDepositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let secondDepositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 6000) + 1000;

      await stable.mintToken(receiver, value, firstDepositNumber, cooldown, {from: sender});
      await timeTravel(60);

      try {
        await stable.mintToken(receiver, value, secondDepositNumber, 0, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should throw if contract is paused", async function () {
      let stable = await StableCoin.deployed();
      let sender = await accounts[0];
      let receiver = await accounts[6];
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 1000) + 1;

      await stable.pauseContract({from: sender});

      try {
        await stable.mintToken(receiver, value, depositNumber, cooldown, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });
*/

  });

  contract("#transfer", function(accounts) {

    it("should transfer the tokens", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[1];
      let receiver = await accounts[2];
      let originalMint = await 100000000000;
      let value = await Math.floor(Math.random() * 100000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await 0;

      await stable.mintToken(sender, originalMint, depositNumber, cooldown, {from: owner});
      await stable.transfer(receiver, value, {from: sender});

      let receiverBalance = await stable.balanceOf.call(receiver);
      let senderBalance = await stable.balanceOf.call(sender);

      assert.equal(senderBalance, originalMint - value, "Sender balance incorrect") ||
      assert.equal(receiverBalance, value, "Receiver balance incorrect")
    });

    it("should throw if balance is insufficient", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[3];
      let receiver = await accounts[4];
      let originalMint = await 100000;
      let value = await Math.floor(Math.random() * 100000000) + 100001;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await 0;

      await stable.mintToken(sender, originalMint, depositNumber, cooldown, {from: owner});

      try {
        await stable.transfer(receiver, value, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should throw if sent to stablecoin contract", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[4];
      let receiver = await stable.address;
      let originalMint = await 1000000000;
      let value = await Math.floor(Math.random() * 100000000) + 100001;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await 0;

      await stable.mintToken(sender, originalMint, depositNumber, cooldown, {from: owner});

      try {
        await stable.transfer(receiver, value, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should throw if value is in cooldown", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[5];
      let receiver = await accounts[6];
      let originalMint = await 1000000000;
      let value = await Math.floor(Math.random() * 100000000) + 100001;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 6000) + 1000;

      await stable.mintToken(sender, originalMint, depositNumber, cooldown, {from: owner});
      await timeTravel(60);

      try {
        await stable.transfer(receiver, value, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });

    it("should transfer despite cooldown if value is sufficient", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[7];
      let receiver = await accounts[8];
      let firstMint = await 100000;
      let secondMint = await 10000;
      let value = await Math.floor(Math.random() * 99999) + 1;
      let firstDepositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let secondDepositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await Math.floor(Math.random() * 6000) + 1000;

      await stable.mintToken(sender, firstMint, firstDepositNumber, 0, {from: owner});
      await stable.mintToken(sender, secondMint, secondDepositNumber, cooldown, {from: owner});
      await stable.transfer(receiver, value, {from: sender});

      let receiverBalance = await stable.balanceOf.call(receiver);
      let senderBalance = await stable.balanceOf.call(sender);
      let valueInCooldown = await stable.valueInCooldown.call(sender).then(result => result.toNumber());

      assert.equal(senderBalance, firstMint + secondMint - value, "Sender balance incorrect") ||
      assert.equal(receiverBalance, value, "Receiver balance incorrect") ||
      assert.isAbove(valueInCooldown, 0, "There was no value in cooldown")
    });

    it("should throw if contract is paused", async function () {
      let stable = await StableCoin.deployed();
      let owner = await accounts[0];
      let sender = await accounts[9];
      let receiver = await accounts[0];
      let value = await Math.floor(Math.random() * 100000000) + 1;
      let depositNumber = await Math.floor(Math.random() * 1000000) + 10000;
      let cooldown = await 0;

      await stable.pauseContract({from: owner});

      try {
        await stable.transfer(receiver, value, {from: sender});
      } catch (e) {
        return true;
      }
      throw new Error("Did not throw")
    });
  });


});
