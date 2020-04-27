import React, { useState } from 'react';
import { Flex, Text } from '@blockstack/ui';
import { Page } from '@components/page';
import { SearchBarWithDropdown } from '@components/search-bar';
import { HomeNavigation } from '@components/home-nav';
import { FooterLinks } from '@components/footer-links';
import { RecentlyViewed } from '@components/recently-viewed';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';
import { search } from '@common/search';
import { Meta } from '@components/meta-head';

export const Home = () => {
  const [query, setQuery] = useState('');
  const recentTxs = useRecentlyViewedTx();

  return (
    <Page>
      <Meta />
      <HomeNavigation />
      <Flex
        as="form"
        flexDirection="column"
        align="center"
        maxWidth="544px"
        mt="20vh"
        justify="center"
        onSubmit={search(query)}
      >
        <Text
          as="h1"
          fontSize="36px"
          display="block"
          width="100%"
          textAlign={['center', 'left']}
          mb="extra-loose"
          color="var(--colors-text-title)"
        >
          Stacks Explorer
        </Text>
        <SearchBarWithDropdown onChange={e => setQuery(e.target.value)} />
      </Flex>
    </Page>
  );
};

export default Home;
