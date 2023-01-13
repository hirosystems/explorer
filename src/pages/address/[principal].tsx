import AppAddressPageError from '@/app/address/[principal]/error';
import { SkeletonPageWithTwoColumns } from '@/components/loaders/skeleton-transaction';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const AppAddressPage = dynamic(() => import('../../app/address/[principal]/page'), {
  loading: () => <SkeletonPageWithTwoColumns />,
  ssr: false,
});

export default function AddressPage() {
  const { query } = useRouter();
  const principal = query.principal as string;
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <AppAddressPageError error={error} reset={resetErrorBoundary} />
      )}
    >
      <AppAddressPage params={{ principal }} />
    </ErrorBoundary>
  );
}
