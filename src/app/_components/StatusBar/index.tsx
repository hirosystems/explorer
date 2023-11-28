import { QueryErrorResetBoundary } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

const renderLoadingComponent = () => null;
const renderErrorComponent = () => null;

const StatusBarLazy = dynamic(() => import('./StatusBar'), {
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
