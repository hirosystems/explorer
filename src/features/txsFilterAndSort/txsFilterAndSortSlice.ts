import { PayloadAction, Reducer, createSelector, createSlice } from '@reduxjs/toolkit';

import {
  GetMempoolTransactionListOrderByEnum,
  GetMempoolTransactionListOrderEnum,
} from '@stacks/blockchain-api-client';

import { RootState } from '../../common/state/store';

export enum TxFilterAndSortTypes {
  HomepageTxFilter = 'HomepageTxFilter',
  TxsPageTxFilter = 'TxsPageTxFilter',
  TxPageTxFilter = 'TxPageTxFilter',
  BlocksPageTxFilter = 'BlocksPageTxFilter',
  SandboxTxFilter = 'SandboxTxFilter',
  AddressTxFilter = 'AddressTxFilter',
}

export type TxFilters = { [key in TxFilterAndSortTypes]: TxFilterAndSortState };

export interface TxFilterAndSortState {
  activeFilters: string[];
  activeSort: GetMempoolTransactionListOrderByEnum;
  activeOrder: GetMempoolTransactionListOrderEnum;
  isVisible: boolean;
}

export const initialState: TxFilterAndSortState = {
  activeFilters: [],
  activeSort: GetMempoolTransactionListOrderByEnum.age,
  activeOrder: GetMempoolTransactionListOrderEnum.desc,
  isVisible: false,
};

const createSliceOptions = (filterType: TxFilterAndSortTypes) => ({
  name: filterType,
  initialState,
  reducers: {
    setActiveFilters: (state: TxFilterAndSortState, action: PayloadAction<string[]>) => {
      state.activeFilters = action.payload;
    },
    setActiveSort: (
      state: TxFilterAndSortState,
      action: PayloadAction<GetMempoolTransactionListOrderByEnum>
    ) => {
      state.activeSort = action.payload;
    },
    setActiveOrder: (
      state: TxFilterAndSortState,
      action: PayloadAction<GetMempoolTransactionListOrderEnum>
    ) => {
      state.activeOrder = action.payload;
    },
  },
});

export const createTxFilterAndSortSlice = (filterType: TxFilterAndSortTypes) => {
  const slice = createSlice(createSliceOptions(filterType));
  const selectTxFilter = (state: RootState) => state[filterType];
  const selectActiveFilters = createSelector([selectTxFilter], state => state.activeFilters);
  const selectActiveSort = createSelector([selectTxFilter], state => state.activeSort);
  const selectActiveOrder = createSelector([selectTxFilter], state => state.activeOrder);
  return {
    slice,
    actions: slice.actions,
    selectors: { selectActiveFilters, selectActiveSort, selectActiveOrder },
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
