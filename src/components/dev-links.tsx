import React from 'react';
import Link from 'next/link';
import { Box } from '@blockstack/ui';

export const DevLinks = () => (
  <Box position="absolute" bottom="base" right="base">
    <Link href="/components">Components</Link>
  </Box>
);
