# This is a stablecoin contract

## Deployment

`var stablecoinABI = /* copy ABI from remix here */`

`var stablecoinBytecode = /* copy Bytecode from remix here */`

`var tokenName = /* var of type string here */ ;`

`var tokenSymbol = /* var of type string here */ ;`

`var fromAccount = web3.eth.accounts[0]`

```javascript
var stablecoinContract = web3.eth.contract(stablecoinABI);
var stablecoin = stablecoinContract.new(
   tokenName,
   tokenSymbol,
   {
		from: web3.eth.accounts[0],
		data: "0x" + stablecoinBytecode.object,
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
