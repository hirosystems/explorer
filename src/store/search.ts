import { atom, atomFamily, selector } from 'recoil';
import { SearchResult } from '@common/types/search';
import { localStorageEffect } from '@store/utils';
import { convertAddress, getAddressDetails } from '@common/utils/addresses';
import { networkModeState } from '@common/app-helpers';
import { networkCurrentUrlSelector } from '@store/network';

export const searchQueryAtom = atom<string | null>({
  key: 'search.query.base',
  default: null,
});
export const searchQueryState = selector<string | null>({
  key: 'search.query',
  get: ({ get }) => {
    return get(searchQueryAtom);
  },
  set: ({ set, get, reset }, newValue) => {
    const query = get(searchQueryAtom);
    if (query !== newValue) {
      set(searchQueryAtom, newValue);
    }
    const result = get(searchResultsState);
    if (newValue === '' || newValue === null) {
      if (!!result) {
        reset(searchResultsState);
      }
    }
  },
});

export const searchValueState = atom<string>({
  key: 'search.value',
  default: '',
});

export const searchExitingState = atom<boolean>({
  key: 'search.exiting',
  default: false,
});
export const searchLoadingState = atom<boolean>({
  key: 'search.loading',
  default: false,
});
export const searchResultsState = atom<SearchResult | null>({
  key: 'search.results',
  default: null,
});

export const searchResultItemState = atomFamily({
  key: 'search.result.item',
  default: null,
});

export const searchFocusedState = atom<boolean>({
  key: 'search.focused',
  default: false,
});

export const searchRecentlyViewedItemsState = atom({
  key: 'search.recently-viewed-items',
  default: selector({
    key: 'search.recently-viewed-items.default',
    get: () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('recent_search_items');
        if (saved) {
          return JSON.parse(saved);
        }
      }
      return {};
    },
  }),
  effects_UNSTABLE: [localStorageEffect('recent_search_items')],
});

export const searchDropdownState = atom<'hidden' | 'visible'>({
  key: 'search.dropdown',
  default: 'hidden',
});

export const searchDropdownExitingState = atom<boolean>({
  key: 'search.dropdown-exiting',
  default: false,
});

export const searchErrorSelector = selector({
  key: 'search.error',
  get: ({ get }) => {
    const results = get(searchResultsState);
    const query = get(searchQueryState);

    if (query && !results?.found && results?.error) {
      return results.error;
    }

    return null;
  },
});

export const searchResultsSelector = selector({
  key: 'search.results.selector',
  get: ({ get }) => {
    const results = get(searchResultsState);
    const query = get(searchQueryState);

    if (query && !results?.found && results?.error) {
      return results.error;
    }

    return null;
  },
});

export const searchDropdownVisibilitySelector = selector({
  key: 'search.dropdown.visible',
  get: ({ get }) => {
    const apiServer = get(networkCurrentUrlSelector);
    const hasValue = get(searchValueState);
    const query = get(searchQueryState);
    const isFocused = get(searchFocusedState);
    const recentItems = get(searchRecentlyViewedItemsState);
    const keys = Object.keys(recentItems)?.filter(key => key?.startsWith(apiServer)) || [];
    const hasRecentItems = keys.length > 0;
    const hasResults = get(searchResultsState);
    const hasError = get(searchErrorSelector);
    const hasItem = get(searchResultItemState(hasResults?.found && hasResults.result.entity_id));

    if (isFocused) {
      if (!!hasValue || !!query) {
        return !!hasError || !!hasItem || hasRecentItems;
      }
      return hasRecentItems;
    }
    return false;
  },
});

export const searchForAddressOfDifferentType = selector({
  key: 'search.address.network',
  get: ({ get }) => {
    const results = get(searchResultsState);
    const networkMode = get(networkModeState);
    if (
      results &&
      results.found &&
      results?.result.entity_type === 'standard_address' &&
      results?.result?.entity_id
    ) {
      const details = getAddressDetails(results?.result?.entity_id);
      if (networkMode && networkMode !== details.network) {
        return convertAddress(results?.result?.entity_id, networkMode);
      }
      return false;
    }
  },
});
