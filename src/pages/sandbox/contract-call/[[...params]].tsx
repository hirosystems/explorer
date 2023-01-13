import { SkeletonSandbox } from '@/components/loaders/skeleton-transaction';
import { Spinner } from '@/ui/Spinner';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';

const AppSandboxContractPage = dynamic(
  () => import('../../../app/sandbox/contract-call/[[...params]]/page'),
  {
    loading: () => <Spinner alignSelf={'center'} justifySelf={'center'} size={'32px'} />,
    ssr: false,
  }
);

const Layout = dynamic(() => import('@/app/sandbox/layout'), {
  loading: () => <SkeletonSandbox />,
  ssr: false,
});

export default function SandboxContractPage() {
  const { query } = useRouter();
  const contractId = query?.params?.[0] || '';
  const functionName = query?.params?.[1] || '';
  return (
    <Layout>
      <AppSandboxContractPage params={{ params: [contractId, functionName] }} />
    </Layout>
  );
}
