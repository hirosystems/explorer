import React, { memo } from 'react';
import { Flex, Box, Grid } from '@stacks/ui';
import { NextPage, NextPageContext } from 'next';
import { Title } from '@components/typography';
import { BlocksList } from '@components/blocks-list';
import { Meta } from '@components/meta-head';
import { SearchComponent } from '@components/search/search';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';
import { getSsrHomeProps } from '@common/lib/pages/home';
import {
  HOMEPAGE,
  HOMEPAGE_TX_LIST_CONFIRMED,
  HOMEPAGE_TX_LIST_MEMPOOL,
} from '@common/constants/data';

const ITEM_LIMIT = 10;

const PageTop: React.FC = React.memo(() => (
  <Flex
    width="100%"
    flexDirection="column"
    alignItems="center"
    maxWidth={['100%', '100%', 'calc(60% - 32px)']}
    justify="center"
  >
    <Title
      as="h1"
      fontSize="36px"
      display="block"
      width="100%"
      textAlign={['center', 'left']}
      mt="72px"
      mb="extra-loose"
      color="white"
    >
      Stacks Explorer
    </Title>
    <Box width="100%">
      <SearchComponent />
    </Box>
  </Flex>
));

const HomeTransactions: React.FC = memo(() => {
  return (
    <TabbedTransactionList
      key={HOMEPAGE}
      confirmed={{
        key: HOMEPAGE_TX_LIST_CONFIRMED,
        limit: ITEM_LIMIT,
      }}
      mempool={{
        key: HOMEPAGE_TX_LIST_MEMPOOL,
        limit: ITEM_LIMIT,
      }}
    />
  );
});

const Home: NextPage<any> = memo(({ blocks }) => {
  return (
    <>
      <Meta />
      <PageTop />
      <Grid
        mt="extra-loose"
        gap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'calc(60% - 32px) 40%']}
        width="100%"
      >
        <HomeTransactions />
        <BlocksList blocks={blocks.results} />
      </Grid>
    </>
  );
});

export async function getServerSideProps(context: NextPageContext) {
  const { blocks, dehydratedState } = await getSsrHomeProps(context);
  return {
    props: {
      blocks,
      isHome: true,
      dehydratedState,
    },
  };
}

export default Home;
