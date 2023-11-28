import * as React from 'react';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { HStack } from '../../../ui/HStack';
import { StackProps } from '../../../ui/Stack';
import { NumberedBadge } from './NumberedBadge';

interface TokenBalancesRowProps extends StackProps {
  balances?: AddressBalanceResponse;
}

export const TokenBalancesRow: React.FC<TokenBalancesRowProps> = ({ balances }) => {
  const FTokens = Object.keys(balances?.fungible_tokens ?? {}).filter(
    key => Number(balances?.fungible_tokens?.[key]?.balance) > 0
  );
  return (
    <HStack gap={'16px'}>
      <NumberedBadge array={FTokens} singular="token" />
      <NumberedBadge
        array={Object.keys(balances?.non_fungible_tokens || [])}
        singular="collectible"
      />
    </HStack>
  );
};
