import { PayloadAction, Reducer, createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../common/state/store';

export enum TxFilterTypes {
  HomepageTxFilter = 'HomepageTxFilter',
  TxsPageTxFilter = 'TxsPageTxFilter',
  TxPageTxFilter = 'TxPageTxFilter',
  BlocksPageTxFilter = 'BlocksPageTxFilter',
  SandboxTxFilter = 'SandboxTxFilter',
  AddressTxFilter = 'AddressTxFilter',
}

export type TxFilters = { [key in TxFilterTypes]: TxFilterState };

export interface TxFilterState {
  activeFilters: string[];
  isVisible: boolean;
}

export const initialState: TxFilterState = {
  activeFilters: [],
  isVisible: false,
};

const createSliceOptions = (filterType: TxFilterTypes) => ({
  name: filterType,
  initialState,
  reducers: {
    setActiveFilters: (state: TxFilterState, action: PayloadAction<string[]>) => {
      state.activeFilters = action.payload;
    },
  },
});

export const createTxFilterSlice = (filterType: TxFilterTypes) => {
  const slice = createSlice(createSliceOptions(filterType));
  const selectTxFilter = (state: RootState) => state[filterType];
  const selectActiveFilters = createSelector([selectTxFilter], search => search.activeFilters);
  return {
    slice,
    actions: slice.actions,
    selectors: { selectActiveFilters },
  };
};

export const txFilters = Object.keys(TxFilterTypes).reduce(
  (acc, filterType) => ({ ...acc, [filterType]: createTxFilterSlice(filterType as TxFilterTypes) }),
  {} as Record<TxFilterTypes, ReturnType<typeof createTxFilterSlice>>
);

export const filterReducers = Object.values(TxFilterTypes).reduce(
  (acc, txFilter) => ({ ...acc, [txFilter]: txFilters[txFilter].slice.reducer }),
  {} as Record<TxFilterTypes, Reducer<TxFilterState>>
);
