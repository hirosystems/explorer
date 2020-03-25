import React from 'react';
import { Box } from '@blockstack/ui';

export const Page: React.FC = ({ children }) => (
  <Box as="main" maxWidth="1280px" mx="auto">
    <Box mx={['base', 'extra-loose']}>{children}</Box>
  </Box>
);
