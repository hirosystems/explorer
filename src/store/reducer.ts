import { createReducer } from '@reduxjs/toolkit';

const initialState = 0;

export const reducer = createReducer(initialState, {
  increment: (state, action) => state + action.payload,
  decrement: (state, action) => state - action.payload,
});

export type RootState = ReturnType<typeof reducer>;
