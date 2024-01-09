'use client';

import dynamic from 'next/dynamic';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => null,
  ssr: false,
});

export default Page;
