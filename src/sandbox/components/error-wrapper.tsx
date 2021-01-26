import { ErrorBoundary } from 'react-error-boundary';
import React from 'react';

export const ErrorWrapper: React.FC<{ onReset: () => void; fallback: React.FC<any> }> = ({
  children,
  onReset,
  fallback,
}) => {
  return (
    <ErrorBoundary FallbackComponent={fallback} onReset={onReset}>
      {children}
    </ErrorBoundary>
  );
};
