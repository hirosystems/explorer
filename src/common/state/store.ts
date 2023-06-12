import { ModalState, modalSlice } from '@/components/modals/modal-slice';
import { SearchState, searchSlice } from '@/features/search/search-slice';
import {
  TxFilters,
  filterReducers,
} from '@/features/transactions-filter/transactions-filter-slice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { ConnectState, sandboxSlice } from '../../app/sandbox/sandbox-slice';
import {
  TestnetAvailabilityState,
  testnetAvailabilitySlice,
} from '@/components/testnet-availability/testnet-availability-slice';

const rootReducer = combineReducers({
  modal: modalSlice.reducer,
  search: searchSlice.reducer,
  connect: sandboxSlice.reducer,
  testnetAvailability: testnetAvailabilitySlice.reducer,
  ...filterReducers,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type aa = ReturnType<typeof makeStore>;
export interface RootState extends TxFilters {
  modal: ModalState;
  search: SearchState;
  connect: ConnectState;
  testnetAvailability: TestnetAvailabilityState;
}

export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
