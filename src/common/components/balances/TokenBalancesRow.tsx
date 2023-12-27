import pluralize from 'pluralize';
import * as React from 'react';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { HStack } from '../../../ui/HStack';
import { StackProps } from '../../../ui/Stack';
import { Value } from '../Value';

interface TokenBalancesRowProps extends StackProps {
  balances?: AddressBalanceResponse;
}

export const TokenBalancesRow: React.FC<TokenBalancesRowProps> = ({ balances }) => {
  const FTCount = Object.keys(balances?.fungible_tokens ?? {}).filter(
    key => Number(balances?.fungible_tokens?.[key]?.balance) > 0
  ).length;
  const NFTCount = Object.keys(balances?.non_fungible_tokens ?? {}).reduce(
    (prev, curr) => prev + Number(balances?.non_fungible_tokens?.[curr]?.count || '0'),
    0
  );
  return (
    <HStack gap={'16px'}>
      {FTCount ? (
        <Value>
          {FTCount} {pluralize('token', FTCount)}
        </Value>
      ) : null}
      {NFTCount ? (
        <Value>
          {NFTCount} {pluralize('collectible', NFTCount)}
        </Value>
      ) : null}
    </HStack>
  );
};
