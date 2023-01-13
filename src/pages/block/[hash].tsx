import AppBlockPageError from '@/app/block/[hash]/error';
import { SkeletonPageWithTwoColumns } from '@/components/loaders/skeleton-transaction';
import { Meta } from '@/components/meta-head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const AppBlockPage = dynamic(() => import('../../app/block/[hash]/page'), {
  loading: () => <SkeletonPageWithTwoColumns />,
  ssr: false,
});

export default function BlockPage() {
  const { query } = useRouter();
  const hash = query.hash as string;
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <AppBlockPageError error={error} reset={resetErrorBoundary} />
      )}
    >
      <AppBlockPage params={{ hash }} />
    </ErrorBoundary>
  );
}
