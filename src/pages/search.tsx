import * as React from 'react';
import { Box, Flex } from '@stacks/ui';
import { NextPage } from 'next';
import { SearchComponent } from '@components/search/search';

const Search: NextPage<any> = React.memo(() => {
  return (
    <Flex
      width="100vw"
      height="100vh"
      placeItems="center"
      alignContent="center"
      justifyContent="center"
      bg="black"
    >
      <Box width="100%" maxWidth="800px">
        <SearchComponent />
      </Box>
    </Flex>
  );
});

export default Search;
