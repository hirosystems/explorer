import React from 'react';
import { Box, Grid } from '@/ui/components';

import { PopularContracts } from './PopularContracts';
import { SearchContractsForm } from './SearchContractsForm';

export function DefaultView({ rootContractAddress }: { rootContractAddress: string }) {
  return (
    <Grid
      minHeight="600px"
      width="calc((1142px / 3) * 2)"
      gridTemplateColumns="repeat(2, 1fr)"
      flexGrow={1}
      flexShrink={1}
    >
      <Box borderRightWidth="1px">
        <SearchContractsForm rootContractAddress={rootContractAddress} />
      </Box>
      <Box p="16px">
        <PopularContracts rootContractAddress={rootContractAddress} />
      </Box>
    </Grid>
  );
}
