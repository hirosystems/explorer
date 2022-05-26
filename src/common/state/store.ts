import { combineReducers, configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { networkSlice, NetworkState } from './network-slice';
import { modalSlice, ModalState } from '@components/modals/modal-slice';
import { searchSlice, SearchState } from '@features/search/search-slice';
import { nextReduxCookieMiddleware, wrapMakeStore } from 'next-redux-cookie-wrapper';
import { createWrapper } from 'next-redux-wrapper';
import { TxFilters, filterReducers } from '@features/transactions-filter/transactions-filter-slice';

const rootReducer = combineReducers({
  network: networkSlice.reducer,
  modal: modalSlice.reducer,
  search: searchSlice.reducer,
  ...filterReducers,
});

export let store: EnhancedStore;
const makeStore = wrapMakeStore(() => {
  store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(
        nextReduxCookieMiddleware({
          subtrees: ['network'],
        })
      ),
  });
  return store;
});

export const wrapper = createWrapper<AppStore>(makeStore);

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type aa = ReturnType<typeof makeStore>;
export interface RootState extends TxFilters {
  network: NetworkState;
  modal: ModalState;
  search: SearchState;
}

export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
