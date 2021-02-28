import { AddressHashMode } from '@stacks/transactions';
import { NetworkMode, NetworkModes } from '@common/types/network';
import BN from 'bn.js';
import { address } from 'bitcoinjs-lib';

const poxKeyToVersionBytesMap: Record<NetworkModes.Mainnet | NetworkModes.Testnet, any> = {
  [NetworkModes.Mainnet]: {
    [AddressHashMode.SerializeP2PKH]: 0x00,
    [AddressHashMode.SerializeP2SH]: 0x05,
  },
  [NetworkModes.Testnet]: {
    [AddressHashMode.SerializeP2PKH]: 0x6f,
    [AddressHashMode.SerializeP2SH]: 0xc4,
  },
};

interface ConvertToPoxAddressBtc {
  version: Buffer;
  hashbytes: Buffer;
}

export function convertPoxAddressToBtc(network: NetworkMode) {
  return ({ version, hashbytes }: ConvertToPoxAddressBtc) => {
    const ver = new BN(version).toNumber() as AddressHashMode;
    if (ver === AddressHashMode.SerializeP2WPKH || ver === AddressHashMode.SerializeP2WSH)
      return null;
    return address.toBase58Check(
      hashbytes,
      poxKeyToVersionBytesMap[network as NetworkModes.Mainnet | NetworkModes.Testnet][ver]
    );
  };
}
