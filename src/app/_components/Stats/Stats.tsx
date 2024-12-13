'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

import { FlexProps } from '../../../ui/Flex';
import { SkeletonStatSection } from './SkeletonStatSection';
import { Wrapper } from './Wrapper';

export const StxSupply = dynamic(() => import('./StxSupply').then(module => module.StxSupply), {
  loading: () => (
    <SkeletonStatSection
      borderRight={[
        'none',
        'none',
        '1px solid var(--stacks-colors-border-primary)',
        '1px solid var(--stacks-colors-border-primary)',
      ]}
    />
  ),
  ssr: false,
});

export const LastBlock = dynamic(() => import('./LastBlock').then(module => module.LastBlock), {
  loading: () => (
    <SkeletonStatSection
      borderRight={['none', 'none', 'none', '1px solid var(--stacks-colors-border-primary)']}
    />
  ),
  ssr: false,
});

export const CurrentStackingCycle = dynamic(
  () => import('./CurrentStackingCycle').then(module => module.CurrentStackingCycle),
  {
    loading: () => (
      <SkeletonStatSection
        borderRight={[
          'none',
          'none',
          '1px solid var(--stacks-colors-border-primary)',
          '1px solid var(--stacks-colors-border-primary)',
        ]}
      />
    ),
    ssr: false,
  }
);

export const NextStackingCycle = dynamic(
  () => import('./NextStackingCycle').then(module => module.NextStackingCycle),
  {
    loading: () => <SkeletonStatSection />,
    ssr: false,
  }
);

export function Stats(props: FlexProps) {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <Wrapper {...props}>
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
      </Wrapper>
    </ErrorBoundary>
  );
}
