'use client';

import * as React from 'react';

import { UnlockingScheduleModal } from '../../../common/components/modals/unlocking-schedule';
import { useSuspenseAccountBalance } from '../../../common/queries/useAccountBalance';
import { useAddressNonces } from '../../../common/queries/useAddressNonces';
import { hasTokenBalance } from '../../../common/utils/accounts';
import { AddressTxListTabs } from '../../../features/txs-list/tabs/AddressTxListTabs';
import { Stack } from '../../../ui/components';
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
    <>
      <PageTitle>Address details</PageTitle>
      <Wrapper>
        <Stack gap={8}>
          <AddressSummary
            principal={principal}
            hasTokenBalances={hasTokenBalances}
            balances={balance}
            lastExecutedTxNonce={nonces?.last_executed_tx_nonce}
          />
          <AddressTxListTabs address={principal} />
        </Stack>
        {balance && (
          <Stack gap={8}>
            <StxBalance address={principal} />
            <TokenBalanceCard address={principal} />
          </Stack>
        )}
      </Wrapper>
      <UnlockingScheduleModal balance={balance} />
    </>
  );
}
