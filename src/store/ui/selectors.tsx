import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store';

const selectUiSlice = (state: RootState) => state.ui;
export const selectToasts = createSelector(selectUiSlice, state => state.toasts);
