'use client';

import dynamic from 'next/dynamic';

import { BlockPageSkeleton } from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <BlockPageSkeleton />,
  ssr: false,
});

export default Page;
