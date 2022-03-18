import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@common/state/store';

export interface State {
  searchTerm: string;
  isFocused: boolean;
}

const initialState: State = {
  searchTerm: '',
  isFocused: false,
};

export const slice = createSlice({
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

export const { setSearchTerm, clearSearchTerm, focus, blur } = slice.actions;

const selectSearch = (state: RootState) => state.search;

export const selectSearchTerm = createSelector([selectSearch], search => search.searchTerm);
export const selectIsSearchFieldFocused = createSelector(
  [selectSearch],
  search => search.isFocused
);

export default slice.reducer;
