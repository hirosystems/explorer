import { IS_SSR } from '@common/constants';
import React, { ReactNode } from 'react';

export function SafeSuspense({
  children,
  fallback,
}: {
  children?: ReactNode;
  fallback: NonNullable<ReactNode> | null;
}) {
  return IS_SSR ? <>{fallback}</> : <React.Suspense fallback={fallback}>{children}</React.Suspense>;
}
