import { claritySyntax } from '@/app/common/claritySyntax';
import { SkeletonSandbox } from '@/components/loaders/skeleton-transaction';
import { Spinner } from '@/ui/Spinner';
import dynamic from 'next/dynamic';
import * as React from 'react';

const AppSandboxDeployPage = dynamic(() => import('../../app/sandbox/deploy/page'), {
  loading: () => <Spinner alignSelf={'center'} justifySelf={'center'} size={'32px'} />,
  ssr: false,
});

const Layout = dynamic(() => import('@/app/sandbox/layout'), {
  loading: () => <SkeletonSandbox />,
  ssr: false,
});

export default function SandboxDeployPage() {
  return (
    <Layout>
      <AppSandboxDeployPage claritySyntax={claritySyntax} />
    </Layout>
  );
}
