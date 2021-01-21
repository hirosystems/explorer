import type { Transaction } from '@blockstack/stacks-blockchain-api-types';

export interface FetchTransactionsBase {
  key: string;
  txTypes?: Transaction['tx_type'][];
  page?: number;
  limit?: number;
  mempool?: boolean;
}

export interface MempoolTransactionsOptions extends FetchTransactionsBase {
  mempool?: true;
}

export interface ConfirmedTransactionsOptions extends FetchTransactionsBase {
  mempool: false | undefined;
}

export interface FetchBlocksBase {
  key: string;
  page?: number;
  limit?: number;
}
