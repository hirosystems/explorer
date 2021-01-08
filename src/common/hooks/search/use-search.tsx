import * as React from 'react';

import debounce from 'just-debounce-it';

import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  searchQueryState,
  searchResultItemState,
  searchExitingState,
  searchLoadingState,
  searchValueState,
} from '@store/search';
import { useItem } from '@common/hooks/search/use-item';
import { usePrevious } from '@common/hooks/search/use-previous';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';

export const useSearch = (ref: any, isLoadingTimeoutRef: any) => {
  const { recentItemsArray } = useRecentlyViewedItems();
  const [query, handleSetQuery] = useRecoilState(searchQueryState);
  const [value, setValue] = useRecoilState(searchValueState);
  const [exiting, handleSetExiting] = useRecoilState(searchExitingState);
  const [isLoading, setIsLoading] = useRecoilState(searchLoadingState);
  const { data: previous, isValidating: searchResultsValidating, setPrevious } = usePrevious();
  const [item, itemValidating] = useItem();

  const setItem = useSetRecoilState(
    searchResultItemState(previous?.found && previous.result.entity_id)
  );

  const resetValue = () => {
    setValue('');
    handleSetQuery(null);
  };

  const handleExiting = React.useCallback(() => {
    resetValue();
    handleSetExiting(true);
  }, [handleSetExiting]);

  const handleClearState = React.useCallback(() => {
    resetValue();
    setItem(null);
    setPrevious(null);
  }, [handleSetQuery, setItem, setPrevious, ref]);

  const debouncedSetQuery = React.useCallback(
    debounce((query: string | null) => {
      handleSetQuery(query);
    }, 350),
    [handleSetQuery]
  );

  const handleUpdateQuery = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const v = e.currentTarget.value;
      setValue(v);
      debouncedSetQuery(v === '' ? null : v);
    },
    [debouncedSetQuery]
  );

  const handleSetLoading = React.useCallback(() => {
    const loading = itemValidating || searchResultsValidating;
    if (!isLoading && loading) {
      setIsLoading((v: any) => {
        return true;
      });
    }
  }, [itemValidating, searchResultsValidating, isLoading, setIsLoading]);

  const handleSetLoadingFalse = React.useCallback(() => {
    const loading = itemValidating || searchResultsValidating;
    if (isLoading && !loading) {
      setIsLoading((v: any) => {
        return false;
      });
    }
  }, [itemValidating, searchResultsValidating, isLoading, setIsLoading]);

  React.useEffect(() => {
    if ((itemValidating || searchResultsValidating) && !isLoading) {
      handleSetLoading();
    } else {
      handleSetLoadingFalse();
    }
  }, [
    itemValidating,
    searchResultsValidating,
    isLoading,
    handleSetLoading,
    isLoadingTimeoutRef.current,
  ]);

  // React.useEffect(() => {
  //   if (!value) {
  //     if (recentItemsArray.length === 0) {
  //       if (previous || item) {
  //         handleSetExiting(false);
  //       }
  //     } else {
  //       handleClearState();
  //     }
  //   }
  // }, [query, value, previous, item]);

  return {
    value,
    setValue,
    resetValue,
    query,
    handleSetQuery,
    handleExiting,
    handleUpdateQuery,
    handleClearState,
    handleSetExiting,
    exiting,
    isLoading,
    previous,
    item,
  };
};
