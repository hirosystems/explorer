// @ts-nocheck
import React from 'react';

import debounce from 'just-debounce-it';
import {
  recentItemsState,
  searchItemsState,
  searchQueryState,
  searchBarFocus,
  searchBarHover,
  searchBarVisibility,
} from '@store/recoil';
import { useRouter } from 'next/router';

import { useRecoilState, useRecoilStateLoadable, useResetRecoilState } from 'recoil';

export const useRecentItems = () => {
  const [items, setItems] = useRecoilState(recentItemsState);

  const handleUpsertItem = React.useCallback(
    item => {
      setItems({
        ...items,
        [item.entity_id]: { ...item, viewedDate: new Date().toISOString() },
      });
    },
    [items, setItems]
  );

  return { items, setItems, handleUpsertItem };
};

export const useSearchResults = () => {
  const [result, setResult] = useRecoilStateLoadable(searchItemsState);
  const resetResults = useResetRecoilState(searchItemsState);

  return { result, setResult, resetResults };
};

export const useSearchQuery = () => {
  const [query, setQuery] = useRecoilState(searchQueryState);
  return { query, setQuery };
};

export const useSearch = (ref?: any) => {
  const { query, setQuery } = useSearchQuery();
  const [isFocused, setFocus] = useRecoilState(searchBarFocus);
  const [isHovered, setHover] = useRecoilState(searchBarHover);
  const [visibility, setVisibility] = useRecoilState(searchBarVisibility);

  const input =
    ref?.current || (typeof document !== 'undefined' && document.getElementById('search-bar'));

  const router = useRouter();
  React.useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setQuery(undefined);
      input?.blur?.();
    });
  }, [setQuery, input, router]);

  const clearError = () => {
    setQuery(undefined);
    input.value = '';
    input?.focus?.();
  };

  const updateQuery = debounce((v: string) => setQuery(v), 250);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.currentTarget.value || e.currentTarget.value === '') clearError();
    updateQuery(e.currentTarget.value);
  };

  const isVisible = visibility === 'visible';

  React.useEffect(() => {
    if (isFocused) {
      if (!isVisible) {
        setVisibility('visible');
      }
    } else {
      if (!isHovered) {
        setVisibility('hidden');
      }
    }
  }, [isFocused, visibility, isHovered]);

  const hideImmediately = () => {
    setVisibility('hidden');
    setHover(false);
    setFocus(false);
    input.blur?.();
  };

  const resultsShowing = isVisible;

  return {
    query,
    setQuery,
    clearError,
    clearQuery: clearError,
    handleSearch,
    resultsShowing,
    isFocused,
    setFocus,
    isHovered,
    setHover,
    hideImmediately,
  };
};
