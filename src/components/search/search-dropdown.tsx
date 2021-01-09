import * as React from 'react';
import { Fade } from '@stacks/ui';
import { SearchResultsCard } from '@components/search/search-results-card';
import { useSearchComponent } from '@common/hooks/search/use-search-component';

type Variant = 'default' | 'small';

export const SearchDropdown = ({
  variant,
  inputRef,
  timeoutRef,
  containerRef,
}: {
  variant?: Variant;
  inputRef: any;
  timeoutRef: any;
  containerRef: any;
}) => {
  const {
    handleClearResults,
    handleItemOnClick,
    query,
    exiting,
    isVisible,
    handleClearState,
    handleSetExiting,
    isLoading,
  } = useSearchComponent({
    variant,
    inputRef,
    timeoutRef,
    containerRef,
  });
  return (
    <Fade
      in={isVisible}
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
