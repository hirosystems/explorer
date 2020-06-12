import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';

import logger from 'redux-logger';

import { transactions } from '@store/transactions';
import { sandbox } from '@store/sandbox';
import { uiReducer } from '@store/ui';
import { contracts } from '@store/contracts';

let middleware = getDefaultMiddleware({ thunk: true });

if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined') middleware = middleware.concat(logger);
}

const rootReducer = combineReducers({
  transactions,
  contracts,
  sandbox,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initStore = (preloadedState?: RootState) =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState,
    middleware,
  });

/**
 * for typing dispatch only, generate empty store
 */
const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  middleware,
});

export type AppDispatch = typeof store.dispatch;
