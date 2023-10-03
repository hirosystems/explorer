import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { NumberedBadge } from '@/components/numbered-badge';
import { Stack, StackProps } from '@/ui/components';

interface TokenBalancesRowProps extends StackProps {
  balances?: AddressBalanceResponse;
}

export function TokenBalancesRow({ balances }: TokenBalancesRowProps) {
  const FTokens = Object.keys(balances?.fungible_tokens ?? {}).filter(
    key => Number(balances?.fungible_tokens?.[key]?.balance) > 0
  );
  return (
    <Stack isInline spacing="16px">
      <NumberedBadge array={FTokens} singular="token" />
      <NumberedBadge
        array={Object.keys(balances?.non_fungible_tokens || [])}
        singular="collectible"
      />
    </Stack>
  );
}
