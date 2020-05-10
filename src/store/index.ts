import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';

import { transactions } from './transactions';
import { accounts } from '@store/debug';
import { uiReducer } from '@store/ui';

const middleware = getDefaultMiddleware({ thunk: true });

const rootReducer = combineReducers({
  transactions,
  accounts,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initStore = (preloadedState: RootState) =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState,
    middleware,
  });
