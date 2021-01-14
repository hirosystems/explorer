import { ChainID } from '@stacks/transactions';

export const TESTNET_CHAIN_ID = ChainID.Testnet;
export const MAINNET_CHAIN_ID = ChainID.Mainnet;

export const IS_DEV = process.env.NODE_ENV !== 'production';
export const IS_BROWSER = typeof document !== 'undefined';

export const LEGACY_EXPLORER_API =
  process.env.NEXT_PUBLIC_DEPLOYMENT_URL || `https://${process.env.VERCEL_URL}`;

export const CONNECT_AUTH_ORIGIN =
  process.env.NEXT_PUBLIC_CONNECT_AUTH_ORIGIN || 'https://pr-725.app.stacks.engineering';

export const DEFAULT_TESTNET_SERVER =
  process.env.NEXT_PUBLIC_TESTNET_API_SERVER || 'https://stacks-node-api.xenon.blockstack.org';

export const DEFAULT_MAINNET_SERVER = process.env.NEXT_PUBLIC_MAINNET_API_SERVER;

export const MAINNET_ENABLED = process.env.NEXT_PUBLIC_MAINNET_ENABLED === 'true';

export const NETWORK_LIST_COOKIE = 'STACKS_EXPLORER_NETWORK_LIST';
export const NETWORK_CURRENT_INDEX_COOKIE = 'STACKS_EXPLORER_NETWORK_CURRENT_INDEX';
export const DEFAULT_TESTNET_INDEX = 1;
export const DEFAULT_MAINNET_INDEX = 0;
export const DEFAULT_NETWORK_INDEX = MAINNET_ENABLED
  ? DEFAULT_MAINNET_INDEX
  : DEFAULT_TESTNET_INDEX;

export const DEFAULT_NETWORK_LIST = [
  {
    label: 'stacks.co',
    url: DEFAULT_MAINNET_SERVER,
  },
  {
    label: 'stacks.co',
    url: DEFAULT_TESTNET_SERVER,
  },
  {
    label: 'localhost',
    url: 'http://localhost:3999',
  },
];

export enum MODALS {
  SEARCH = 'modals/search',
  NETWORK = 'modals/add-network',
  DIFFERENT_NETWORK = 'modals/different-network',
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

export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;
