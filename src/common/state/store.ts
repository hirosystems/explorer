import { configureStore } from '@reduxjs/toolkit';
import modal from '@components/modals/modalSlice';
import search from '@features/search/searchSlice';

export const store = configureStore({
  reducer: {
    modal,
    search,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
