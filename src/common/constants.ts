import { ChainID } from '@stacks/transactions';

export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const IS_DEV = process.env.NODE_ENV !== 'production';
export const IS_STAGING = process.env.STAGING === 'enabled';

export const DEFAULT_TESETNET_SERVER = 'https://stacks-node-api.xenon.blockstack.org';

export const NETWORK_LIST_COOKIE = 'network-list';
export const NETWORK_CURRENT_INDEX_COOKIE = 'network-current';
export const DEFAULT_NETWORK_INDEX = 0;
export const DEFAULT_NETWORK_LIST = [
  {
    label: 'stacks.co',
    url: process.env.TESTNET_API_SERVER || DEFAULT_TESETNET_SERVER,
  },
  {
    label: 'localhost',
    url: 'http://localhost:3999',
  },
];

export const TESTNET_CHAIN_ID = ChainID.Testnet;
export const MAINNET_CHAIN_ID = ChainID.Mainnet;

export enum MODALS {
  SEARCH = 'modals/search',
  NETWORK = 'modals/add-network',
}

type ReverseMap<T extends Record<keyof T, any>> = {
  [V in T[keyof T]]: {
    [K in keyof T]: T[K] extends V ? K : never;
  }[keyof T];
};

const reverseMap: ReverseMap<typeof MODALS> = Object.entries(MODALS).reduce((rMap, [k, v]) => {
  rMap[v] = k;
  return rMap;
}, {} as any);

export type AllModals = keyof typeof reverseMap;
