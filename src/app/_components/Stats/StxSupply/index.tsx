'use client';

import * as React from 'react';

import { useStxSupply } from '../../../../common/queries/useStxSupply';
import { numberToString } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { GridProps } from '../../../../ui/Grid';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { SkeletonStatSection } from '../SkeletonStatSection';
import { StatSection } from '../StatSection';

function StxSupplyBase(props: GridProps) {
  const { data } = useStxSupply();
  if (!data) return <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />;
  const { total_stx, unlocked_stx, unlocked_percent } = data;
  return (
    <StatSection
      title="STX Supply"
      bodyMainText={numberToString(unlocked_stx ? Number(unlocked_stx) : 0)}
      bodySecondaryText={`/ ${numberToString(total_stx ? Number(total_stx) : 0)}`}
      caption={<>{Number(unlocked_percent || 0).toFixed(2)}% is unlocked</>}
      {...props}
    />
  );
}

export function StxSupply(props: GridProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Box}
      wrapperProps={{ borderRightWidth: ['0px', '0px', '1px', '1px'] }}
      tryAgainButton
    >
      <StxSupplyBase {...props} />
    </ExplorerErrorBoundary>
  );
}
