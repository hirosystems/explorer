import React, { ReactNode } from 'react';

import { IS_SSR } from '@common/constants';

export function SafeSuspense({
  children,
  fallback,
}: {
  children?: ReactNode;
  fallback: NonNullable<ReactNode> | null;
}) {
  return IS_SSR ? <>{fallback}</> : <React.Suspense fallback={fallback}>{children}</React.Suspense>;
}
