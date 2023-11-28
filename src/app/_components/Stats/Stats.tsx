'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Card } from '../../../common/components/Card';
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

export const Stats: FC = () => {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <Wrapper>
        <StxSupply borderRightWidth={['0px', '0px', '1px', '1px']} />
        <LastBlock borderRightWidth={['0px', '0px', '0px', '1px']} />
        <CurrentStackingCycle borderRightWidth={['0px', '0px', '1px', '1px']} />
        <NextStackingCycle />
      </Wrapper>
    </ErrorBoundary>
  );
};
