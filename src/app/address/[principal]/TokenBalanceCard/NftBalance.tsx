'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import {
  AddressBalanceResponse,
  NonFungibleTokenHoldingsList,
} from '@stacks/stacks-blockchain-api-types';

import { TwoColumnsListItemSkeleton } from '../../../../common/components/TwoColumnsListItemSkeleton';
import { Grid } from '../../../../ui/Grid';
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

export const NftBalance: React.FC<{
  balance: AddressBalanceResponse;
  bnsHexValues: any;
  nftHoldings?: NonFungibleTokenHoldingsList;
}> = ({ balance, bnsHexValues, nftHoldings }) => {
  return Object.keys(balance.non_fungible_tokens).length ? (
    <>
      {Object.keys(balance.non_fungible_tokens).map((key, index, arr) => (
        <TokenAssetListItem
          amount={balance.non_fungible_tokens[key]?.count || ''}
          holdings={nftHoldings?.results?.filter(nftHolding => nftHolding.asset_identifier === key)}
          key={index}
          token={key}
          tokenType="non_fungible_tokens"
          bnsName={
            bnsHexValues[key]
              ? `${bnsHexValues[key].name}.${bnsHexValues[key].namespace}`
              : undefined
          }
        />
      ))}
    </>
  ) : (
    <Grid minHeight="220px" textAlign="center" placeItems="center" padding="16px">
      <Caption>This account has no collectibles.</Caption>
    </Grid>
  );
};
