import * as React from 'react';

import { Box, BoxProps } from '../../ui/Box';
import { SearchResultsCard } from './dropdown/search-results-card';
import { SearchBox } from './search-field/search-box';

export const Search: React.FC<BoxProps> = ({ ...props }) => {
  return (
    <Box flexGrow={1} maxWidth={'474px'} mr={'auto'} {...props}>
      <SearchBox />
      <SearchResultsCard />
    </Box>
  );
};
