import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { networkSlice, NetworkState } from './network-slice';
import { modalSlice, ModalState } from '@components/modals/modal-slice';
import { searchSlice, SearchState } from '@features/search/search-slice';
import { TxFilters, filterReducers } from '@features/transactions-filter/transactions-filter-slice';
import { sandboxSlice, ConnectState } from '@modules/sandbox/sandbox-slice';

const rootReducer = combineReducers({
  network: networkSlice.reducer,
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
  network: NetworkState;
  modal: ModalState;
  search: SearchState;
  connect: ConnectState;
}

export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
