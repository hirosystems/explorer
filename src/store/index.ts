import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';

import { transactions } from './transactions';
import { accounts } from '@store/sandbox';
import { uiReducer } from '@store/ui';
import { contracts } from '@store/contracts';

const middleware = getDefaultMiddleware({ thunk: true });

const rootReducer = combineReducers({
  transactions,
  contracts,
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
