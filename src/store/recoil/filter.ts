import { atomFamily } from 'recoil';

import { TransactionType } from '@models/transaction.interface';

export type TxTypeFilterOptions = [
  typeof TransactionType.SMART_CONTRACT,
  typeof TransactionType.CONTRACT_CALL,
  typeof TransactionType.TOKEN_TRANSFER,
  typeof TransactionType.COINBASE
];
export const DEFAULT_TX_FILTER_TYPES = [
  TransactionType.SMART_CONTRACT,
  TransactionType.CONTRACT_CALL,
  TransactionType.TOKEN_TRANSFER,
  TransactionType.COINBASE,
];
export const filterState = atomFamily({
  key: 'sandbox.tx-panel.filter',
  default: {
    showing: false,
    types: DEFAULT_TX_FILTER_TYPES,
    showPending: true,
    showFailed: true,
  },
});
