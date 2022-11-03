import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { HomePageTop } from '@components/home-page-top';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page-wrapper';
import { TxsListWithTabs } from '@modules/TransactionList/components/TxsListWithTabs';
import { BlocksList } from '@features/blocks-list';
import { Grid } from '@stacks/ui';
import * as React from 'react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  console.log('[DEBUG] rendering home');
  return (
    <PageWrapper>
      <Meta />
      <HomePageTop />
      <Grid
        mt="extra-loose"
        gap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'calc(60% - 32px) 40%']}
        width="100%"
      >
        <TxsListWithTabs limit={DEFAULT_LIST_LIMIT_SMALL} />
        <BlocksList enforceLimit limit={DEFAULT_BLOCKS_LIST_LIMIT} />
      </Grid>
    </PageWrapper>
  );
};

export function getServerSideProps() {
  return {
    props: {
      isHome: true,
    },
  };
}

export default Home;
