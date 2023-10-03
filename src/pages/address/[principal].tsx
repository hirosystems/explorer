import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { ErrorBoundary } from 'react-error-boundary';
import { SkeletonPageWithTwoColumns } from '@/components/loaders/skeleton-transaction';
import AppAddressPageError from '@/appPages/address/[principal]/error';

const AppAddressPage = dynamic(() => import('../../appPages/address/[principal]/page'), {
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
