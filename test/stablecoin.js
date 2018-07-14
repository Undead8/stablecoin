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

  contract("Mappings", function(accounts) {

  });
});

/*


contract('MetaCoin', function(accounts) {

  it("should put 10000 MetaCoin in the first account", async function () {
    let meta = await MetaCoin.deployed();
    let balance = await meta.getBalance.call(accounts[0]);
    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account")
  });

  it("should fail because function does not exist on contract", async function () {
    let meta = await MetaCoin.deployed();
    try {
      await meta.someNonExistantFn();
    } catch (e) {
      return true;
    }
    throw new Error("I should never see this!")
  })

  it("should fail specialFn because not enough time passed", async function () {
    let meta = await MetaCoin.new();
    try {
      await timeTravel(10) // Just here so you can play around with time
      await mineBlock() //workaround for https://github.com/ethereumjs/testrpc/issues/336
      await meta.specialFn.call();
    } catch (e) {
      return true;
    }
    throw new Error("Calling specialFn should have failed but somehow succeeded")
  })

  it("should successfully call specialFn because enough time passed", async function () {
    let meta = await MetaCoin.new();
    await timeTravel(86400 * 3) //3 days later
    await mineBlock() // workaround for https://github.com/ethereumjs/testrpc/issues/336
    let status = await meta.specialFn.call();
    assert.equal(status, true, "specialFn should be callable after 1 day")
  })

  it("should call a function that depends on a linked library", async function () {
    let meta = await MetaCoin.deployed();
    let outCoinBalance = await meta.getBalance.call(accounts[0]);
    let outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);

    let metaCoinBalance = outCoinBalance.toNumber();
    let metaCoinEthBalance = outCoinBalanceEth.toNumber();

    assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpected function, linkage may be broken");
  });

  it("should send coin correctly", async function () {
    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var amount = 10;

    let meta = await MetaCoin.deployed();
    let balance1 = await meta.getBalance.call(account_one);
    let balance2 = await meta.getBalance.call(account_two);

    let account_one_starting_balance = balance1.toNumber();
    let account_two_starting_balance = balance2.toNumber();

    await meta.sendCoin(account_two, amount, {from: account_one});

    let balance3 = await meta.getBalance.call(account_one);
    let balance4 = await meta.getBalance.call(account_two);

    let account_one_ending_balance = balance3.toNumber();
    let account_two_ending_balance = balance4.toNumber();

    assert.equal(account_one_ending_balance, account_one_starting_balance - 10, "Amount wasn't correctly taken from the sender");
    assert.equal(account_two_ending_balance, account_two_starting_balance + 10, "Amount wasn't correctly sent to the receiver");
  });
});

*/
