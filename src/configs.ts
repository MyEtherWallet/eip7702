import {privateToAddress} from '@ethereumjs/util'

const PAY_FROM_PRIVATE = Buffer.from(process.env.PAY_FROM_PRIV_KEY!.replace('0x', ''), 'hex')
const PAY_FROM_ADDRESS = privateToAddress(PAY_FROM_PRIVATE)
const EIP7702 = {
	MAGIC: 0x05,
	TX_TYPE: 0x04,
}

export {PAY_FROM_ADDRESS, PAY_FROM_PRIVATE, EIP7702}
