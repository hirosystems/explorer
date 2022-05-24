import * as React from 'react';
import type { NextPage } from 'next';
import { removeKeysWithUndefinedValues, truncateMiddle } from '@common/utils';
import { Meta } from '@components/meta-head';
import { microStxToStx } from '@stacks/ui-utils';
import { Flex, Grid, Stack, GridProps } from '@stacks/ui';
import { StxBalances } from '@components/balances/stx-balance-card';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { hasTokenBalance } from '@common/utils/accounts';
import { Title } from '@components/typography';
import { AddressSummary } from '@features/address-page/address-summary';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';
import { AccountTransactionList } from '@features/account-transaction-list';
import { PageWrapper } from '@components/page-wrapper';
import { AddressNotFound } from '@components/address-not-found';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';
import { ServerResponse } from 'http';
import { QueryClient, useQuery } from 'react-query';
import { store, wrapper } from '@common/state/store';
import { dehydrate } from 'react-query/hydration';
import { getAddressQueries, useAddressQueries } from '@features/address/use-address-queries';
import { addressQK, AddressQueryKeys } from '@features/address/query-keys';
import { useRouter } from 'next/router';
import { selectActiveNetwork, selectActiveNetworkUrl } from '@common/state/network-slice';

const PageTop = () => {
  return (
    <Flex
      mb="extra-loose"
      alignItems={['unset', 'unset', 'flex-end']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'row']}
    >
      <Title mb={['base', 'base', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Address details
      </Title>
    </Flex>
  );
};
const ContentWrapper = (props: GridProps) => {
  return (
    <Grid
      gridColumnGap="extra-loose"
      gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
      gridRowGap={['extra-loose', 'extra-loose', 'unset']}
      maxWidth="100%"
      alignItems="flex-start"
      {...props}
    />
  );
};

const AddressPage: NextPage<any> = ({ error }) => {
  if (error)
    return (
      <>
        <Meta title="Address not found" />
        <AddressNotFound />
      </>
    );

  const queries = useAddressQueries();
  const { query } = useRouter();
  const address = query.principal as string;

  const { data: balance } = useQuery(
    addressQK(AddressQueryKeys.accountBalance, address),
    queries.fetchAccountBalance(address)
  );

  const { data: info } = useQuery(
    addressQK(AddressQueryKeys.accountInfo, address),
    queries.fetchAccountInfo(address)
  );

  const hasTokenBalances = hasTokenBalance(balance);

  useRefreshOnBack('principal');

  return (
    <PageWrapper>
      <UnlockingScheduleModal />
      <Meta
        title={`STX Address ${truncateMiddle(address)}`}
        labels={[
          {
            label: 'STX Balance',
            data: `${balance?.stx?.balance ? microStxToStx(balance.stx.balance) : 0} STX`,
          },
        ]}
      />
      <PageTop />
      <ContentWrapper>
        <Stack spacing="extra-loose">
          <AddressSummary
            principal={address}
            hasTokenBalances={hasTokenBalances}
            balances={balance}
            nonce={info?.nonce}
          />
          <AccountTransactionList contractId={address} />
        </Stack>
        {balance && (
          <Stack spacing="extra-loose">
            <StxBalances principal={address} balances={balance} />
            <TokenBalancesCard balances={balance} />
          </Stack>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
};

const prefetchData = async (
  addressPageQuery: string,
  res: ServerResponse,
  networkUrl?: string
): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  if (!networkUrl) {
    return queryClient;
  }
  const prefetchOptions = { staleTime: 5000 };
  const queries = getAddressQueries(networkUrl);
  try {
    await Promise.all([
      queryClient.prefetchQuery(
        addressQK(AddressQueryKeys.coreApiInfo),
        queries.fetchCoreApiInfo(),
        prefetchOptions
      ),
      queryClient.prefetchQuery(
        addressQK(AddressQueryKeys.accountInfo, addressPageQuery),
        queries.fetchAccountInfo(addressPageQuery),
        prefetchOptions
      ),
      queryClient.prefetchInfiniteQuery(
        addressQK(AddressQueryKeys.mempoolTransactionsForAddress, addressPageQuery),
        queries.fetchMempoolTransactionsForAddress(addressPageQuery),
        prefetchOptions
      ),
      queryClient.prefetchInfiniteQuery(
        addressQK(AddressQueryKeys.transactionsForAddress, addressPageQuery),
        queries.fetchTransactionsForAddress(addressPageQuery),
        prefetchOptions
      ),
      queryClient.prefetchQuery(
        addressQK(AddressQueryKeys.accountBalance, addressPageQuery),
        queries.fetchAccountBalance(addressPageQuery),
        prefetchOptions
      ),
    ]);
  } catch (err) {
    res.statusCode = err.status;
  }
  return queryClient;
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query, res }) => {
  const client = await prefetchData(
    query.principal as string,
    res,
    selectActiveNetworkUrl(store.getState())
  );
  if (res.statusCode >= 400 && res.statusCode < 500) {
    return {
      notFound: true,
    };
  }
  if (res.statusCode >= 500) {
    throw res;
  }
  return {
    props: {
      isHome: false,
      dehydratedState: removeKeysWithUndefinedValues(dehydrate(client)),
    },
  };
});

export default AddressPage;
