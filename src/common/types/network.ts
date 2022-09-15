import { ChainID } from '@stacks/transactions';

export enum NetworkModes {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export type NetworkMode = NetworkModes.Mainnet | NetworkModes.Testnet | null;

export interface Network {
  label: string;
  url: string;
  networkId: ChainID;
  mode: NetworkModes;
  wsUrl?: string;
}
