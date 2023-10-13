import { ChainID } from '@stacks/transactions';

export enum NetworkModes {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export type NetworkMode = NetworkModes.Mainnet | NetworkModes.Testnet;

export interface Network {
  label: string;
  url: string;
  btcBlockBaseUrl: string;
  btcTxBaseUrl: string;
  btcAddressBaseUrl: string;
  networkId: ChainID;
  mode: NetworkModes;
  wsUrl?: string;
  isCustomNetwork?: boolean;
  isSubnet?: boolean;
}
