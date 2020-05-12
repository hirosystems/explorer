import React from 'react';
import { Flex, Text } from '@blockstack/ui';
import { PageWrapper } from '@components/page';
import { SearchBarWithDropdown } from '@components/search-bar';
import { Meta } from '@components/meta-head';

export const Home = () => (
  <PageWrapper isHome>
    <Meta />
    <Flex flexDirection="column" align="center" maxWidth="544px" mt="20vh" justify="center">
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

      <SearchBarWithDropdown />
    </Flex>
  </PageWrapper>
);

export default Home;
