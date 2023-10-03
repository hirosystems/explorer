import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { ErrorBoundary } from 'react-error-boundary';
import { SkeletonPageWithOneColumn } from '@/components/loaders/skeleton-transaction';
import AppMicroblockPageError from '@/appPages/microblock/[hash]/error';

const AppMicroblockPage = dynamic(() => import('../../appPages/microblock/[hash]/page'), {
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
