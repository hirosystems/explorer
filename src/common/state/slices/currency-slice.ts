import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from '../../state/hooks';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BTC = 'BTC',
}

export interface CurrencyState {
  currency: Currency;
}

export const initialState: CurrencyState = {
  currency: Currency.USD,
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;

export const useCurrency = () => useAppSelector(state => state.currency.currency);
