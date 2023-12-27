import { QueryErrorResetBoundary } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

const renderLoadingComponent = () => null;
const renderErrorComponent = () => null;

const IncidentsStatusBar = dynamic(
  () => import('./IncidentsStatusBar').then(m => m.IncidentsStatusBar),
  {
    loading: renderLoadingComponent,
    ssr: false,
  }
);

export const IncidentsStatusBarWithErrorBoundary = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        fallbackRender={renderErrorComponent}
        onError={error => {
          console.log(error);
        }}
        onReset={reset}
      >
        <IncidentsStatusBar />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
