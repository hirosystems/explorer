'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FlexProps } from '../../../ui/Flex';
import { SkeletonStatSection } from './SkeletonStatSection';
import { Wrapper } from './Wrapper';

export const StxSupply = dynamic(() => import('./StxSupply').then(module => module.StxSupply), {
  loading: () => <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />,
  ssr: false,
});

export const LastBlock = dynamic(() => import('./LastBlock').then(module => module.LastBlock), {
  loading: () => <SkeletonStatSection borderRightWidth={['0px', '0px', '0px', '1px']} />,
  ssr: false,
});

export const CurrentStackingCycle = dynamic(
  () => import('./CurrentStackingCycle').then(module => module.CurrentStackingCycle),
  {
    loading: () => <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />,
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
        <StxSupply borderRightWidth={['0px', '0px', '1px', '1px']} borderColor={'border'} />
        <LastBlock borderRightWidth={['0px', '0px', '0px', '1px']} borderColor={'border'} />
        <CurrentStackingCycle
          borderRightWidth={['0px', '0px', '1px', '1px']}
          borderColor={'border'}
        />
        <NextStackingCycle />
      </Wrapper>
    </ErrorBoundary>
  );
}
