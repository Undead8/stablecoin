# This is a stablecoin contract

## Deployment

Copy web3 from remix in a .js file.

Modify value for name and token name.

In console:
`loadScript('filename.js')`

## Load deployed contract

Create a file abi.js with:
`var abi = /* Paste ABI here */`

In console, cd to file location, then:
`loadScript('abi.js')`

`var MyContract = web3.eth.contract(abi)`

`var stablecoin = MyContract.at('/* Paste address here */')`


## Interact
You can interact with the contract by using `stablecoin.function({from: eth.accounts[0]})`