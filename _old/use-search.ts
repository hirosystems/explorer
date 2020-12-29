import React from 'react';

import {
  recentItemsState,
  searchBarFocus,
  searchBarHover,
  searchBarVisibility,
  searchItemsState,
  searchQueryState,
} from '@store';

import debounce from 'just-debounce-it';
import { useRouter } from 'next/router';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useLoadableValue } from '@common/hooks/use-loadable';

export const useSearchResults = () => {
  const { value: result, contents, state } = useLoadableValue(searchItemsState);
  const setResult = useSetRecoilState(searchItemsState);
  const resetResults = useResetRecoilState(searchItemsState);

  const hasError =
    contents &&
    'error' in contents &&
    contents.error &&
    'message' in contents.error &&
    contents.error;

  const hasResults = !!result?.data?.length;

  console.log(result);
  const isLoading = state === 'loading';

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
      input.focus();
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
  }, [isFocused, visibility, isVisible, isHovered]);

  const hideImmediately = () => {
    setVisibility('hidden');
    setHover(false);
    setFocus(false);
    input.blur?.();
  };

  const hasRecentItems = Object.values(items)?.length > 0;

  console.log('has', hasRecentItems);

  const hasSomethingToShow = !!hasError || hasResults || hasRecentItems;

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
