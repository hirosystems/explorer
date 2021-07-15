import React from 'react';
import { Grid } from '@stacks/ui';
import { withInitialQueries } from 'jotai-query-toolkit/nextjs';
import { PageWrapper } from '@components/page-wrapper';
import { Meta } from '@components/meta-head';
import { HomePageTop } from '@components/home-page-top';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';
import { BlocksList } from '@features/blocks-list';

import { DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { getHomePageQueries } from '@common/page-queries/home';
import { pageAtomBuilders } from '@common/page-queries/extra-initial-values';

import type { NextPage } from 'next';

const Home: NextPage = () => {
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
        <TabbedTransactionList limit={DEFAULT_LIST_LIMIT_SMALL} />
        <BlocksList limit={DEFAULT_LIST_LIMIT_SMALL} />
      </Grid>
    </PageWrapper>
  );
};

Home.getInitialProps = () => {
  return { isHome: true };
};

export default withInitialQueries(Home, pageAtomBuilders)(getHomePageQueries);
