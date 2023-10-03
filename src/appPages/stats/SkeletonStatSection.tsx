import { ExplorerSkeletonLoader } from '@/components/loaders/skeleton-common';
import { GridProps } from '@/ui/components';

import { StatSection } from './StatSection';

export function SkeletonStatSection(props: GridProps) {
  return (
    <StatSection
      title={<ExplorerSkeletonLoader width="75%" />}
      bodyMainText={<ExplorerSkeletonLoader width="80px" />}
      bodySecondaryText={<ExplorerSkeletonLoader width="60px" />}
      caption={<ExplorerSkeletonLoader width="90%" />}
      {...props}
    />
  );
}
