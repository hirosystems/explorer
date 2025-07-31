import { ChainId } from '@stacks/network';

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
  networkId: ChainId;
  mode: NetworkModes;
  wsUrl?: string;
  isCustomNetwork?: boolean;
  isSubnet?: boolean;
}
