'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import Skeleton from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <Skeleton />,
  ssr: false,
});

export default Page;
