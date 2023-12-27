import { FC } from 'react';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Card } from '../../../../common/components/Card';
import { Wrapper } from '../../../_components/Stats/Wrapper';
import { TokenInfoProps } from '../types';
import { MarketCap } from './MarketCap';
import { Price } from './Price';
import { Supply } from './Supply';
import { Transaction } from './Transaction';

export const TokenInfo: FC<{ tokenInfo: TokenInfoProps; txId: string }> = ({ tokenInfo, txId }) => {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <Wrapper>
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
      </Wrapper>
    </ErrorBoundary>
  );
};
