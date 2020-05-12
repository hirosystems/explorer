import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';

import { transactions } from './transactions';
import { accounts } from '@store/debug';
import { uiReducer } from '@store/ui';

const middleware = getDefaultMiddleware({ thunk: true });

const rootReducer = combineReducers({
  transactions,
  accounts,
  ui: uiReducer,
});

// @ts-ignore
const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  } else {
    return rootReducer(state, action);
  }
};

export type RootState = ReturnType<typeof rootReducer>;

// create a makeStore function
const makeStore: MakeStore<RootState> = (context: Context) =>
  configureStore({
    reducer,
    devTools: true,
    middleware,
  });

// export an assembled wrapper
export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
