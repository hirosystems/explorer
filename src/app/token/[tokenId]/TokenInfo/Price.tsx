import { getIsSBTC } from '@/app/tokens/utils';
import { Flex, StackProps } from '@chakra-ui/react';
import { FC } from 'react';

import { StatSection } from '../../../_components/Stats/StatSection';
import { TrendArrow } from './TrendArrow';

export const Price: FC<
  StackProps & {
    currentPrice: number | null | undefined;
    priceChangePercentage24h: number | null | undefined;
    currentPriceInBtc: number | null | undefined;
    tokenId: string;
  }
> = ({ currentPrice, priceChangePercentage24h, currentPriceInBtc, tokenId, ...stackProps }) => {
  const isSBTC = getIsSBTC(tokenId);
  return (
    <StatSection
      title="Price"
      bodyMainText={
        currentPrice
          ? `$${parseFloat(currentPrice.toFixed(2)).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}`
          : 'N/A'
      }
      bodySecondaryText={
        priceChangePercentage24h ? <TrendArrow change={priceChangePercentage24h} size="4" /> : null
      }
      caption={
        <Flex fontSize={3} fontWeight="500" alignItems={'center'} gap={1.5}>
          {isSBTC
            ? null
            : currentPriceInBtc
              ? `${parseFloat(currentPriceInBtc.toFixed(8)).toLocaleString(undefined, {
                  maximumFractionDigits: 8,
                })} BTC`
              : 'N/A'}
        </Flex>
      }
      {...stackProps}
    />
  );
};
