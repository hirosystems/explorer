import { configureStore } from '@reduxjs/toolkit';
import { modalSlice } from '@components/modals/modal-slice';
import { searchSlice } from '@features/search/search-slice';

export const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    search: searchSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
