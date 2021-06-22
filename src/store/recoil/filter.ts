import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';

export enum GetTransactionListTypeEnum {
  coinbase = 'coinbase',
  token_transfer = 'token_transfer',
  smart_contract = 'smart_contract',
  contract_call = 'contract_call',
  poison_microblock = 'poison_microblock',
}

export type TxTypeFilterOptions = [
  typeof GetTransactionListTypeEnum.coinbase,
  typeof GetTransactionListTypeEnum.token_transfer,
  typeof GetTransactionListTypeEnum.smart_contract,
  typeof GetTransactionListTypeEnum.contract_call
];
export const DEFAULT_TX_FILTER_TYPES: GetTransactionListTypeEnum[] = [
  GetTransactionListTypeEnum.coinbase,
  GetTransactionListTypeEnum.token_transfer,
  GetTransactionListTypeEnum.smart_contract,
  GetTransactionListTypeEnum.contract_call,
];
const defaultValue = {
  showing: false,
  types: DEFAULT_TX_FILTER_TYPES,
  showPending: true,
  showFailed: true,
};

export const filterState = atomFamily(_param =>
  atom<{
    showing: boolean;
    showPending: boolean;
    showFailed: boolean;
    types: GetTransactionListTypeEnum[];
  }>(defaultValue)
);
