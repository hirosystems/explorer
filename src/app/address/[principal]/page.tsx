'use client';

import * as React from 'react';

import { UnlockingScheduleModal } from '../../../common/components/modals/unlocking-schedule';
import { AddressTxListTabs } from '../../../common/components/tx-lists/tabs/AddressTxListTabs';
import { useSuspenseAccountBalance } from '../../../common/queries/useAccountBalance';
import { useAddressNonces } from '../../../common/queries/useAddressNonces';
import { hasTokenBalance } from '../../../common/utils/accounts';
import { Flex, Stack } from '../../../ui/components';
import { PageTitle } from '../../_components/PageTitle';
import { AddressSummary } from './AddressSummary';
import { StxBalance } from './StxBalance';
import { TokenBalanceCard } from './TokenBalanceCard';
import { Wrapper } from './Wrapper';

export default function AddressPage({ params: { principal } }: any) {
  const { data: balance } = useSuspenseAccountBalance(principal, { refetchOnWindowFocus: true });
  const { data: nonces } = useAddressNonces({ address: principal });

  const hasTokenBalances = hasTokenBalance(balance);

  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <UnlockingScheduleModal balance={balance} />
      <PageTitle>Address details</PageTitle>
      <Wrapper>
        <Stack spacing="32px">
          <AddressSummary
            principal={principal}
            hasTokenBalances={hasTokenBalances}
            balances={balance}
            lastExecutedTxNonce={nonces?.last_executed_tx_nonce}
          />
          <AddressTxListTabs address={principal} />
        </Stack>
        {balance && (
          <Stack spacing="32px">
            <StxBalance address={principal} />
            <TokenBalanceCard address={principal} />
          </Stack>
        )}
      </Wrapper>
    </Flex>
  );
}
