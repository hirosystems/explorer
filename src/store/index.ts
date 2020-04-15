import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';

import { transactions } from './transactions';

const middleware = getDefaultMiddleware({ thunk: true });

const rootReducer = combineReducers({
  transactions,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initStore = (preloadedState: RootState) =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState,
    middleware,
  });
