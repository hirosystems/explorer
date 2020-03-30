import React from 'react';
import { Flex, Box } from '@blockstack/ui';
import { BlockstackLogo } from './icons/blockstack-logo';
import Link from 'next/link';

export const HomeNav = () => (
  <Flex justifyContent="space-between" alignItems="center" height="64px">
    <Box>
      <Link href="/">
        <a>
          <BlockstackLogo />
        </a>
      </Link>
    </Box>
    <Box>Testnet</Box>
  </Flex>
);
