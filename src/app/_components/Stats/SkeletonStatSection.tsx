import { FC } from 'react';
import * as React from 'react';

import { ExplorerSkeletonLoader } from '../../../common/components/loaders/skeleton-common';
import { GridProps } from '../../../ui/Grid';
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
