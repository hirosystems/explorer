import * as React from 'react';

import { TwoColumnsListItemSkeleton } from '../../common/components/TwoColumnsListItemSkeleton';

export function SkeletonTxsList({ txsCount = 10 }: { txsCount?: number }) {
  return (
    <>
      {[...Array(txsCount)].map((_, i) => (
        <TwoColumnsListItemSkeleton
          key={i}
          leftContentSubtitle
          leftContentTitle
          rightContentSubtitle
          rightContentTitle
        />
      ))}
    </>
  );
}
