import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { SearchDropdown } from '@components/search/search-dropdown';
import { SearchBox } from '@components/search/search-box';
import { useSearchFocus } from '@common/hooks/search/use-search-focus';

type Variant = 'default' | 'small';

export const SearchComponent: React.FC<BoxProps & { variant?: Variant }> = React.memo(
  ({ variant, ...props }) => {
    const containerRef = React.useRef<any>(null);
    const inputRef = React.useRef<any>(null);
    const isLoadingTimeoutRef = React.useRef<number | null>(null);
    const [_, bind] = useSearchFocus();
    return (
      <Box position="relative" ref={containerRef} {...props} {...bind}>
        <SearchBox timeoutRef={isLoadingTimeoutRef} inputRef={inputRef} variant={variant} />
        <SearchDropdown
          containerRef={containerRef}
          timeoutRef={isLoadingTimeoutRef}
          inputRef={inputRef}
          variant={variant}
        />
      </Box>
    );
  }
);
