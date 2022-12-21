import getConfig from 'next/config';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { ChainID } from '@stacks/transactions';

import packageJson from '../../package.json';
import { TxStatus } from './types/tx';

const { publicRuntimeConfig } = getConfig();

export const IS_SSR = typeof window === 'undefined';

const config = publicRuntimeConfig;

const getNumber = (query?: string): number | undefined =>
  query && typeof parseInt(query) === 'number' ? parseInt(query) : undefined;

export const STX_DECIMALS = 6;

export const MICROBLOCKS_ENABLED = true;

export const DEFAULT_POLLING_INTERVAL =
  getNumber(
    config?.NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL || process.env.NEXT_PUBLIC_DEFAULT_POLLING_INTERVAL
  ) || 10000; // 10 seconds :c

export const TESTNET_CHAIN_ID = ChainID.Testnet;
export const IS_BROWSER = typeof document !== 'undefined';

export const STACKS_EXPLORER_APP_ICON =
  'https://blockstack-www.imgix.net/stacks-explorer-icon.png?auto=format&w=72';

export const DEFAULT_V2_INFO_ENDPOINT = '/v2/info';

export const SITE_NOTICE_BANNER_LABEL =
  config?.NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL || process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL;

export const SITE_NOTICE_BANNER_MESSAGE =
  config?.NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE ||
  process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE;
export const SITE_NOTICE_ENABLED = SITE_NOTICE_BANNER_LABEL && SITE_NOTICE_BANNER_MESSAGE;

export const APP_DETAILS = {
  name: 'Stacks Explorer',
  icon: STACKS_EXPLORER_APP_ICON,
};

export const CONNECT_AUTH_ORIGIN =
  config?.NEXT_PUBLIC_CONNECT_AUTH_ORIGIN ||
  process.env.NEXT_PUBLIC_CONNECT_AUTH_ORIGIN ||
  'https://pr-725.app.stacks.engineering';

export const DEFAULT_TESTNET_SERVER =
  config?.NEXT_PUBLIC_TESTNET_API_SERVER ||
  process.env.NEXT_PUBLIC_TESTNET_API_SERVER ||
  'https://stacks-node-api.testnet.stacks.co';

export const DEFAULT_MAINNET_SERVER =
  config?.NEXT_PUBLIC_MAINNET_API_SERVER ||
  process.env.NEXT_PUBLIC_MAINNET_API_SERVER ||
  'https://stacks-node-api.stacks.co';

export const DEFAULT_DEVNET_SERVER = 'http://localhost:3999';

export const VERSION = config?.VERSION || process.env.VERSION || packageJson.version;

export enum MODALS {
  SEARCH = 'modals/search',
  ADD_NETWORK = 'modals/add-network',
  UNLOCKING_SCHEDULE = 'modals/unlocking-schedule',
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

export const POX_ADDRESS = 'SP000000000000000000002Q6VF78';

export const X_API_KEY = config?.X_API_KEY ?? process.env.X_API_KEY ?? '';

export const HIRO_HEADERS: HeadersInit = {
  'x-api-key': X_API_KEY,
  'x-hiro-product': 'explorer',
  'x-hiro-version': VERSION,
};

export const QueryRefreshRates: Record<'Default' | 'None', number | false> = {
  Default: DEFAULT_POLLING_INTERVAL,
  None: false,
};
export const DEFAULT_BLOCKS_LIST_LIMIT = 11;
export const DEFAULT_LIST_LIMIT_SMALL = 10;
export const DEFAULT_LIST_LIMIT = 30;
export const DEFAULT_TX_EVENTS_LIMIT = 50;

export const MAX_BLOCK_TRANSACTIONS_PER_CALL = 200;

export const TransactionType = {
  SMART_CONTRACT: 'smart_contract' as Transaction['tx_type'],
  CONTRACT_CALL: 'contract_call' as Transaction['tx_type'],
  TOKEN_TRANSFER: 'token_transfer' as Transaction['tx_type'],
  COINBASE: 'coinbase' as Transaction['tx_type'],
  POISON_MICROBLOCK: 'poison_microblock' as Transaction['tx_type'],
} as const;

export const TransactionStatus: Record<string, TxStatus> = {
  PENDING: 'pending',
  SUCCESS_ANCHOR_BLOCK: 'success_anchor_block',
  SUCCESS_MICROBLOCK: 'success_microblock',
  NON_CANONICAL: 'non_canonical',
  FAILED: 'failed',
};

export const BTC_BNS_CONTRACT = 'SP000000000000000000002Q6VF78.bns::names';
