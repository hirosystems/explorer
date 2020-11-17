import React from 'react';

import {
  recentItemsState,
  searchItemsState,
  searchQueryState,
  searchBarFocus,
  searchBarHover,
  searchBarVisibility,
} from '@store';

import debounce from 'just-debounce-it';
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

  const clearRecentItems = React.useCallback(
    item => {
      setItems({});
    },
    [setItems]
  );

  return { items, setItems, clearRecentItems, handleUpsertItem };
};

export const useSearchResults = () => {
  const [result, setResult] = useRecoilStateLoadable(searchItemsState);
  const resetResults = useResetRecoilState(searchItemsState);

  const hasError =
    result.contents &&
    'error' in result.contents &&
    result.contents.error &&
    'message' in result.contents.error &&
    result.contents.error;

  const hasResults =
    result.contents &&
    'data' in result.contents &&
    result.contents.data &&
    result.contents.data.length;

  const isLoading = result.state === 'loading';

  return { result, setResult, resetResults, hasError, hasResults, isLoading };
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
  const { hasResults, hasError } = useSearchResults();
  const { items } = useRecentItems();

  const input =
    ref?.current || (typeof document !== 'undefined' && document.getElementById('search-bar'));

  const router = useRouter();
  React.useEffect(() => {
    router.events.on('routeChangeStart', () => {
      if (input) {
        setQuery(undefined);
        input.value = '';
        input?.blur?.();
      }
    });
  }, [setQuery, input, typeof document !== 'undefined', router]);

  const clearError = () => {
    if (input) {
      setQuery(undefined);
      input.value = '';
      input?.blur?.();
    }
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

  const hasRecentItems = Object.values(items)?.length;

  const hasSomethingToShow = hasRecentItems || hasError || hasResults;

  const resultsShowing = hasSomethingToShow && isVisible;

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
