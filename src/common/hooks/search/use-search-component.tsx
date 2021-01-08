import * as React from 'react';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { useSearch } from '@common/hooks/search/use-search';
import { useSearchDropdown } from '@common/hooks/search/use-search-dropdown';
import { useTimeoutFn } from 'react-use';
import { useFocus, useHover } from 'web-api-hooks';

type Variant = 'default' | 'small';

export const useSearchComponent = ({
  variant,
  inputRef,
  timeoutRef,
}: {
  variant?: Variant;
  inputRef: any;
  timeoutRef: any;
}) => {
  const { isVisible, handleMakeHidden, handleMakeVisible } = useSearchDropdown();
  const { recentItemsArray } = useRecentlyViewedItems();
  const [isHovered, bindHover] = useHover();
  const [_, bindFocus] = useFocus();
  const {
    query,
    handleUpdateQuery,
    handleClearState,
    isLoading,
    previous,
    item,
    exiting,
    handleSetExiting,
    value,
  } = useSearch(inputRef, timeoutRef);

  const isFocused =
    inputRef?.current === (typeof document !== 'undefined' && document?.activeElement);

  const spinnerVisible = query && isLoading;

  const isSmall = variant === 'small';
  const inputLeftOffset = isSmall ? '38px' : '50px';
  const inputRightOffset = spinnerVisible ? '92px' : '60px';
  const defaultHeight = isSmall ? '38px' : '64px';

  const hasSearchResult = (previous && !previous.found) || !!item;

  const hasRecentItems = !!recentItemsArray?.length;

  // const [isReady, cancel, reset] = useTimeoutFn(handleMakeHidden, 100);

  React.useEffect(() => {
    if (isFocused) {
      if (!isVisible) {
        console.log({ isFocusedIsVisible: isVisible });
        handleMakeVisible();
      }
    } else {
      if (isVisible) {
        handleMakeHidden();
      }
    }
    // if (!isFocused && isVisible) {
    //   handleMakeHidden();
    // }
  }, [isFocused, isVisible]);

  // React.useEffect(() => {
  //   if (isFocused) {
  //     if (!isVisible) {
  //       if (hasRecentItems || hasSearchResult) {
  //         cancel();
  //         handleMakeVisible();
  //       }
  //     }
  //   } else {
  //     if (isVisible && !isFocused) {
  //       // reset();
  //       // handleMakeHidden();
  //     }
  //   }
  // }, [isFocused, isVisible, hasRecentItems, hasSearchResult, handleMakeVisible, handleMakeHidden]);

  const handleClearResults = () => {
    inputRef?.current?.focus?.();
    // cancel();
    handleClearState();
  };

  React.useEffect(() => {
    return () => handleClearState();
  }, []);

  const handleItemOnClick = React.useCallback(() => {
    handleClearState();
    inputRef?.current?.blur?.();
  }, [inputRef]);

  return {
    handleClearResults,
    handleItemOnClick,
    handleUpdateQuery,
    isSmall,
    inputLeftOffset,
    inputRightOffset,
    defaultHeight,
    hasSearchResult,
    hasRecentItems,
    isHovered,
    isFocused,
    inputRef,
    spinnerVisible,
    value,
    query,
    exiting,
    isVisible,
    handleClearState,
    handleSetExiting,
    isLoading,
    bindHover,
    bindFocus,
  };
};
