import React from 'react';
import { Grid } from '@stacks/ui';
import { withInitialQueries } from 'jotai-query-toolkit/nextjs';
import { PageWrapper } from '@components/page-wrapper';
import { Meta } from '@components/meta-head';
import { HomePageTop } from '@components/home-page-top';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';
import { HomeBlockList } from '@features/blocks-list/HomeBlockList';

import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
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
        <HomeBlockList limit={DEFAULT_BLOCKS_LIST_LIMIT} />
      </Grid>
    </PageWrapper>
  );
};

Home.getInitialProps = () => {
  return { isHome: true };
};

// export function getServerSideProps(ctx: NextPageContext) {
//   // Parse
//   const cookies = nookies.get(ctx);
//   // Set
//   nookies.set(ctx, 'fromGetInitialProps', 'value', {
//     maxAge: 30 * 24 * 60 * 60,
//     path: '/',
//   });
//
//   // Destroy
//   // nookies.destroy(ctx, 'cookieName')
//
//   return { cookies, isHome: true };
// }

export default withInitialQueries(Home)(getHomePageQueries);
