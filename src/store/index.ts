import { configureStore, createReducer } from '@reduxjs/toolkit';

const initialState = 0;

const reducer = createReducer(initialState, {
  increment: (state, action) => state + action.payload,
  decrement: (state, action) => state - action.payload,
});

export const store = () =>
  configureStore({
    reducer,
  });
export type RootState = ReturnType<typeof reducer>;
