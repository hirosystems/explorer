'use client';

import { RootState } from '@/common/state/store';
import { createSlice } from '@reduxjs/toolkit';

export enum TestnetStatus {
  available = 'available',
  unavailable = 'unavailable',
  pending = 'pending',
  uninitialized = 'uninitialized',
}

export interface TestnetAvailabilityState {
  status: TestnetStatus;
}

const initialState: TestnetAvailabilityState = {
  status: TestnetStatus.uninitialized,
};

export const testnetAvailabilitySlice = createSlice({
  name: 'testnetAvailability',
  initialState: initialState,
  reducers: {
    setTestnetPending: state => {
      state.status = TestnetStatus.pending;
    },
    setTestnetAvailable: state => {
      state.status = TestnetStatus.available;
    },
    setTestnetUnavailable: state => {
      state.status = TestnetStatus.unavailable;
    },
  },
});

export const { setTestnetAvailable, setTestnetUnavailable, setTestnetPending } =
  testnetAvailabilitySlice.actions;

export const testnetStatusSelector = (state: RootState): TestnetStatus =>
  state.testnetAvailability.status;
