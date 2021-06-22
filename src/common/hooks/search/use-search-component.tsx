import * as React from 'react';
import { useRecentlyViewedItems } from '@common/hooks/search/use-recent-items';
import { useSearch } from '@common/hooks/search/use-search';
import { useHover } from 'web-api-hooks';
import { useRecoilFocus } from '@common/hooks/use-recoil-focus';
import { searchDropdownVisibilitySelector, searchFocusedState } from '@store/recoil/search';
import { useRecoilValue } from 'recoil';
import { useSearchFocus } from '@common/hooks/search/use-search-focus';

type Variant = 'default' | 'small';

export const useSearchComponent = ({
  variant,
  inputRef,
  timeoutRef,
}: {
  variant?: Variant;
  inputRef: any;
  timeoutRef: any;
  containerRef?: any;
}) => {
  const { recentItemsArray } = useRecentlyViewedItems();
  const [isHovered, bindHover] = useHover();
  const [isFocused] = useRecoilFocus(searchFocusedState);
  const [_, __, { removeFocus }] = useSearchFocus();
  const isVisible = useRecoilValue(searchDropdownVisibilitySelector);
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

  const spinnerVisible = query && isLoading;

  const isSmall = variant === 'small';
  const inputLeftOffset = isSmall ? '38px' : '50px';
  const inputRightOffset = spinnerVisible ? '92px' : '60px';
  const defaultHeight = isSmall ? '38px' : '64px';

  const hasSearchResult = (previous && !previous.found) || !!item;

  const hasRecentItems = !!recentItemsArray?.length;

  const handleClearResults = () => {
    inputRef?.current?.focus?.();
    handleClearState();
  };

  React.useEffect(() => {
    return () => handleClearState();
  }, []);

  const handleItemOnClick = React.useCallback(() => {
    handleClearState();
    removeFocus();
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
  };
};
