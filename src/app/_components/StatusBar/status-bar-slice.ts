import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../../common/state/store';

export interface StatusBarState {
  isStatusBarActive: boolean;
}

export const initialState: StatusBarState = {
  isStatusBarActive: false,
};

export const statusBarSlice = createSlice({
  name: 'statusbar',
  initialState,
  reducers: {
    setStatusBar: (state, action: PayloadAction<boolean>) => {
      state.isStatusBarActive = action.payload;
    },
  },
});

export const { setStatusBar } = statusBarSlice.actions;

const selectStatusBar = (state: RootState) => state.statusBar;

export const selectIsStatusBarActive = createSelector(
  [selectStatusBar],
  statusBar => statusBar.isStatusBarActive
);
