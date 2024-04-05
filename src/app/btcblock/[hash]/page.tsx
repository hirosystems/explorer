'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import { Box } from '../../..//ui/Box';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <Box>Loading</Box>,
  ssr: false,
});

export default Page;
