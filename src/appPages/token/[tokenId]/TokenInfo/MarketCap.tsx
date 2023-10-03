import { Flex, GridProps } from '@/ui/components';

import { TrendArrow } from '@/appPages/token/[tokenId]/TokenInfo/TrendArrow';
import { numberToString } from '@/common/utils';
import { StatSection } from '@/appPages/stats/StatSection';

export function MarketCap({
  marketCap,
  tradingVolumeChangePercentage24h,
  tradingVolume24h,
  ...gridProps
}: GridProps & {
  marketCap: number | null;
  tradingVolume24h: number | null;
  tradingVolumeChangePercentage24h: number | null;
}) {
  return (
    <StatSection
      title="Market Cap"
      bodyMainText={marketCap ? `$${numberToString(marketCap)}` : 'N/A'}
      bodySecondaryText={null}
      caption={
        <Flex fontSize="12px" color="textCaption" fontWeight="500" alignItems="center" gap="6px">
          Trading Volume: ${tradingVolume24h ? numberToString(tradingVolume24h) : 'N/A'}
          {tradingVolumeChangePercentage24h ? (
            <TrendArrow change={tradingVolumeChangePercentage24h} size="11px" />
          ) : null}
        </Flex>
      }
      {...gridProps}
    />
  );
}
