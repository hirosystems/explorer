import { Box, Grid } from '@chakra-ui/react';
import { FC } from 'react';

import { Caption, Text } from '../../../../../ui/typography';
import { PopularContracts } from './PopularContracts';
import { SearchContractsForm } from './SearchContractsForm';

export const DefaultView: FC<{
  rootContractAddress: string;
  errorMessage?: string;
}> = ({ rootContractAddress, errorMessage }) => (
  <Grid
    width="calc((1142px / 3) * 2)"
    gridTemplateColumns="repeat(2, 1fr)"
    flexGrow={1}
    flexShrink={1}
  >
    <Box borderRightWidth="1px">
      <SearchContractsForm rootContractAddress={rootContractAddress} />
      {errorMessage && (
        <Text color={`error`} fontSize={'sm'} px={6}>
          {errorMessage}
        </Text>
      )}
    </Box>
    <Box p={4}>
      <PopularContracts rootContractAddress={rootContractAddress} />
    </Box>
  </Grid>
);
