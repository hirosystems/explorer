import { Transaction } from '@stacks/stacks-blockchain-api-types';

import packageJson from '../../package.json';
import { TxStatus } from './types/tx';

export const MICROBLOCKS_ENABLED = true;

export const IS_BROWSER = typeof document !== 'undefined';

export const STACKS_EXPLORER_APP_ICON =
  'https://blockstack-www.imgix.net/stacks-explorer-icon.png?auto=format&w=72';

export const DEFAULT_V2_INFO_ENDPOINT = '/v2/info';

export const SITE_NOTICE_BANNER_LABEL =
  process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL ||
  process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_LABEL;

export const SITE_NOTICE_BANNER_MESSAGE =
  process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE ||
  process.env.NEXT_PUBLIC_SITE_NOTICE_BANNER_MESSAGE;
export const SITE_NOTICE_ENABLED = SITE_NOTICE_BANNER_LABEL && SITE_NOTICE_BANNER_MESSAGE;

export const APP_DETAILS = {
  name: 'Stacks Explorer',
  icon: STACKS_EXPLORER_APP_ICON,
};

export const CONNECT_AUTH_ORIGIN =
  process.env.NEXT_PUBLIC_CONNECT_AUTH_ORIGIN || 'https://pr-725.app.stacks.engineering';

export const DEFAULT_MAINNET_SERVER =
  process.env.NEXT_PUBLIC_MAINNET_API_SERVER || 'https://api.hiro.so';

export const DEFAULT_TESTNET_SERVER =
  process.env.NEXT_PUBLIC_TESTNET_API_SERVER || 'https://api.testnet.hiro.so';

export const DEFAULT_DEVNET_SERVER = 'http://localhost:3999';

export const VERSION = process.env.VERSION || process.env.VERSION || packageJson.version;

export enum MODALS {
  SEARCH = 'modals/search',
  ADD_NETWORK = 'modals/add-network',
  UNLOCKING_SCHEDULE = 'modals/unlocking-schedule',
}

export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const X_API_KEY = process.env.X_API_KEY ?? process.env.X_API_KEY ?? '';

export const RELEASE_TAG_NAME =
  process.env.RELEASE_TAG_NAME ?? process.env.RELEASE_TAG_NAME ?? null;

export const HIRO_HEADERS: HeadersInit = {
  'x-api-key': X_API_KEY,
  'x-hiro-product': 'explorer',
  'x-hiro-version': VERSION,
};

export const DEFAULT_BLOCKS_LIST_LIMIT = 10;
export const DEFAULT_LIST_LIMIT_SMALL = 10;
export const DEFAULT_LIST_LIMIT = 30;
export const DEFAULT_TX_EVENTS_LIMIT = 100;

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
  DROPPED: 'dropped',
};

export const BTC_BNS_CONTRACT = 'SP000000000000000000002Q6VF78.bns::names';

export const SUBNETS_PARENT_NETWORK_IDS = {
  mainnet: '0xff000000',
  testnet: '0x17000000',
};

export const PAGE_MAX_WIDTH = '1280px';

export const REDIS_URL = process.env.REDIS_URL || '';
