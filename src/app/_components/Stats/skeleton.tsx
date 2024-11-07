import { StackProps } from '@chakra-ui/react';
import { FC } from 'react';

import { Skeleton } from '../../../components/ui/skeleton';
import { StatSectionLayout } from './StatSection';
import { StatsWrapper } from './StatsWrapper';

export const SkeletonStatSection: FC<StackProps> = props => (
  <StatSectionLayout
    title={<Skeleton height={'4'} width={'75%'} />}
    bodyMainText={<Skeleton height={'6'} width={'40%'} />}
    bodySecondaryText={null}
    caption={<Skeleton height={'4'} width={'75%'} />}
    borderColor={'borderPrimary'}
    {...props}
  />
);

export const StxSupplyStatSkeleton = (
  <SkeletonStatSection
    borderRight={[
      'none',
      'none',
      '1px solid var(--stacks-colors-border-primary)',
      '1px solid var(--stacks-colors-border-primary)',
    ]}
  />
);

export const LastBlockStatSkeleton = (
  <SkeletonStatSection
    borderRight={['none', 'none', 'none', '1px solid var(--stacks-colors-border-primary)']}
  />
);

export const CurrentStackingCycleStatSkeleton = (
  <SkeletonStatSection
    borderRight={[
      'none',
      'none',
      '1px solid var(--stacks-colors-border-primary)',
      '1px solid var(--stacks-colors-border-primary)',
    ]}
  />
);

export const NextStackingCycleStatSkeleton = <SkeletonStatSection />;

export const StatsSkeleton = () => (
  <StatsWrapper>
    <SkeletonStatSection
      borderRight={[
        'none',
        'none',
        '1px solid var(--stacks-colors-border-primary)',
        '1px solid var(--stacks-colors-border-primary)',
      ]}
    />
    <SkeletonStatSection
      borderRight={['none', 'none', 'none', '1px solid var(--stacks-colors-border-primary)']}
    />
    <SkeletonStatSection
      borderRight={[
        'none',
        'none',
        '1px solid var(--stacks-colors-border-primary)',
        '1px solid var(--stacks-colors-border-primary)',
      ]}
    />
    <SkeletonStatSection />
  </StatsWrapper>
);
