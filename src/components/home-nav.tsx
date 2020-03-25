import React from 'react';
import { Flex, Box } from '@blockstack/ui';
import { BlockstackLogo } from './icons/blockstack-logo';

export const HomeNav = () => (
  <Flex justifyContent="space-between" alignItems="center" height="64px">
    <Box>
      <BlockstackLogo />
    </Box>
    <Box>
      <div>dropdown component</div>
    </Box>
  </Flex>
);
