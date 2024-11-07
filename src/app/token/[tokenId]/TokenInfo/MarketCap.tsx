import { Flex, StackProps } from '@chakra-ui/react';
import { FC } from 'react';

import { abbreviateNumber } from '../../../../common/utils/utils';
import { StatSection } from '../../../_components/Stats/StatSection';
import { TrendArrow } from './TrendArrow';

export const MarketCap: FC<
  StackProps & {
    marketCap: number | null | undefined;
    tradingVolume24h: number | null | undefined;
    tradingVolumeChangePercentage24h: number | null | undefined;
    marketCapOverride?: number | null | undefined;
  }
> = ({
  marketCap,
  tradingVolumeChangePercentage24h,
  tradingVolume24h,
  marketCapOverride,
  ...stackProps
}) => {
  return (
    <StatSection
      title="Market Cap"
      bodyMainText={
        marketCapOverride
          ? `$${abbreviateNumber(marketCapOverride, 2)}`
          : marketCap
            ? `$${abbreviateNumber(marketCap, 2)}`
            : 'N/A'
      }
      bodySecondaryText={null}
      caption={
        <Flex fontSize={'12px'} fontWeight="500" alignItems={'center'} gap={'6px'}>
          Trading Volume: ${tradingVolume24h ? abbreviateNumber(tradingVolume24h, 2) : 'N/A'}
          {tradingVolumeChangePercentage24h ? (
            <TrendArrow change={tradingVolumeChangePercentage24h} size={'11px'} />
          ) : null}
        </Flex>
      }
      {...stackProps}
    />
  );
};
