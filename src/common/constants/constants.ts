'use client';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TxStatus } from '../types/tx';

export const MICROBLOCKS_ENABLED = true;

export const IS_BROWSER = typeof document !== 'undefined';

export const STACKS_EXPLORER_APP_ICON =
  'https://blockstack-www.imgix.net/stacks-explorer-icon.png?auto=format&w=72';

export const DEFAULT_V2_INFO_ENDPOINT = '/v2/info';

export const APP_DETAILS = {
  name: 'Stacks Explorer',
  icon: STACKS_EXPLORER_APP_ICON,
};

export const DEFAULT_DEVNET_SERVER = 'http://localhost:3999';

export enum MODALS {
  SEARCH = 'modals/search',
  ADD_NETWORK = 'modals/add-network',
  NAKAMOTO = 'modals/nakamoto',
}

export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const DEFAULT_BLOCKS_LIST_LIMIT = 10;
export const DEFAULT_LIST_LIMIT_SMALL = 10;
export const DEFAULT_LIST_LIMIT = 30;
export const DEFAULT_BURN_BLOCKS_LIMIT = 2;
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
  mainnet: '0x17000000',
  testnet: '0xff000000',
};

export const PAGE_MAX_WIDTH = '1280px';

export const mobileBorderCss = {
  '.has-horizontal-scroll &': {
    borderRight: '2px solid var(--stacks-colors-borderPrimary)',
  },
};

export const NUM_TEN_MINUTES_IN_DAY = (24 * 60) / 10; // ie approx number of 10 minute blocks in a day

export const NUM_SECONDS_IN_A_DAY = 24 * 60 * 60;

export const NUM_SECONDS_IN_TEN_MINUTES = 10 * 60;
