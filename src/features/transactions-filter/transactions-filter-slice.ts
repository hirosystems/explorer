import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { RootState } from '@common/state/store';
import { GetTransactionListTypeEnum } from '@stacks/blockchain-api-client';

export enum TxFilterTypes {
  TransactionsPageTxFilter = 'TransactionsPageTxFilter',
  BlocksPageTxFilter = 'BlocksPageTxFilter',
  SandboxTxFilter = 'SandboxTxFilter',
}

export type TxFilters = { [key in TxFilterTypes]: TxFilterState };

export interface TxFilterState {
  activeFilters: Record<GetTransactionListTypeEnum, boolean>;
  isVisible: boolean;
}

const initialState: TxFilterState = {
  activeFilters: {
    [GetTransactionListTypeEnum.coinbase]: true,
    [GetTransactionListTypeEnum.contract_call]: true,
    [GetTransactionListTypeEnum.token_transfer]: true,
    [GetTransactionListTypeEnum.smart_contract]: true,
    [GetTransactionListTypeEnum.poison_microblock]: true,
  },
  isVisible: false,
};

const createSliceOptions = (filterType: TxFilterTypes) => ({
  name: filterType,
  initialState,
  reducers: {
    toggleFilter: (state: TxFilterState, action: PayloadAction<GetTransactionListTypeEnum>) => {
      state.activeFilters[action.payload] = !state.activeFilters[action.payload];
    },
    toggleVisibility: (state: TxFilterState) => {
      state.isVisible = !state.isVisible;
    },
  },
});

export const createTxFilterSlice = (filterType: TxFilterTypes) => {
  const slice = createSlice(createSliceOptions(filterType));
  const selectTxFilter = (state: RootState) => state[filterType];
  const selectActiveFilters = createSelector([selectTxFilter], search => search.activeFilters);
  const selectIsVisible = createSelector([selectTxFilter], search => search.isVisible);
  return {
    slice,
    actions: slice.actions,
    selectors: { selectActiveFilters, selectIsVisible },
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
