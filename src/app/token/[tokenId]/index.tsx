import dynamic from 'next/dynamic';
import { SkeletonPageWithTagsAndTwoColumns } from '@/components/loaders/skeleton-transaction';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';
import AppTokenPageError from '@/app/token/[tokenId]/error';
import { TokenInfoProps } from '@/pages/token/[tokenId]';

const renderLoadingComponent = () => <SkeletonPageWithTagsAndTwoColumns />;

const renderErrorComponent = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => <AppTokenPageError error={error} reset={resetErrorBoundary} />;

export const TokenPageLazy = dynamic(() => import('./page'), {
  loading: renderLoadingComponent,
  ssr: true,
});

export function TokenPage(props: TokenInfoProps) {
  const { query } = useRouter();
  const tokenId = query.tokenId as string;
  return (
    <ErrorBoundary fallbackRender={renderErrorComponent}>
      <TokenPageLazy tokenId={tokenId} tokenInfo={props} />
    </ErrorBoundary>
  );
}
