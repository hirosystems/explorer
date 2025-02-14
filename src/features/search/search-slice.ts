import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { set } from 'store';

import { RootState } from '../../common/state/store';

export interface SearchState {
  searchTerm: string;
  // This is used to store the search term while the user is typing (before the search is actually triggered)
  tempSearchTerm: string;
  // This is used to store the scroll position of the search preview to programmatically scroll it to match the hidden search input
  searchPreviewScrollLeft: number;
  isFocused: boolean;
}

export const initialState: SearchState = {
  searchTerm: '',
  tempSearchTerm: '',
  searchPreviewScrollLeft: 0,
  isFocused: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setTempSearchTerm: (state, action: PayloadAction<string>) => {
      state.tempSearchTerm = action.payload;
    },
    setSearchPreviewScrollLeft: (state, action: PayloadAction<number>) => {
      state.searchPreviewScrollLeft = action.payload;
    },
    clearSearchTerm: state => {
      state.searchTerm = '';
      state.tempSearchTerm = '';
    },
    focus: state => {
      state.isFocused = true;
    },
    blur: state => {
      state.isFocused = false;
    },
  },
});

export const {
  setSearchTerm,
  setTempSearchTerm,
  setSearchPreviewScrollLeft,
  clearSearchTerm,
  focus,
  blur,
} = searchSlice.actions;

const selectSearch = (state: RootState) => state.search;

export const selectSearchTerm = createSelector([selectSearch], search => search.searchTerm);
export const selectTempSearchTerm = createSelector([selectSearch], search => search.tempSearchTerm);
export const selectSearchPreviewScrollLeft = createSelector(
  [selectSearch],
  search => search.searchPreviewScrollLeft
);
export const selectIsSearchFieldFocused = createSelector(
  [selectSearch],
  search => search.isFocused
);
