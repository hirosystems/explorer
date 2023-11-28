import * as React from 'react';

import { Box, BoxProps } from '../../ui/Box';
import { SearchResultsCard } from './dropdown/search-results-card';
import { SearchBox } from './search-field/search-box';

type Variant = 'default' | 'small';

export const Search: React.FC<BoxProps & { variant?: Variant }> = ({ variant, ...props }) => {
  return (
    <Box position="relative" {...props}>
      <SearchBox variant={variant} />
      <SearchResultsCard />
    </Box>
  );
};
