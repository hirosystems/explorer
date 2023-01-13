import { claritySyntax } from '@/app/common/claritySyntax';
import { SkeletonPageWithTagsAndTwoColumns } from '@/components/loaders/skeleton-transaction';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import AppTxidPageError from '../../app/txid/[txid]/error';

export const AppTxidPage = dynamic(() => import('../../app/txid/[txid]/page'), {
  loading: () => <SkeletonPageWithTagsAndTwoColumns />,
  ssr: false,
});

export default function TxidPage() {
  const { query } = useRouter();
  const txid = query.txid as string;
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <AppTxidPageError error={error} reset={resetErrorBoundary} />
      )}
    >
      <AppTxidPage params={{ txid }} claritySyntax={claritySyntax} />
    </ErrorBoundary>
  );
}
