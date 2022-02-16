import { ChainID } from '@stacks/transactions';

export enum NetworkModes {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export const NetworkIdModeMap: { [key in ChainID]: NetworkModes } = {
  [ChainID.Mainnet]: NetworkModes.Mainnet,
  [ChainID.Testnet]: NetworkModes.Testnet,
};

export type NetworkMode = NetworkModes.Mainnet | NetworkModes.Testnet | null;
