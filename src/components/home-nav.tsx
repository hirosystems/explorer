import React from 'react';
import { Flex, Box, Text } from '@blockstack/ui';

import { LogoNavItem } from '@components/header';

export const HomeNavigation: React.FC = () => (
  <Flex as="nav" justifyContent="space-between" alignItems="center" height="64px">
    <LogoNavItem />
    <Box>
      <Text color="var(--colors-text-body)">Testnet</Text>
    </Box>
  </Flex>
);
