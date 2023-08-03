import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Loading } from './loading';
import { FC } from 'react';

const renderLoadingComponent = () => <Loading />;
const renderErrorComponent = () => null;

const TokensListLazy = dynamic(() => import('./TokensList'), {
  loading: renderLoadingComponent,
  ssr: false,
});

export const TokensList: FC = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        fallbackRender={renderErrorComponent}
        onError={error => {
          // TODO: log error to error reporting service
          console.log(error);
        }}
        onReset={reset}
      >
        <TokensListLazy />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
