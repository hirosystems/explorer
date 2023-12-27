import * as React from 'react';

import { TwoColsListItem } from '../../common/components/TwoColumnsListItem';
import { TwoColumnsListItemSkeleton } from '../../common/components/TwoColumnsListItemSkeleton';
import { Skeleton } from '../../ui/Skeleton';
import { SkeletonCircle } from '../../ui/SkeletonCircle';

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
