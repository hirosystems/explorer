import { ExplorerSkeletonLoader } from '@/components/loaders/skeleton-common';
import { GridProps } from '@/ui/components';
import * as React from 'react';
import { FC } from 'react';

import { StatSection } from './StatSection';

export const SkeletonStatSection: FC<GridProps> = props => (
  <StatSection
    title={<ExplorerSkeletonLoader width={'75%'} />}
    bodyMainText={<ExplorerSkeletonLoader width={'80px'} />}
    bodySecondaryText={<ExplorerSkeletonLoader width={'60px'} />}
    caption={<ExplorerSkeletonLoader width={'90%'} />}
    {...props}
  />
);
