import { SearchResultsCard } from '@/features/search/dropdown/search-results-card';
import { SearchBox } from '@/features/search/search-field/search-box';
import { Box, BoxProps } from '@/ui/components';
import * as React from 'react';

type Variant = 'default' | 'small';

export const SearchComponent: React.FC<BoxProps & { variant?: Variant }> = ({
  variant,
  ...props
}) => {
  return (
    <Box position="relative" {...props}>
      <SearchBox variant={variant} />
      <SearchResultsCard />
    </Box>
  );
};
