import React from 'react';
import { Flex, Box } from '@blockstack/ui';
import { BlockstackLogo } from './icons/blockstack-logo';
import Link from 'next/link';

export const HomeNavigation: React.FC = () => (
  <Flex as="nav" justifyContent="space-between" alignItems="center" height="64px">
    <Box>
      <Link href="/" passHref>
        <a aria-label="Homepage" title="Stacks Explorer Homepage">
          <BlockstackLogo />
        </a>
      </Link>
    </Box>
    <Box>Testnet</Box>
  </Flex>
);
