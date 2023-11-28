import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../common/state/store';

export interface SearchState {
  searchTerm: string;
  isFocused: boolean;
}

export const initialState: SearchState = {
  searchTerm: '',
  isFocused: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: state => {
      state.searchTerm = '';
    },
    focus: state => {
      state.isFocused = true;
    },
    blur: state => {
      state.isFocused = false;
    },
  },
});

export const { setSearchTerm, clearSearchTerm, focus, blur } = searchSlice.actions;

const selectSearch = (state: RootState) => state.search;

export const selectSearchTerm = createSelector([selectSearch], search => search.searchTerm);
export const selectIsSearchFieldFocused = createSelector(
  [selectSearch],
  search => search.isFocused
);
