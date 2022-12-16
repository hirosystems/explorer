import { BlocksList } from '@features/blocks-list';
import type { NextPage } from 'next';
import * as React from 'react';

import { Grid } from '@stacks/ui';

import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';

import { Meta } from '@components/meta-head';
import { Title } from '@components/typography';

import { TxsListWithTabsMemoized } from '@modules/TransactionList/components/TxsListWithTabsMemoized';
import { Stats } from '@modules/stats/Stats';

const Home: NextPage = () => {
  console.log('[DEBUG] rendering home');
  return (
    <>
      <Meta />
      <Grid
        mt="extra-loose"
        gap="extra-loose"
        gridTemplateColumns={['100%', '100%', '0.6fr 0.4fr']}
        width="100%"
      >
        <Title
          as="h1"
          fontSize="36px"
          display="block"
          width="100%"
          textAlign={['center', 'left']}
          mt="40px"
          mb="0"
          data-test="homepage-title"
          color="white"
        >
          Stacks Explorer
        </Title>
        <Stats />
        <TxsListWithTabsMemoized limit={DEFAULT_LIST_LIMIT_SMALL} />
        <BlocksList enforceLimit limit={DEFAULT_BLOCKS_LIST_LIMIT} />
      </Grid>
    </>
  );
};

export default Home;
