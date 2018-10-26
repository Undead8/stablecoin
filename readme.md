# This is a stablecoin contract

## Deployment on live net or rinkeby using geth

### Compile

Copy web3 from remix in a .js file.

Modify value for name and token name.

In console:
`loadScript('filename.js')`

### Load deployed contract

Create a file abi.js with:
`var abi = /* Paste ABI here */`

In console, cd to file location, then:
`loadScript('abi.js')`

`var MyContract = web3.eth.contract(abi)`

`var stablecoin = MyContract.at('/* Paste address here */')`


### Interact

You can interact with the contract by using `stablecoin.function({from: eth.accounts[0]})`

## Using Truffle

### Compile and migrate to test blockchain

In console, cd to stablecoin folder:
`truffle develop`

`compile --all`

`migrate --reset`

### Assign contracts to variables

```javascript
var gicable;
Gicable.deployed().then(function(instance) { gicable = instance });
var giccontract;
GicContract.deployed().then(function(instance) { giccontract = instance });
```

### Interact with contracts
For a call:
`gicable.balaceOf.call(web3.eth.accounts[0])`

For a transaction:
`giccontract.requestGic(10000, 0, { from: web3.eth.accounts[1] })`

