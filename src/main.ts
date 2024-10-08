import {Hardfork, Mainnet, createCustomCommon} from '@ethereumjs/common'
import {createEOACode7702Tx} from '@ethereumjs/tx'
import {bytesToHex, hexToBytes, type PrefixedHexString} from '@ethereumjs/util'
import {PAY_FROM_ADDRESS, PAY_FROM_PRIVATE} from './configs.js'
import {Wallet} from 'ethers'
import {JsonRpcProvider, Interface} from 'ethers'
import {populateAndSignAuthAddress} from './authorization-signer.js'

const provider = new JsonRpcProvider('https://rpc.pectra-devnet-3.ethpandaops.io')
const wallet = new Wallet(PAY_FROM_PRIVATE.toString('hex'), provider)

const CONTRACT_ADDRESS = '0x85F852931f4fb97d2DfeC1827273fd3c713b58C2' // code is at TestContract.sol

const abi = ['function doAnEvent()']
let iface = new Interface(abi)
const data = iface.encodeFunctionData('doAnEvent')

wallet
	.populateTransaction({
		to: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		value: '0x0',
	})
	.then(async tempTx => {
		//Im doing this tempTx just to get maxFeePerGas and maxPriorityFeePerGas
		const auth = await populateAndSignAuthAddress(CONTRACT_ADDRESS, wallet, provider)
		const transactionCount = await provider.getTransactionCount(wallet.address)
		const commonWithCustomChainId = createCustomCommon({chainId: auth.chainId}, Mainnet, {
			eips: [7702],
			hardfork: Hardfork.Cancun,
		})
		const tx = createEOACode7702Tx(
			{
				authorizationList: [auth],
				to: bytesToHex(PAY_FROM_ADDRESS),
				gasLimit: BigInt(150000),
				nonce: BigInt(transactionCount),
				maxFeePerGas: tempTx.maxFeePerGas as bigint,
				maxPriorityFeePerGas: tempTx.maxPriorityFeePerGas as bigint,
				data: hexToBytes(data),
			},
			{common: commonWithCustomChainId},
		)
		const signedTx = tx.sign(PAY_FROM_PRIVATE)
		console.log(signedTx.toJSON())
		console.log(`https://explorer.pectra-devnet-3.ethpandaops.io/tx/${bytesToHex(signedTx.hash())}`)
		// provider
		// 	.broadcastTransaction(bytesToHex(signedTx.serialize()))
		// 	.then(console.log)
		// 	.catch(e => {
		// 		console.log(e)
		// 		console.log('Tx sent')
		// 	})
	})
