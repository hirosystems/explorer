import { FlexProps } from '@chakra-ui/react';
import { FC } from 'react';

import { numberToString } from '../../../../common/utils/utils';
import { Flex } from '../../../../ui/Flex';
import { StatSection } from '../../../_components/Stats/StatSection';
import { TrendArrow } from './TrendArrow';

export const MarketCap: FC<
  FlexProps & {
    marketCap: number | null | undefined;
    tradingVolume24h: number | null | undefined;
    tradingVolumeChangePercentage24h: number | null | undefined;
  }
> = ({ marketCap, tradingVolumeChangePercentage24h, tradingVolume24h, ...flexProps }) => {
  return (
    <StatSection
      title="Market Cap"
      bodyMainText={marketCap ? `$${numberToString(marketCap)}` : 'N/A'}
      bodySecondaryText={null}
      caption={
        <Flex fontSize={'12px'} fontWeight="500" alignItems={'center'} gap={'6px'}>
          Trading Volume: ${tradingVolume24h ? numberToString(tradingVolume24h) : 'N/A'}
          {tradingVolumeChangePercentage24h ? (
            <TrendArrow change={tradingVolumeChangePercentage24h} size={'11px'} />
          ) : null}
        </Flex>
      }
      {...flexProps}
    />
  );
};
