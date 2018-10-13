# This is a stablecoin contract

## Deployment

### Merge contracts before compile
In terminal, run:
`cat first-contract.sol second-contract.sol | tr -s '\n' ' ' > mergedcontract.sol`

### Check if compiler is installed
In geth console, run:
`eth.getCompilers()`

### Compile
`var stablecoinSource = /* copy mergedcontract.sol string here */`

`var stablecoinCompiled = web3.eth.compile.solidity(stablecoinSource); console.log(stablecoinCompiled);`

### Deploy
`var tokenName = /* var of type string here */ ;`

`var tokenSymbol = /* var of type string here */ ;`

`var stablecoinContract = web3.eth.contract(stablecoinCompiled.StableCoin.info.abiDefinition);`

```javascript
var stablecoin = stablecoinContract.new(
   tokenName,
   tokenSymbol,
   {
		from: web3.eth.accounts[0],
		data: stablecoinCompiled.StableCoin.code,
		gas: '4700000'
	}, function(e, contract){
  	console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
```

## Interact
You can interact with the contract by using `stablecoin.function()`
