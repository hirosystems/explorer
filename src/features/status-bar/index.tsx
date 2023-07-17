import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

const renderLoadingComponent = () => null;
const renderErrorComponent = () => null;

const StatusBarLazy = dynamic(() => import('@/features/status-bar/StatusBar'), {
  loading: renderLoadingComponent,
  ssr: false,
});

export const StatusBar = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        fallbackRender={renderErrorComponent}
        onError={error => {
          console.log(error);
        }}
        onReset={reset}
      >
        <StatusBarLazy />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
