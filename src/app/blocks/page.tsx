'use client';

import dynamic from 'next/dynamic';

import BlocksPageSkeleton from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <BlocksPageSkeleton />,
  ssr: true,
});

export default Page;
