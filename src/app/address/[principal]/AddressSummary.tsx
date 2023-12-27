import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Section } from '../../../common/components/Section';
import { Value } from '../../../common/components/Value';
import { TokenBalancesRow } from '../../../common/components/balances/TokenBalancesRow';
import { microToStacksFormatted } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';

interface AddressSummaryProps {
  principal: string;
  hasTokenBalances: boolean;
  balances?: AddressBalanceResponse;
  lastExecutedTxNonce?: number | null;
}

export const AddressSummary = ({
  principal,
  hasTokenBalances,
  balances,
  lastExecutedTxNonce,
}: AddressSummaryProps) => {
  return (
    <Section title="Summary">
      <Flex px="16px" width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']}>
          <KeyValueHorizontal
            label={'Address'}
            value={<Value>{principal}</Value>}
            copyValue={principal}
          />
          {hasTokenBalances && (
            <KeyValueHorizontal
              label={'Holdings'}
              value={<TokenBalancesRow balances={balances} />}
            />
          )}
          {!!balances?.stx?.total_fees_sent && (
            <KeyValueHorizontal
              label={'Fees'}
              value={
                <Value>{`${microToStacksFormatted(balances?.stx?.total_fees_sent)} STX`}</Value>
              }
            />
          )}
          {lastExecutedTxNonce !== undefined && (
            <KeyValueHorizontal
              label={'Last executed tx nonce'}
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
