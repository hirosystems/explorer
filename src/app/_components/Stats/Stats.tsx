'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FlexProps } from '../../../ui/Flex';
import { CurrentStackingCycle } from './CurrentStackingCycle';
import { LastBlock } from './LastBlock';
import { NextStackingCycle } from './NextStackingCycle';
import { SkeletonStatSection } from './SkeletonStatSection';
import { StxSupply } from './StxSupply';
import { Wrapper } from './Wrapper';

export function Stats(props: FlexProps) {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <Wrapper {...props}>
        <StxSupply borderRightWidth={['0px', '0px', '1px', '1px']} borderColor={'borderPrimary'} />
        <LastBlock borderRightWidth={['0px', '0px', '0px', '1px']} borderColor={'borderPrimary'} />
        <CurrentStackingCycle
          borderRightWidth={['0px', '0px', '1px', '1px']}
          borderColor={'borderPrimary'}
        />
        <NextStackingCycle />
      </Wrapper>
    </ErrorBoundary>
  );
}
