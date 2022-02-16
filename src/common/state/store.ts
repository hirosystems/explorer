import { combineReducers, configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { networkSlice } from './network-slice';
import { modalSlice } from '@components/modals/modal-slice';
import { searchSlice } from '@features/search/search-slice';
import { nextReduxCookieMiddleware, wrapMakeStore } from 'next-redux-cookie-wrapper';
import { createWrapper } from 'next-redux-wrapper';

const rootReducer = combineReducers({
  global: networkSlice.reducer,
  modal: modalSlice.reducer,
  search: searchSlice.reducer,
});

export let store: EnhancedStore;
const makeStore = wrapMakeStore(() => {
  store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(
        nextReduxCookieMiddleware({
          subtrees: ['global'],
        })
      ),
  });
  return store;
});

export const wrapper = createWrapper<AppStore>(makeStore);

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
