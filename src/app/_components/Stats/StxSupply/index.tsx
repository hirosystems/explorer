'use client';

import { useStxSupply } from '@/app/signers/data/usStxSupply';

import { numberToString } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { GridProps } from '../../../../ui/Grid';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StatSection } from '../StatSection';

function StxSupplyBase(props: GridProps) {
  const { stackedSupply, circulatingSupply } = useStxSupply();

  return (
    <StatSection
      title="Circulating Supply"
      bodyMainText={numberToString(circulatingSupply)}
      bodySecondaryText={null}
      caption={<>{((stackedSupply / circulatingSupply) * 100).toFixed(1)}% stacked</>}
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
