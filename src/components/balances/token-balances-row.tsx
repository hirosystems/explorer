import * as React from 'react';

import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { Stack, StackProps } from '@stacks/ui';

import { NumberedBadge } from '@components/numbered-badge';

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
