/**
 * Data queries
 *
 * This document contains all the string keys for the various data queries we have in the entire application
 */

// Homepage
export const HOMEPAGE = 'data/HOMEPAGE';
export const HOMEPAGE_TX_LIST_MEMPOOL = `${HOMEPAGE}/TX_LIST_MEMPOOL`;
export const HOMEPAGE_TX_LIST_CONFIRMED = `${HOMEPAGE}/TX_LIST_CONFIRMED`;
export const HOMEPAGE_BLOCKS_LIST = `${HOMEPAGE}/BLOCKS_LIST`;

// Blocks index page
export const BLOCKS_PAGE = 'data/BLOCKS_PAGE';
export const BLOCKS_PAGE_BLOCKS_LIST = `${BLOCKS_PAGE}/BLOCKS_LIST`;

// Transactions index page
export const TRANSACTIONS_PAGE = 'data/TRANSACTIONS_PAGE';
export const TRANSACTIONS_PAGE_TX_LIST_MEMPOOL = `${TRANSACTIONS_PAGE}/TX_LIST_MEMPOOL`;
export const TRANSACTIONS_PAGE_TX_LIST_CONFIRMED = `${TRANSACTIONS_PAGE}/TX_LIST_CONFIRMED`;

// Address single page
export const ADDRESS_PAGE = 'data/ADDRESS_PAGE';
export const ADDRESS_PAGE_TX_LIST = `${ADDRESS_PAGE}/TX_LIST`;
export const ADDRESS_PAGE_BALANCES = `${ADDRESS_PAGE}/BALANCES`;

// Transaction single page
export const TRANSACTION_PAGE = 'data/TRANSACTION_PAGE';

// Block single page
export const BLOCK_PAGE = 'data/BLOCK_PAGE';

export function makeKeyWithPrefix(prefix: string, key: string): string {
  return `${prefix}/${key}`;
}
