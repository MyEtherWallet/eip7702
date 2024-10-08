import { encodeRlp, keccak256 } from 'ethers';
import { EIP7702 } from './configs.js';
import { bigIntToBytes, bigIntToHex, bytesToHex, ecsign, hexToBytes } from '@ethereumjs/util';
const populateAndSignAuthAddress = async (address, wallet, provider) => {
    const walletAddress = await wallet.getAddress();
    const nonce = BigInt(await provider.getTransactionCount(walletAddress, 'pending'));
    const { chainId } = await provider.getNetwork();
    const magicBuffer = Buffer.from([EIP7702.MAGIC]);
    const rlpData = encodeRlp([bigIntToBytes(chainId), hexToBytes(address), bigIntToBytes(nonce)]);
    const signBytes = Buffer.concat([magicBuffer, hexToBytes(rlpData)]);
    const hash = keccak256(signBytes);
    const signature = ecsign(hexToBytes(hash), hexToBytes(wallet.privateKey));
    return {
        address: address,
        chainId: bigIntToHex(chainId),
        nonce: bigIntToHex(nonce) === '0x0' ? '0x' : bigIntToHex(nonce),
        r: bytesToHex(signature.r),
        s: bytesToHex(signature.s),
        yParity: bigIntToHex(signature.v - BigInt(27)) === '0x0' ? '0x' : '0x1',
    };
};
export { populateAndSignAuthAddress };
//# sourceMappingURL=authorization-signer.js.map