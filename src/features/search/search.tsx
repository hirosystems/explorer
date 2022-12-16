import { SearchResultsCard } from '@features/search/dropdown/search-results-card';
import { SearchBox } from '@features/search/search-field/search-box';
import * as React from 'react';

import { Box, BoxProps } from '@stacks/ui';

import { SafeSuspense } from '@components/ssr-safe-suspense';

type Variant = 'default' | 'small';

export const SearchComponent: React.FC<BoxProps & { variant?: Variant }> = ({
  variant,
  ...props
}) => {
  return (
    <Box position="relative" {...props}>
      <SafeSuspense fallback={<></>}>
        <SearchBox variant={variant} />
      </SafeSuspense>
      <SafeSuspense fallback={<></>}>
        <SearchResultsCard />
      </SafeSuspense>
    </Box>
  );
};
