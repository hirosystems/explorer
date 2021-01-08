import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { SearchDropdown } from '@components/search/search-dropdown';
import { SearchBox } from '@components/search/search-box';

type Variant = 'default' | 'small';

export const SearchComponent: React.FC<BoxProps & { variant?: Variant }> = React.memo(
  ({ variant, ...props }) => {
    const inputRef = React.useRef<any>(null);
    const isLoadingTimeoutRef = React.useRef<number | null>(null);

    return (
      <Box position="relative" {...props}>
        <SearchBox timeoutRef={isLoadingTimeoutRef} inputRef={inputRef} variant={variant} />
        <SearchDropdown timeoutRef={isLoadingTimeoutRef} inputRef={inputRef} variant={variant} />
      </Box>
    );
  }
);
