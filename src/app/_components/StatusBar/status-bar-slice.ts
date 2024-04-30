import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../../common/state/store';

export interface StatusBarState {
  isStatusBarActive: boolean;
  statusBarHeight: number;
}

export const initialState: StatusBarState = {
  isStatusBarActive: false,
  statusBarHeight: 0,
};

export const statusBarSlice = createSlice({
  name: 'statusbar',
  initialState,
  reducers: {
    setStatusBar: (state, action: PayloadAction<boolean>) => {
      state.isStatusBarActive = action.payload;
    },
    setStatusBarHeight: (state, action: PayloadAction<number>) => {
      state.statusBarHeight = action.payload;
    },
  },
});

export const { setStatusBar, setStatusBarHeight } = statusBarSlice.actions;

const selectStatusBar = (state: RootState) => state.statusBar;

export const selectIsStatusBarActive = createSelector(
  [selectStatusBar],
  statusBar => statusBar.isStatusBarActive
);
export const selectStatusBarHeight = createSelector(
  [selectStatusBar],
  statusBar => statusBar.statusBarHeight
);
