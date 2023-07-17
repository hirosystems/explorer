import { Flex, GridProps } from '@/ui/components';
import { FC } from 'react';

import { TrendArrow } from '@/app/token/[tokenId]/TokenInfo/TrendArrow';
import { numberToString } from '@/common/utils';
import { StatSection } from '@/app/stats/StatSection';

export const MarketCap: FC<
  GridProps & {
    marketCap: number | null;
    tradingVolume24h: number | null;
    tradingVolumeChangePercentage24h: number | null;
  }
> = ({ marketCap, tradingVolumeChangePercentage24h, tradingVolume24h, ...gridProps }) => {
  return (
    <StatSection
      title="Market Cap"
      bodyMainText={marketCap ? `$${numberToString(marketCap)}` : 'N/A'}
      bodySecondaryText={null}
      caption={
        <Flex
          fontSize={'12px'}
          color={'textCaption'}
          fontWeight="500"
          alignItems={'center'}
          gap={'6px'}
        >
          Trading Volume: ${tradingVolume24h ? numberToString(tradingVolume24h) : 'N/A'}
          {tradingVolumeChangePercentage24h ? (
            <TrendArrow change={tradingVolumeChangePercentage24h} size={'11px'} />
          ) : null}
        </Flex>
      }
      {...gridProps}
    />
  );
};
