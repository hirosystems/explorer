'use client';

import dynamic from 'next/dynamic';

import BlocksPageSkeleton from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  // loading: () => <BlocksPageSkeleton />, // TODO: fix this loading state
  ssr: true,
});

export default Page;
