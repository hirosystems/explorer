import { SkeletonSandbox } from '@/components/loaders/skeleton-transaction';
import { Spinner } from '@/ui/Spinner';
import dynamic from 'next/dynamic';
import * as React from 'react';

const AppSandboxFaucetPage = dynamic(() => import('../../app/sandbox/faucet/page'), {
  loading: () => <Spinner alignSelf={'center'} justifySelf={'center'} size={'32px'} />,
  ssr: false,
});

const Layout = dynamic(() => import('@/app/sandbox/layout'), {
  loading: () => <SkeletonSandbox />,
  ssr: false,
});

export default function SandboxFaucetPage() {
  return (
    <Layout>
      <AppSandboxFaucetPage />
    </Layout>
  );
}
