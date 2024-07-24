import { PayloadAction, Reducer, createSelector, createSlice } from '@reduxjs/toolkit';

import {
  GetMempoolTransactionListOrderByEnum,
  GetMempoolTransactionListOrderEnum,
  GetTransactionListOrderEnum,
} from '@stacks/blockchain-api-client';
import { GetTransactionListSortByEnum } from '@stacks/blockchain-api-client';

import { RootState } from '../../common/state/store';

export enum TxFilterAndSortTypes {
  HomepageTxFilter = 'HomepageTxFilter',
  TxsPageTxFilter = 'TxsPageTxFilter',
  TxPageTxFilter = 'TxPageTxFilter',
  BlocksPageTxFilter = 'BlocksPageTxFilter',
  SandboxTxFilter = 'SandboxTxFilter',
  AddressTxFilter = 'AddressTxFilter',
  SearchTxFilter = 'SearchTxFilter',
}

export type TxFilters = { [key in TxFilterAndSortTypes]: TxFilterAndSortState };

export interface TxFilterAndSortState {
  activeFilters: string[];
  activeMempoolTxsSort: GetMempoolTransactionListOrderByEnum;
  activeMempoolTxsOrder: GetMempoolTransactionListOrderEnum;
  activeConfirmedTxsSort: GetTransactionListSortByEnum;
  activeConfirmedTxsOrder: GetTransactionListOrderEnum;
  isVisible: boolean;
}

export const initialState: TxFilterAndSortState = {
  activeFilters: [],
  activeMempoolTxsSort: GetMempoolTransactionListOrderByEnum.age,
  activeMempoolTxsOrder: GetMempoolTransactionListOrderEnum.desc,
  activeConfirmedTxsSort: GetTransactionListSortByEnum.burn_block_time,
  activeConfirmedTxsOrder: GetTransactionListOrderEnum.desc,
  isVisible: false,
};

const createSliceOptions = (filterType: TxFilterAndSortTypes) => ({
  name: filterType,
  initialState,
  reducers: {
    setActiveFilters: (state: TxFilterAndSortState, action: PayloadAction<string[]>) => {
      state.activeFilters = action.payload;
    },
    setMempoolTxsActiveSort: (
      state: TxFilterAndSortState,
      action: PayloadAction<GetMempoolTransactionListOrderByEnum>
    ) => {
      state.activeMempoolTxsSort = action.payload;
    },
    setMempoolTxsActiveOrder: (
      state: TxFilterAndSortState,
      action: PayloadAction<GetMempoolTransactionListOrderEnum>
    ) => {
      state.activeMempoolTxsOrder = action.payload;
    },
    setConfirmedTxsActiveSort: (
      state: TxFilterAndSortState,
      action: PayloadAction<GetTransactionListSortByEnum>
    ) => {
      state.activeConfirmedTxsSort = action.payload;
    },
    setConfirmedTxsActiveOrder: (
      state: TxFilterAndSortState,
      action: PayloadAction<GetTransactionListOrderEnum>
    ) => {
      state.activeConfirmedTxsOrder = action.payload;
    },
  },
});

export const createTxFilterAndSortSlice = (filterType: TxFilterAndSortTypes) => {
  const slice = createSlice(createSliceOptions(filterType));
  const selectTxFilter = (state: RootState) => state[filterType];
  const selectActiveFilters = createSelector([selectTxFilter], state => state.activeFilters);
  const selectMempoolTxsActiveSort = createSelector(
    [selectTxFilter],
    state => state.activeMempoolTxsSort
  );
  const selectMempoolTxsActiveOrder = createSelector(
    [selectTxFilter],
    state => state.activeMempoolTxsOrder
  );
  const selectConfirmedTxsActiveSort = createSelector(
    [selectTxFilter],
    state => state.activeConfirmedTxsSort
  );
  const selectConfirmedTxsActiveOrder = createSelector(
    [selectTxFilter],
    state => state.activeConfirmedTxsOrder
  );
  return {
    slice,
    actions: slice.actions,
    selectors: {
      selectActiveFilters,
      selectMempoolTxsActiveSort,
      selectMempoolTxsActiveOrder,
      selectConfirmedTxsActiveSort,
      selectConfirmedTxsActiveOrder,
    },
  };
};

export const txFilterAndSort = Object.keys(TxFilterAndSortTypes).reduce(
  (acc, filterType) => ({
    ...acc,
    [filterType]: createTxFilterAndSortSlice(filterType as TxFilterAndSortTypes),
  }),
  {} as Record<TxFilterAndSortTypes, ReturnType<typeof createTxFilterAndSortSlice>>
);

export const filterAndSortReducers = Object.values(TxFilterAndSortTypes).reduce(
  (acc, txFilter) => ({ ...acc, [txFilter]: txFilterAndSort[txFilter].slice.reducer }),
  {} as Record<TxFilterAndSortTypes, Reducer<TxFilterAndSortState>>
);
