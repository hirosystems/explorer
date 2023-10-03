import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { modalSlice, ModalState } from '@/components/modals/modal-slice';
import { searchSlice, SearchState } from '@/features/search/search-slice';
import {
  filterReducers,
  TxFilters,
} from '@/features/transactions-filter/transactions-filter-slice';

import { ConnectState, sandboxSlice } from '../../appPages/sandbox/sandbox-slice';

const rootReducer = combineReducers({
  modal: modalSlice.reducer,
  search: searchSlice.reducer,
  connect: sandboxSlice.reducer,
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
}

export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
