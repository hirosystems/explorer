'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

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

export const FtBalance: React.FC<{ balance: AddressBalanceResponse }> = ({ balance }) => {
  const FTokens = Object.keys(balance.fungible_tokens).filter(
    key => Number(balance.fungible_tokens[key]?.balance) > 0
  );

  return FTokens.length ? (
    <>
      {FTokens?.map((key, index, arr) => (
        <TokenAssetListItem
          amount={balance.fungible_tokens[key]?.balance || ''}
          key={index}
          token={key}
          tokenType="fungible_tokens"
        />
      ))}
    </>
  ) : (
    <Grid minHeight="220px" textAlign="center" placeItems="center" padding="16px">
      <Caption>This account has no tokens.</Caption>
    </Grid>
  );
};
