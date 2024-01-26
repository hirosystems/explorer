import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from '../../state/hooks';

export enum TransactionValueFilterTypes {
  CurrentValue = 'CurrentValue',
  EstimatedValueOnDayOfTransaction = 'EstimatedValueOnDayOfTransaction',
}

export interface TransactionValueFilterState {
  activeTransactionValueFilter: TransactionValueFilterTypes;
}

export const initialState: TransactionValueFilterState = {
  activeTransactionValueFilter: TransactionValueFilterTypes.CurrentValue,
};

export const activeTransactionValueFilterSlice = createSlice({
  name: 'TransactionValueFilter',
  initialState,
  reducers: {
    setTransactionValueFilter: (state, action: PayloadAction<TransactionValueFilterTypes>) => {
      state.activeTransactionValueFilter = action.payload;
    },
  },
});

export const { setTransactionValueFilter } = activeTransactionValueFilterSlice.actions;

export const useTransactionValue = () =>
  useAppSelector(state => state.activeTransactionValueFilter.activeTransactionValueFilter);
