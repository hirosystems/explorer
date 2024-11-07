'use client';

import { Box, Grid } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useState } from 'react';

import {
  AddressBalanceResponse,
  NonFungibleTokenHoldingsList,
} from '@stacks/stacks-blockchain-api-types';

import { TwoColumnsListItemSkeleton } from '../../../../common/components/TwoColumnsListItemSkeleton';
import { initBigNumber } from '../../../../common/utils/utils';
import { Button } from '../../../../ui/Button';
import { Caption } from '../../../../ui/typography';

const TokenAssetListItem = dynamic(
  () => import('./TokenAssetListItem').then(mod => mod.TokenAssetListItem),
  {
    loading: () => (
      <TwoColumnsListItemSkeleton leftContentTitle leftContentSubtitle rightContentTitle />
    ),
    ssr: false,
  }
);

const ITEMS_PER_PAGE = 5;

export const NftBalance: React.FC<{
  balance: AddressBalanceResponse;
  bnsHexValues: any;
  nftHoldings?: NonFungibleTokenHoldingsList;
}> = ({ balance, bnsHexValues, nftHoldings }) => {
  const nftKeys = Object.keys(balance.non_fungible_tokens);

  const nftKeysWithCount = nftKeys.filter(key =>
    initBigNumber(balance.non_fungible_tokens[key]?.count || '').isGreaterThan(0)
  );

  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleItemsCount(prevCount =>
      Math.min(prevCount + ITEMS_PER_PAGE, nftKeysWithCount.length)
    );
  };

  const visibleNftKeys = nftKeysWithCount.slice(0, visibleItemsCount);

  return nftKeysWithCount.length ? (
    <Box pb={4}>
      <Box>
        {visibleNftKeys.map(key => (
          <TokenAssetListItem
            amount={balance.non_fungible_tokens[key]?.count || ''}
            holdings={nftHoldings?.results?.filter(
              nftHolding => nftHolding.asset_identifier === key
            )}
            key={key}
            token={key}
            tokenType="non_fungible_tokens"
            bnsName={
              bnsHexValues[key]
                ? `${bnsHexValues[key].name}.${bnsHexValues[key].namespace}`
                : undefined
            }
          />
        ))}
      </Box>
      {visibleItemsCount < nftKeysWithCount.length && (
        <Box width={'full'}>
          <Button variant="secondary" onClick={() => handleLoadMore()} width={'full'}>
            Load more
          </Button>
        </Box>
      )}
    </Box>
  ) : (
    <Grid minHeight="220px" textAlign="center" placeItems="center" padding="16px">
      <Caption>This account has no collectibles.</Caption>
    </Grid>
  );
};
