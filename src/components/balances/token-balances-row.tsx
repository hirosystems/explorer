import * as React from 'react';
import { NumberedBadge } from '@components/numbered-badge';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { Stack, StackProps } from '@stacks/ui';

interface TokenBalancesRowProps extends StackProps {
  balances?: AddressBalanceResponse;
}
export const TokenBalancesRow: React.FC<TokenBalancesRowProps> = ({ balances }) => {
  return (
    <Stack isInline spacing={'base'}>
      <NumberedBadge array={Object.keys(balances?.fungible_tokens || [])} singular="token" />
      <NumberedBadge
        array={Object.keys(balances?.non_fungible_tokens || [])}
        singular="collectible"
      />
    </Stack>
  );
};
