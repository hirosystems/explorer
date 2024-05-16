'use client';

import { useSuspenseStxSupply } from '../../../../common/queries/useStxSupply';
import { numberToString } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { GridProps } from '../../../../ui/Grid';
import { useStxSupply } from '../../../signers/data/useStxSupply';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StatSection } from '../StatSection';

function StxSupplyBase(props: GridProps) {
  const {
    data: { total_stx, unlocked_stx },
  } = useSuspenseStxSupply();
  const { circulatingSupply, stackedSupply } = useStxSupply();
  const stxStackedPercentageFormatted = `${((stackedSupply / circulatingSupply) * 100).toFixed(
    2
  )}%`;

  return (
    <StatSection
      title="STX Supply"
      bodyMainText={numberToString(unlocked_stx ? Number(unlocked_stx) : 0)}
      bodySecondaryText={`/ ${numberToString(total_stx ? Number(total_stx) : 0)}`}
      caption={<>{stxStackedPercentageFormatted} stacked</>}
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
