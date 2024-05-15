import { Suspense } from 'react';

import { Card } from '../../common/components/Card';
import { TokenPrice } from '../../common/types/tokenPrice';
import { numberToString } from '../../common/utils/utils';
import { Text } from '../../ui/Text';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { StatCardBase } from './StatsCardBase';
import { useStxSupply } from './data/usStxSupply';
import { SignersStatsSectionSkeleton } from './skeleton';

export function StxStackedCardBase({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const { stackedSupply } = useStxSupply();
  const stackedStxUsdValue =
    tokenPrice.stxPrice != null ? tokenPrice.stxPrice * stackedSupply : undefined;
  const stackedStxUsdValueFormatted = stackedStxUsdValue
    ? `$${Math.round(stackedStxUsdValue).toLocaleString()}`
    : undefined;
  const stackedStxBtcValue =
    stackedStxUsdValue && tokenPrice.btcPrice != null && tokenPrice.btcPrice !== 0
      ? stackedStxUsdValue / tokenPrice.btcPrice
      : undefined;
  const stackedStxBtcValueFormatted = stackedStxBtcValue
    ? `${stackedStxBtcValue.toFixed(1)} BTC`
    : undefined;
  const moreInfo =
    stackedStxUsdValueFormatted && stackedStxBtcValueFormatted
      ? `${stackedStxUsdValueFormatted} / ${stackedStxBtcValueFormatted}`
      : undefined;

  return (
    <StatCardBase
      statTitle="STX stacked"
      statValue={numberToString(stackedSupply)}
      moreInfo={
        moreInfo ? (
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="textSubdued"
            whiteSpace="nowrap"
            lineHeight={4}
          >
            {moreInfo}
          </Text>
        ) : null
      }
    />
  );
}

export function StxStackedCard({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <ExplorerErrorBoundary Wrapper={Card} tryAgainButton>
      <Suspense fallback={<SignersStatsSectionSkeleton />}>
        <StxStackedCardBase tokenPrice={tokenPrice} />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
