import * as React from 'react';

import { useSearchQuery } from '../../common/queries/useSearchQuery';
import { useAppSelector } from '../../common/state/hooks';
import { Box, BoxProps } from '../../ui/Box';
import { SearchResultsCard } from './dropdown/search-results-card';
import { SearchBox } from './search-field/search-box';
import { selectSearchTerm } from './search-slice';

export const Search: React.FC<BoxProps> = ({ ...props }) => {
  const searchTerm = useAppSelector(selectSearchTerm);
  const searchResponse = useSearchQuery(searchTerm);

  return (
    <Box flexGrow={1} maxWidth={'474px'} mr={'auto'} {...props}>
      <SearchBox isFetching={searchResponse.isFetching} />
      <SearchResultsCard searchResponse={searchResponse} />
    </Box>
  );
};
