import AppMicroblockPageError from '@/app/microblock/[hash]/error';
import { SkeletonPageWithOneColumn } from '@/components/loaders/skeleton-transaction';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const AppMicroblockPage = dynamic(() => import('../../app/microblock/[hash]/page'), {
  loading: () => <SkeletonPageWithOneColumn />,
  ssr: false,
});

export default function MicroblockPage() {
  const { query } = useRouter();
  const hash = query.hash as string;
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <AppMicroblockPageError error={error} reset={resetErrorBoundary} />
      )}
    >
      <AppMicroblockPage params={{ hash }} />
    </ErrorBoundary>
  );
}
