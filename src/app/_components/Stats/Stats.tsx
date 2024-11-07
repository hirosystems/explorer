'use client';

import { FlexProps } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

import { StatsWrapper } from './StatsWrapper';
import {
  CurrentStackingCycleStatSkeleton,
  LastBlockStatSkeleton,
  NextStackingCycleStatSkeleton,
  StxSupplyStatSkeleton,
} from './skeleton';

export const StxSupply = dynamic(() => import('./StxSupply').then(module => module.StxSupply), {
  loading: () => StxSupplyStatSkeleton,
  ssr: false,
});

export const LastBlock = dynamic(() => import('./LastBlock').then(module => module.LastBlock), {
  loading: () => LastBlockStatSkeleton,
  ssr: false,
});

export const CurrentStackingCycle = dynamic(
  () => import('./CurrentStackingCycle').then(module => module.CurrentStackingCycle),
  {
    loading: () => CurrentStackingCycleStatSkeleton,
    ssr: false,
  }
);

export const NextStackingCycle = dynamic(
  () => import('./NextStackingCycle').then(module => module.NextStackingCycle),
  {
    loading: () => NextStackingCycleStatSkeleton,
    ssr: false,
  }
);

export function Stats(props: FlexProps) {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <StatsWrapper {...props}>
        <StxSupply
          borderRight={[
            'none',
            'none',
            '1px solid var(--stacks-colors-border-primary)',
            '1px solid var(--stacks-colors-border-primary)',
          ]}
        />
        <LastBlock
          borderRight={['none', 'none', 'none', '1px solid var(--stacks-colors-border-primary)']}
        />
        <CurrentStackingCycle
          borderRight={[
            'none',
            'none',
            '1px solid var(--stacks-colors-border-primary)',
            '1px solid var(--stacks-colors-border-primary)',
          ]}
        />
        <NextStackingCycle />
      </StatsWrapper>
    </ErrorBoundary>
  );
}
