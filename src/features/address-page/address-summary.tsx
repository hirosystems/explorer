import { microToStacks } from '@/common/utils';
import { TokenBalancesRow } from '@/components/balances/token-balances-row';
import { Section } from '@/components/section';
import { Box, Flex } from '@/ui/components';

import { KeyValueHorizontal } from '../../appPages/common/components/KeyValueHorizontal';
import { Value } from '../../appPages/common/components/Value';
import { useVerticallyStackedElementsBorderStyle } from '../../appPages/common/styles/border';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

export const AddressSummary = ({
  principal,
  hasTokenBalances,
  balances,
  lastExecutedTxNonce,
}: {
  principal: string;
  hasTokenBalances: boolean;
  balances?: AddressBalanceResponse;
  lastExecutedTxNonce?: number | null;
}) => {
  return (
    <Section title="Summary">
      <Flex px="16px" width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']} css={useVerticallyStackedElementsBorderStyle}>
          <KeyValueHorizontal
            label="Address"
            value={<Value>{principal}</Value>}
            copyValue={principal}
          />
          {hasTokenBalances && (
            <KeyValueHorizontal label="Holdings" value={<TokenBalancesRow balances={balances} />} />
          )}
          {!!balances?.stx?.total_fees_sent && (
            <KeyValueHorizontal
              label="Fees"
              value={<Value>{`${microToStacks(balances?.stx?.total_fees_sent)} STX`}</Value>}
            />
          )}
          {lastExecutedTxNonce !== undefined && (
            <KeyValueHorizontal
              label="Last executed tx nonce"
              value={
                <Value>
                  {lastExecutedTxNonce !== null
                    ? lastExecutedTxNonce.toString()
                    : "This account hasn't executed a tx yet"}
                </Value>
              }
            />
          )}
        </Box>
      </Flex>
    </Section>
  );
};
