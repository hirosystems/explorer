import * as React from 'react';
import { Fade } from '@stacks/ui';
import { SearchResultsCard } from '@components/search/search-results-card';
import { useSearchComponent } from '@common/hooks/search/use-search-component';

type Variant = 'default' | 'small';

export const SearchDropdown = ({
  variant,
  inputRef,
  timeoutRef,
}: {
  variant?: Variant;
  inputRef: any;
  timeoutRef: any;
}) => {
  const {
    handleClearResults,
    handleItemOnClick,
    hasRecentItems,
    query,
    exiting,
    isVisible,
    handleClearState,
    handleSetExiting,
    isLoading,
    hasSearchResult,
  } = useSearchComponent({
    variant,
    inputRef,
    timeoutRef,
  });
  return (
    <Fade
      in={!exiting && isVisible && (hasRecentItems || hasSearchResult)}
      onExited={() => {
        if (exiting) {
          handleClearState();
          handleSetExiting(false);
        }
        if (!query) {
          handleClearState();
        }
      }}
    >
      {styles => (
        <SearchResultsCard
          handleItemOnClick={handleItemOnClick}
          clearResults={handleClearResults}
          isLoading={isLoading}
          style={styles}
        />
      )}
    </Fade>
  );
};
