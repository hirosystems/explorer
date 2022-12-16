import React, { FC } from 'react';

import { Box, Grid } from '@stacks/ui';

import { border } from '@common/utils';

import { Layout } from '../../Layout';
import { PopularContracts } from './PopularContracts';
import { SearchContractsForm } from './SearchContractsForm';

export const DefaultView: FC<{
  rootContractAddress: string;
}> = ({ rootContractAddress }) => (
  <Layout>
    <Grid
      minHeight="600px"
      width="calc((1142px / 3) * 2)"
      gridTemplateColumns="repeat(2, 1fr)"
      flexGrow={1}
      flexShrink={1}
    >
      <Box borderRight={border()}>
        <SearchContractsForm rootContractAddress={rootContractAddress} />
      </Box>
      <Box p="base">
        <PopularContracts rootContractAddress={rootContractAddress} />
      </Box>
    </Grid>
  </Layout>
);
