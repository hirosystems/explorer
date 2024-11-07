import { Box, Grid } from '@chakra-ui/react';
import { FC } from 'react';

import { PopularContracts } from './PopularContracts';
import { SearchContractsForm } from './SearchContractsForm';

export const DefaultView: FC<{
  rootContractAddress: string;
}> = ({ rootContractAddress }) => (
  <Grid
    width="calc((1142px / 3) * 2)"
    gridTemplateColumns="repeat(2, 1fr)"
    flexGrow={1}
    flexShrink={1}
  >
    <Box borderRightWidth="1px">
      <SearchContractsForm rootContractAddress={rootContractAddress} />
    </Box>
    <Box p={4}>
      <PopularContracts rootContractAddress={rootContractAddress} />
    </Box>
  </Grid>
);
