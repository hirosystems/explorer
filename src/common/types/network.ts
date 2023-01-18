import { ChainID } from '@stacks/transactions';

export enum NetworkModes {
  Testnet = 'testnet',
  Devnet = 'devnet',
  Mainnet = 'mainnet',
}

export type NetworkMode = NetworkModes.Mainnet | NetworkModes.Testnet | NetworkModes.Devnet;

export interface Network {
  label: string;
  url: string;
  networkId: ChainID;
  mode: NetworkModes;
  wsUrl?: string;
  isCustomNetwork?: boolean;
}
