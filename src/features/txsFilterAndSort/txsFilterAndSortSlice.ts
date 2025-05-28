import { PayloadAction, Reducer, createSelector, createSlice } from '@reduxjs/toolkit';

import { operations } from '@stacks/blockchain-api-client/lib/generated/schema';

import { RootState } from '../../common/state/store';

// Types for mempool (pending) transaction queries
type MempoolQuery = NonNullable<operations['get_mempool_transaction_list']['parameters']['query']>;
type MempoolOrderBy = Exclude<MempoolQuery['order_by'], undefined>;
type MempoolOrder = Exclude<MempoolQuery['order'], undefined>;

// Types for confirmed transaction queries
type TxsQuery = NonNullable<operations['get_transaction_list']['parameters']['query']>;
type TxSortBy = Exclude<TxsQuery['sort_by'], undefined>;
type TxOrder = Exclude<TxsQuery['order'], undefined>;

// Different contexts in the app where transaction filtering/sorting can occur
export enum TxFilterAndSortTypes {
  HomepageTxFilter = 'HomepageTxFilter', // Homepage transaction list
  TxsPageTxFilter = 'TxsPageTxFilter', // Main transactions page
  TxPageTxFilter = 'TxPageTxFilter', // Individual transaction page
  BlocksPageTxFilter = 'BlocksPageTxFilter', // Blocks page transaction list
  SandboxTxFilter = 'SandboxTxFilter', // Sandbox environment
  AddressTxFilter = 'AddressTxFilter', // Address page transaction list
  SearchTxFilter = 'SearchTxFilter', // Search results transaction list
}

// Maps each filter type to its corresponding state
export type TxFilters = { [key in TxFilterAndSortTypes]: TxFilterAndSortState };

// State shape for transaction filtering and sorting
export interface TxFilterAndSortState {
  activeFilters: string[]; // Currently selected filters
  activeMempoolTxsSort: MempoolOrderBy; // How to sort pending transactions
  activeMempoolTxsOrder: MempoolOrder; // Sort direction for pending transactions
  activeConfirmedTxsSort: TxSortBy; // How to sort confirmed transactions
  activeConfirmedTxsOrder: TxOrder; // Sort direction for confirmed transactions
  isVisible: boolean; // Filter UI visibility
}

// Default values for the filter/sort state
export const initialState: TxFilterAndSortState = {
  activeFilters: [],
  activeMempoolTxsSort: 'age', // Default sort by age
  activeMempoolTxsOrder: 'desc', // Default newest first
  activeConfirmedTxsSort: 'burn_block_time', // Default sort by block time
  activeConfirmedTxsOrder: 'desc', // Default newest first
  isVisible: false,
};

// Creates Redux slice configuration for a specific filter type
const createSliceOptions = (filterType: TxFilterAndSortTypes) => ({
  name: filterType,
  initialState,
  reducers: {
    // Update the active filters
    setActiveFilters: (state: TxFilterAndSortState, action: PayloadAction<string[]>) => {
      state.activeFilters = action.payload;
    },
    // Update mempool transaction sorting
    setMempoolTxsActiveSort: (
      state: TxFilterAndSortState,
      action: PayloadAction<MempoolOrderBy>
    ) => {
      state.activeMempoolTxsSort = action.payload;
    },
    setMempoolTxsActiveOrder: (state: TxFilterAndSortState, action: PayloadAction<TxOrder>) => {
      state.activeMempoolTxsOrder = action.payload;
    },
    // Update confirmed transaction sorting
    setConfirmedTxsActiveSort: (state: TxFilterAndSortState, action: PayloadAction<TxSortBy>) => {
      state.activeConfirmedTxsSort = action.payload;
    },
    setConfirmedTxsActiveOrder: (state: TxFilterAndSortState, action: PayloadAction<TxOrder>) => {
      state.activeConfirmedTxsOrder = action.payload;
    },
  },
});

// Creates a complete Redux slice with actions and selectors for a filter type
export const createTxFilterAndSortSlice = (filterType: TxFilterAndSortTypes) => {
  const slice = createSlice(createSliceOptions(filterType));

  // Base selector to get the filter state
  const selectTxFilter = (state: RootState) => state[filterType];

  // Memoized selectors for specific state values
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

// Create slices for all filter types
export const txFilterAndSort = Object.keys(TxFilterAndSortTypes).reduce(
  (acc, filterType) => ({
    ...acc,
    [filterType]: createTxFilterAndSortSlice(filterType as TxFilterAndSortTypes),
  }),
  {} as Record<TxFilterAndSortTypes, ReturnType<typeof createTxFilterAndSortSlice>>
);

// Combine all reducers into a single object for the store
export const filterAndSortReducers = Object.values(TxFilterAndSortTypes).reduce(
  (acc, txFilter) => ({ ...acc, [txFilter]: txFilterAndSort[txFilter].slice.reducer }),
  {} as Record<TxFilterAndSortTypes, Reducer<TxFilterAndSortState>>
);
