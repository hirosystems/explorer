import { Flex, GridProps } from '@/ui/components';
import { FC } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { TrendArrow } from '@/app/token/[tokenId]/TokenInfo/TrendArrow';
import { StatSection } from '@/app/stats/StatSection';

export const Price: FC<
  GridProps & {
    currentPrice: number | null;
    priceChangePercentage24h: number | null;
    currentPriceInBtc: number | null;
    priceInBtcChangePercentage24h: number | null;
  }
> = ({
  currentPrice,
  priceChangePercentage24h,
  currentPriceInBtc,
  priceInBtcChangePercentage24h,
  ...gridProps
}) => {
  const colorMode = useColorMode().colorMode;
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
        <Flex
          fontSize={'12px'}
          color={'textCaption'}
          fontWeight="500"
          alignItems={'center'}
          gap={'6px'}
        >
          {currentPriceInBtc ? `${currentPriceInBtc.toFixed(8)} BTC` : 'N/A'}
          {priceInBtcChangePercentage24h ? (
            <TrendArrow change={priceInBtcChangePercentage24h} size={'11px'} />
          ) : null}
        </Flex>
      }
      {...gridProps}
    />
  );
};
