import { ErrorBoundary } from 'react-error-boundary';
import { Card } from '@/components/card';

import { MarketCap } from './MarketCap';
import { Price } from './Price';
import { Transaction } from './Transaction';
import { Supply } from './Supply';
import { TokenInfoProps } from '@/pages/token/[tokenId]';

export function TokenInfo({ tokenInfo, txId }: { tokenInfo: TokenInfoProps; txId: string }) {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <Card
        display="grid"
        gridColumnStart="1"
        gridColumnEnd={['2', '2', '3']}
        gridTemplateColumns={['100%', '100%', '1fr 1fr', '1fr 1fr 1fr 1fr']}
      >
        <Supply
          borderRightWidth={['0px', '0px', '1px', '1px']}
          circulatingSupply={tokenInfo.extended?.circulatingSupply}
          totalSupply={tokenInfo.basic?.totalSupply}
        />
        <Price
          currentPrice={tokenInfo.extended?.currentPrice}
          priceChangePercentage24h={tokenInfo.extended?.priceChangePercentage24h}
          currentPriceInBtc={tokenInfo.extended?.currentPriceInBtc}
          priceInBtcChangePercentage24h={tokenInfo.extended?.priceInBtcChangePercentage24h}
          borderRightWidth={['0px', '0px', '0px', '1px']}
        />
        <MarketCap
          marketCap={tokenInfo.extended?.marketCap}
          tradingVolume24h={tokenInfo.extended?.tradingVolume24h}
          tradingVolumeChangePercentage24h={tokenInfo.extended?.tradingVolumeChangePercentage24h}
          borderRightWidth={['0px', '0px', '1px', '1px']}
        />
        <Transaction txId={txId} tvl={tokenInfo.extended?.tvl} />
      </Card>
    </ErrorBoundary>
  );
}
