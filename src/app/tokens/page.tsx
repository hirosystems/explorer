'use client';

import dynamic from 'next/dynamic';

import TokensPageSkeleton from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <TokensPageSkeleton />,
  ssr: false,
});

export default Page;
