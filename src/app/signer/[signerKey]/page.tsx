'use client';

import dynamic from 'next/dynamic';

import { SignerKeyPageSkeleton } from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <SignerKeyPageSkeleton />,
  ssr: false,
});

export default function SignerKeyPage() {
  return <Page />;
}
