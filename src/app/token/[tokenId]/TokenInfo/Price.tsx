import { Flex, FlexProps } from '@chakra-ui/react';
import { FC } from 'react';

import { StatSection } from '../../../_components/Stats/StatSection';
import { TrendArrow } from './TrendArrow';

export const Price: FC<
  FlexProps & {
    currentPrice: number | null | undefined;
    priceChangePercentage24h: number | null | undefined;
    currentPriceInBtc: number | null | undefined;
  }
> = ({ currentPrice, priceChangePercentage24h, currentPriceInBtc, ...flexProps }) => {
  return (
    <StatSection
      title="Price"
      bodyMainText={currentPrice ? `$${currentPrice}` : 'N/A'}
      bodySecondaryText={
        priceChangePercentage24h ? (
          <TrendArrow change={priceChangePercentage24h} size={'16px'} />
        ) : null
      }
      caption={
        <Flex fontSize={'12px'} fontWeight="500" alignItems={'center'} gap={'6px'}>
          {currentPriceInBtc ? `${currentPriceInBtc.toFixed(8)} BTC` : 'N/A'}
        </Flex>
      }
      {...flexProps}
    />
  );
};
