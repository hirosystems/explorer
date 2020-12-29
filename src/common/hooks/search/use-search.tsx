import * as React from 'react';

import debounce from 'just-debounce-it';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { searchQueryState, searchResultItemState } from '@store/search';
import { useItem } from '@common/hooks/search/use-item';
import { usePrevious } from '@common/hooks/search/use-previous';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';

export const useSearch = (ref: any) => {
  const [query, handleSetQuery] = useRecoilState(searchQueryState);
  const { data: previous, isValidating: searchResultsValidating, setPrevious } = usePrevious();
  const [exiting, handleSetExiting] = React.useState(false);
  const [item, itemValidating] = useItem();
  const [isLoading, setIsLoading] = React.useState(false);

  const isLoadingTimeoutRef = React.useRef<number | null>(null);

  const setItem = useSetRecoilState(
    searchResultItemState(previous?.found && previous.result.entity_id)
  );

  const { recentItemsArray } = useRecentlyViewedItems();

  const handleExiting = React.useCallback(() => {
    if (ref?.current?.value) {
      ref.current.value = null;
    }
    handleSetExiting(true);
  }, [handleSetExiting]);

  const handleClearState = React.useCallback(() => {
    handleSetQuery(null);
    setItem(null);
    setPrevious(null);
    if (ref?.current?.value) {
      ref.current.value = null;
    }
  }, [handleSetQuery, setItem, setPrevious, ref]);

  const debouncedSetQuery = React.useCallback(
    debounce((query: string | null) => {
      handleSetQuery(query);
    }, 350),
    [handleSetQuery]
  );

  const handleUpdateQuery = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      debouncedSetQuery(value);
    },
    [debouncedSetQuery]
  );

  React.useEffect(() => {
    if (!query) {
      if (recentItemsArray.length === 0) {
        if (previous || item) {
          handleSetExiting(false);
        }
      } else {
        handleClearState();
      }
    }
  }, [query, previous, item]);

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

  return {
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
