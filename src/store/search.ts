import { atom, atomFamily, selector } from 'recoil';
import { SearchResult } from '@common/types/search';
import { localStorageEffect } from '@store/utils';

export const searchQueryState = atom<string | null>({
  key: 'search.query',
  default: null,
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
