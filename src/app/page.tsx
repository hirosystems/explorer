'use client';

import dynamic from 'next/dynamic';

import HomePageSkeleton from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <HomePageSkeleton />,
  ssr: false,
});

export default Page;
