import { PayloadAction, Reducer, createSelector, createSlice } from '@reduxjs/toolkit';

import { operations } from '@stacks/blockchain-api-client/lib/generated/schema';

import { RootState } from '../../common/state/store';

type MempoolQuery = NonNullable<operations['get_mempool_transaction_list']['parameters']['query']>;
type MempoolOrderBy = Exclude<MempoolQuery['order_by'], undefined>;
type MempoolOrder = Exclude<MempoolQuery['order'], undefined>;

type TxsQuery = NonNullable<operations['get_transaction_list']['parameters']['query']>;
type TxSortBy = Exclude<TxsQuery['sort_by'], undefined>;
type TxOrder = Exclude<TxsQuery['order'], undefined>;

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
  activeMempoolTxsSort: MempoolOrderBy;
  activeMempoolTxsOrder: MempoolOrder;
  activeConfirmedTxsSort: TxSortBy;
  activeConfirmedTxsOrder: TxOrder;
  isVisible: boolean;
}

export const initialState: TxFilterAndSortState = {
  activeFilters: [],
  activeMempoolTxsSort: 'age',
  activeMempoolTxsOrder: 'desc',
  activeConfirmedTxsSort: 'burn_block_time',
  activeConfirmedTxsOrder: 'desc',
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
      action: PayloadAction<MempoolOrderBy>
    ) => {
      state.activeMempoolTxsSort = action.payload;
    },
    setMempoolTxsActiveOrder: (state: TxFilterAndSortState, action: PayloadAction<TxOrder>) => {
      state.activeMempoolTxsOrder = action.payload;
    },
    setConfirmedTxsActiveSort: (state: TxFilterAndSortState, action: PayloadAction<TxSortBy>) => {
      state.activeConfirmedTxsSort = action.payload;
    },
    setConfirmedTxsActiveOrder: (state: TxFilterAndSortState, action: PayloadAction<TxOrder>) => {
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
