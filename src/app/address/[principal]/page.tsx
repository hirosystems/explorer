'use client';

import { PageTitle } from '@/app/common/components/PageTitle';
import { useApi } from '@/common/api/client';
import { microStxToStx, truncateMiddle } from '@/common/utils';
import { hasTokenBalance } from '@/common/utils/accounts';
import { TokenBalancesCard } from '@/components/balances/principal-token-balances';
import { StxBalances } from '@/components/balances/stx-balance-card';
import { Meta } from '@/components/meta-head';
import { UnlockingScheduleModal } from '@/components/modals/unlocking-schedule';
import { AddressSummary } from '@/features/address-page/address-summary';
import { AddressQueryKeys, addressQK } from '@/features/address/query-keys';
import { useAddressQueries } from '@/features/address/use-address-queries';
import { Grid, GridProps, Stack } from '@/ui/components';
import * as React from 'react';
import { useQuery } from 'react-query';

import { AddressTxListTabs } from '../../common/components/tx-lists/tabs/AddressTxListTabs';
import { useAddressNonces } from '../../common/queries/useAddressNonces';

const ContentWrapper = (props: GridProps) => {
  return (
    <Grid
      gridColumnGap="32px"
      gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
      gridRowGap={['32px', '32px', 'unset']}
      maxWidth="100%"
      alignItems="flex-start"
      {...props}
    />
  );
};

export default function AddressPage({ params: { principal } }: any) {
  const queries = useAddressQueries();
  const api = useApi();

  const { data: balance } = useQuery(
    addressQK(AddressQueryKeys.accountBalance, principal),
    queries.fetchAccountBalance(principal),
    { refetchOnWindowFocus: true }
  );

  const { data: nftHoldings } = useQuery(
    addressQK(AddressQueryKeys.nftHoldings, principal),
    queries.fetchNftHoldings(principal),
    { refetchOnWindowFocus: true }
  );

  const { data: nonces } = useAddressNonces(api, { address: principal });

  const hasTokenBalances = hasTokenBalance(balance);

  return (
    <>
      <Meta
        title={`STX Address ${truncateMiddle(principal)}`}
        labels={[
          {
            label: 'STX Balance',
            data: `${balance?.stx?.balance ? microStxToStx(balance.stx.balance) : 0} STX`,
          },
        ]}
      />
      <UnlockingScheduleModal balance={balance} />
      <PageTitle>Address details</PageTitle>
      <ContentWrapper>
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
            <StxBalances principal={principal} balances={balance} />
            <TokenBalancesCard balances={balance} nftHoldings={nftHoldings} />
          </Stack>
        )}
      </ContentWrapper>
    </>
  );
}
