import React from 'react';
import Link from 'next/link';
import { Box } from '@blockstack/ui';

export const DevLinks = () => (
  <Box position="absolute" bottom={4} right={4}>
    <Link href="/components">Components</Link>
  </Box>
);
